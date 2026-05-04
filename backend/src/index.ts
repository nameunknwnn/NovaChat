import "dotenv/config";

import express from "express";
import { OpenRouter } from "@openrouter/sdk";
import { prisma } from "./lib/prisma";
import jwt from "jsonwebtoken";
import middlewareauth from "./lib/middlewareauth";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());

const client = new OpenRouter({
  apiKey: `${process.env.OPENROUTER_API_KEY}`,
});

//signup
app.post("/signup", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try{
    const userfound = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userfound) {
      res.status(422).json({ message: "email alreay exists" });
      return;
    }
    const token = jwt.sign({email}, `${process.env.JWT_SECRET}`);
    const hashedpassword=await bcrypt.hash(password,10);

    await prisma.user.create({
      data: {
        name: "",
        email: email,
        password: hashedpassword
      },
    });
    res.status(200).json({ message: "user created" });
  }catch(e){
    res.status(500).json(e)
  }

  
});

//signin
app.post("/signin", async function (req, res) {
  const email=req.body.email;
  const password=req.body.password;
    try{
      const user=await prisma.user.findUnique({
        where:{
          email:email
        }
      })
      if(!user){
        return res.status(401).json({message:"email not made"})
      }
      if (!user.password) {
        return res.status(500).json({ message: "User password not set" });
      }

      const truepassword= await bcrypt.compare(password,user.password)
      if(!truepassword){
        return res.status(401).json({message:"password not correct"})
      }
      const token=jwt.sign(email,`${process.env.JWT_SECRET}`)

      res.status(200).json({message:"Signin successful", token:token})
      
    }
  catch(e){
    res.status(500).json(e)
  }
});


app.post("/conversation",middlewareauth, async function(req,res){
  const email=req.user.email;
  const prompt=req.body.prompt;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user){
    return res.json({message:"no user found"})
  }

  //3.the converstaion is created
  const conversation = await prisma.conversation.create({
    data: {
      title:prompt,
      userid: user.id
    },
  });

  await prisma.message.create({
    data: {
      content: prompt,
      role: "USER",
      title: "",
      createdate: new Date(),
      conversationid: conversation.id,
    },
  });

  res.status(200).json({message:"conversation created"})
  
})

app.post("/chat", middlewareauth, async function (req: any, res: any) {
  //1.prompt will come from req body
  const prompt = req.body.prompt;

  //2.model selected will come from the req body
  const llmnName = req.body.llmnName;

  const email = req.user.email;;
  const conversationid=req.body.conversationid;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  const conversation=await prisma.conversation.findFirst({
    where:{
      id:conversationid
    }
  })
  if (!conversation){
    return res.json({message:"conversaiton empty"})
  }

  try {
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

    //7. "response" stored in db message
   await prisma.message.create({
      data: {
        content: answer,
        role: "ASSISTANT",
        createdate: new Date(),
        title: "",
        conversationid: conversation.id,
      },
    });

    console.log(result?.choices[0]?.message.content);
    res.status(200).json({ llm_response: result?.choices[0]?.message.content });
  } catch (e) {
    console.log(e);
  }
});

//app.get(/conversation) for a user
app.get("/conversation", middlewareauth, async function (req, res) {
  const email = req.user.email
  try{
     const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!user){
        return res.json({message:"no user found"})
      }

      const conversation = await prisma.conversation.findMany({
        where: {
          userid: user.id,
        },
      });
      res.status(200).json(conversation);
  }catch(e){
     res.status(500).json(e)
  }
 
});

//app.get(/specific conversation) for a user
app.get(
  "/conversation/:conversationid",
  middlewareauth,
  async function (req, res) {
    const userid=req.user.id;
    const conversationid = req.params.conversationid;
    if (!conversationid || Array.isArray(conversationid)) {
      return res.json({ message: "invalid conversation id" });
    }
    try{
      const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationid,
        userid:userid
      },
    });
    if(!conversation){
      return res.status(401).json({message:"fraud"})
    }

    res.status(200).json(conversation);
    }catch(e){
      res.status(500).json(e)
    }
    
  },
);

app.listen(3000);
