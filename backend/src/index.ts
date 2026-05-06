import "dotenv/config";
import express from "express";
import { OpenRouter } from "@openrouter/sdk";
import { prisma } from "./lib/prisma.js";
import jwt from "jsonwebtoken";
import middlewareauth from "./lib/middlewareauth.js";
import bcrypt from "bcrypt";
import cors from "cors";





const app = express();

app.use(cors({
  origin:`${process.env.FRONTEND_URL}`
}))

app.use(express.json());

const client = new OpenRouter({
  apiKey: `${process.env.OPENROUTER_API_KEY}`,
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


app.post("/chat", middlewareauth, async function (req: any, res: any) {
  const prompt = req.body.prompt;
  const email = req.user.email;
  const conversationId = req.body.conversationId;
  console.log(conversationId,"this is conversation id")

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user){
    return res.json({message:"user not found"})
  }
  
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId:user.id
    },
  });
  console.log(conversation,"this is conversation")
  
  if (!conversation) {
    return res.json({ message: "conversaiton empty" });
  }

  try {
      await prisma.message.create({
      data: {
        content: prompt,
        role: "USER",
        createdAt: new Date(),
        conversationId: conversation.id,
      },
    });

    const result = await client.chat.send({
      chatRequest: {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "openai/gpt-oss-120b:free",
      },
    });
    const answer = result?.choices[0]?.message.content;
    await prisma.message.create({
      data: {
        content: answer,
        role: "ASSISTANT",
        createdAt: new Date(),
        conversationId: conversation.id,
      },
    });
    console.log(result?.choices[0]?.message.content);
    res.status(200).json({ llm_response: result?.choices[0]?.message.content });
  } catch (e) {
    console.log(e);
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

app.listen(3000);
