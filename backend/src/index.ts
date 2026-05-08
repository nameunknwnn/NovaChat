import "dotenv/config";
import express from "express";
import { OpenRouter } from "@openrouter/sdk";
import { prisma } from "./lib/prisma.js";
import jwt from "jsonwebtoken";
import middlewareauth from "./lib/middlewareauth.js";
import bcrypt from "bcrypt";
import cors from "cors";
import Razorpay from "razorpay";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { SYSTEM_PROMPT } from "./lib/prompts/profileprompts.js";


const app = express();

app.use(cors({
  origin:`${process.env.FRONTEND_URL}`
}))

app.use(express.json());

const client = new OpenRouter({
  apiKey: `${process.env.OPENROUTER_API_KEY}`,
});

const razorpay= new Razorpay({
  key_id:"rzp_test_Sm7plr82eFMZvT",
  key_secret:"V3I7fpZ8Ug9YBGKwIzxyhJfS"
})




const REDIRECT_URI = `${process.env.APP_URL}/auth/google/callback`;

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_AUTH_CLIENT!,
  clientSecret: process.env.GOOGLE_AUTH_SECRET !,
  redirectUri: REDIRECT_URI,
});

function makeState() {
  const payload = {
    nonce: crypto.randomBytes(16).toString("hex"),
    iat: Date.now(),
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");

  const sig = crypto
    .createHmac("sha256", process.env.STATE_SECRET!)
    .update(encoded)
    .digest("base64url");

  return `${encoded}.${sig}`;
}

function validateState(state) {
  const [encoded, sig] = state.split(".");

  const expectedSig = crypto
    .createHmac("sha256", process.env.STATE_SECRET!)
    .update(encoded)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return false;
  }

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());

  const FIVE_MINUTES = 5 * 60 * 1000;
  if (Date.now() - payload.iat > FIVE_MINUTES) {
    return false;
  }

  return true;
}


app.get("/auth/google", (_, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_AUTH_CLIENT!,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state: makeState(),
  });

  const GOOGLE_URL = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return res.redirect(GOOGLE_URL);
});


app.get("/auth/google/callback", async (req, res, next) => {
  const { code, state } = req.query;

  if (!code || !state) return next(new Error("Missing Google credential"));

  const isValid = validateState(state);

  if (!isValid) return next(new Error("Invalid state"));

  try {
    const { tokens } = await googleClient.getToken(String(code));

    if (!tokens.id_token) throw new Error("Error with Google Login`");

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_AUTH_CLIENT!,
    });

    const payload = ticket.getPayload();

    const { email, name } = payload;

    if(!payload?.email){
        return res.json({message:"user dont have any email "})
      }
    if(!payload?.name){
        return res.json({message:"user dont have any name "})
      }

    const user= await prisma.user.findUnique({
      where:{
        email:payload?.email
      }
    })


    if (user){
      await prisma.user.update({
        where:{email:payload?.email},
        data:{
          name:payload?.name
        }
      })
    }

    if (!user){
      await prisma.user.create({
        data:{
          email:payload?.email,
          name:payload?.name
        }
      })

    }
    
    const token = jwt.sign({email:payload?.email},`${process.env.JWT_SECRET}`,{ expiresIn: "1h" })
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?token=${token}`
    );
  } catch (error) {
    return next(error);
  }
});




//signup
app.post("/signup", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userfound = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userfound) {
      res.status(422).json({ message: "email alreay exists" });
      return;
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: "",
        email: email,
        password: hashedpassword,
      },
    });
    res.status(200).json({ message: "user created" });
  } catch (e) {
    res.status(500).json(e);
  }
});


//signin
app.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "email not made" });
    }
    if (!user.password) {
      return res.status(500).json({ message: "User password not set" });
    }

    const truepassword = await bcrypt.compare(password, user.password);
    if (!truepassword) {
      return res.status(401).json({ message: "password not correct" });
    }
    const token = jwt.sign({email:email}, `${process.env.JWT_SECRET}`,{ expiresIn: "1h" });

    res.status(200).json({ message: "Signin successful", token: token });
  } catch (e) {
    res.status(500).json(e);
  }
});


app.post("/conversation", middlewareauth, async function (req, res) {
  const email = req.user.email;
  const prompt = req.body.prompt;
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.json({ message: "no user found" });
  }
  const conversation = await prisma.conversation.create({
    data: {
      title: prompt,
      userId: user.id,
    },
  });
  res.status(200).json({ message: "conversation created" , conversationId:conversation.id});
});


app.post("/chat", middlewareauth, async (req: any, res: any) => {
  try {
    const { prompt, conversationId } = req.body;
    const email = req.user.email;

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: user.id,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        content: prompt,
        role: "USER",
        conversationId: conversation.id,
      },
    });

    // Get active profile
    const profile = await prisma.profile.findFirst({
      where: {
        active: true,
      },
    });

    // Build messages array
    const messages: any[] = [];

    if (profile) {
      //@ts-ignore
      const systemprompt=SYSTEM_PROMPT(profile.name,profile.occupation,profile.tratis,profile.preferences)
      messages.push({
      role: "user",
      content: prompt,
    });
      messages.push({
        role: "system",
        content: systemprompt,
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    // Call model
    const result = await client.chat.send({
      chatRequest: {
        messages,
        model: "openai/gpt-oss-120b:free",
      },
    });

    const answer = result?.choices?.[0]?.message?.content || "";

    // Save assistant response
    await prisma.message.create({
      data: {
        content: answer,
        role: "ASSISTANT",
        conversationId: conversation.id,
      },
    });

    return res.status(200).json({
      llm_response: answer,
    });

  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


app.get("/conversation", middlewareauth, async function (req, res) {
  const email = req.user.email;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.json({ message: "no user found" });
    }

    const conversation = await prisma.conversation.findMany({
      where: {
        userId: user.id,
      },
      include:{
        messages:true
      }
    });
    res.status(200).json({conversation:conversation});
  } catch (e) {
    res.status(500).json(e);
  }
});


app.get(
  "/conversation/:conversationId",
  middlewareauth,
  async function (req, res) {
    const userid = req.user.id;
    console.log(userid,"reached user id")
    const conversationId = req.params.conversationId;
    console.log(conversationId,"reached conversation id")
    if (!conversationId || Array.isArray(conversationId)) {
      return res.json({ message: "invalid conversation id" });
    }
    try {
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
          userId: userid,
        },
        include:{
          messages:true
        }
      });
      if (!conversation) {
        return res.status(401).json({ message: "fraud" });
      }

      res.status(200).json({conversation:conversation});
    } catch (e) {
      res.status(500).json({ message: e });
    }
  },
);

app.post("/order", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: 50000, // ₹500
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create order",
    });
  }
});

app.get("/profile", middlewareauth, async (req, res) => {
  const userId = req.user.id;
  try {
    const profiles = await prisma.profile.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
    res.status(200).json({ profiles });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
});

app.post("/profile",middlewareauth,async(req,res)=>{
    const name=req.body.name;
    const preferences=req.body.preferences
    const traits=req.body.traits
    const occupation=req.body.occupation
    const userId=req.user.id;
    const id =req.body.profileId

    const profile= await prisma.profile.findUnique({
      where:{
        id:id
      }
    })
    if (profile){
      await prisma.profile.updateMany({
        data:{
          active:false
        }
      })
      await prisma.profile.update({
        where:{
          id:id
        },
        data:{
          active:true
        }
      })
      res.status(200).json({message:"profile set to active"})
    }else{
      await prisma.profile.create({
      data:{
        name,
        occupation,
        preferences,
        tratis:traits,
        userId:userId,
        active:true
      }
    })
    res.status(200).json({message:"profile is created"})
    }

    
    
})

app.get("/user",middlewareauth,async(req,res)=>{
  const userId=req.user.id;
  const user= await prisma.user.findUnique({
    where:{
      id:userId
    }
  })
  res.status(200).json({user:user})
})


app.listen(3000);
