import "dotenv/config";

import express from "express";
import { OpenRouter } from "@openrouter/sdk";
import { prisma } from "./lib/prisma";
import jwt from "jsonwebtoken";
import middlewareauth from "./lib/middlewareauth";

const app = express();

app.use(express.json());

//signup
app.post("/signup", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const userfound = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (userfound) {
    res.json({ message: "email alreay exists" });
    return;
  }
  const token = jwt.sign(email, `${process.env.JWT_SECRET}`);

  const user = await prisma.user.create({
    data: {
      name: "",
      email: email,
      password: password,
    },
  });
  res.json({ message: "user created", token: token });
});

//signin
app.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const token = req.headers.token;

  const userfound = await prisma.user.findFirst({
    where: {
      email: email,
      password: password,
    },
  });

  //@ts-ignore
  const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
  const emaildecoded = decoded.email;

  if (userfound !== emaildecoded) {
    res.json({ message: "user not found" });
    return;
  }
  res.json({ message: "user found" });
  return userfound;
});

app.post("/conversation", middlewareauth, async function (req: any, res: any) {
  //1.prompt will come from req body
  const prompt = req.body.prompt;

  //2.model selected will come from the req body
  const llmnName = req.body.llmnName;

  const email = req.body.email;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  //3.the converstaion is created
  const conversation = await prisma.conversation.create({
    data: {
      slug: prompt,
      title: "USER",
      userid: user.id,
    },
  });

  //4."query" stored in db message
  const query = await prisma.message.create({
    data: {
      content: prompt,
      type: "USER",
      createdat: "",
      title: "",
      conversationid: conversation.id,
    },
  });
  await prisma.conversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      messageid: query.id,
    },
  });

  //5.the query will go to the openrouter
  const client = new OpenRouter({
    apiKey: `${process.env.OPENROUTER_API_KEY}`,
  });

  //6.response is generated
  try {
    const result = await client.chat.send({
      chatRequest: {
        messages: [
          {
            role: "user",
            content: "Hello, how are you?",
          },
        ],
        model: "openai/gpt-oss-120b:free",
      },
    });

    const answer = result?.choices[0]?.message.content;
    //7. "response" stored in db message
    const response = await prisma.message.create({
      data: {
        content: answer,
        type: "ASSISTANT",
        createdat: "",
        title: "",
        conversationid: conversation.id,
      },
    });

    //8. store response in the conversation
    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        messageid: response.id,
      },
    });

    console.log(result?.choices[0]?.message.content);
    res.json({ llm_response: result?.choices[0]?.message.content });
  } catch (e) {
    console.log(e);
  }
});

//app.get(/conversation) for a user
app.get("/conversation", middlewareauth, async function (req, res) {
  const email = req.body.email;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  const conversation = await prisma.conversation.findMany({
    where: {
      userid: user.id,
    },
  });
  res.json(conversation);
});

//app.get(/specific conversation) for a user
app.get(
  "/conversation/:conversationid",
  middlewareauth,
  async function (req, res) {
    const conversationid = req.params.conversationid;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationid,
      },
    });

    res.json(conversation);
  },
);

app.listen(3000);
