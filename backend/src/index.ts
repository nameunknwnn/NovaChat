// const OpenRouter=require('@openrouter/sdk')
// const express=require('express')

// const app=express();
// app.use(express.json());

// //signin


// //signup


// app.post("/conversation",async function(req:any,res:any){

// //prompt will come from req body
// const prompt=req.body.prompt;

// //model selected will come from the req body
// const llmnName=req.body.llmnName;

// // "query" stored in db message

// //the converstaion is created

// //the query will go to the openrouter
// const client = new OpenRouter({
//   apiKey: `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`
// });

// console.log(client);
// //response is generated
// try{const response = await client.chat.send({
//   model: "openai/gpt-4o-mini",
//   messages: [
//     { role: "user", content: "Explain quantum computing" }
//   ]
// });}
// catch(e ){
//   console.log(e)
// }

// //"response" store in the db message

// //conversation id updated

// //  res.json(response)
// })




// //app.get(conversation)


// //app.get(converation/:conversationid)






// app.listen(3000);


import express from "express"
import { OpenRouter } from "@openrouter/sdk";
const app=express();
app.use(express.json());

//signin


//signup


app.post("/conversation",async function(req:any,res:any){

//prompt will come from req body
const prompt=req.body.prompt;

//model selected will come from the req body
const llmnName=req.body.llmnName;

// "query" stored in db message

//the converstaion is created

//the query will go to the openrouter
const client = new OpenRouter({
  apiKey: `${process.env.OPENROUTER_API_KEY}`
});

//response is generated
try{
  const result = await client.chat.send({
    chatRequest:{
      messages: [
        {
          role: "user",
          content: "Hello, how are you?",
        },
      ],
      model: "openai/gpt-oss-120b:free"
    }
   
  });

  //@ts-ignore
  console.log(result?.choices[0].message.content)
  res.json({llm_response: result?.choices[0]?.message.content})
}
catch(e ){
  console.log(e)
}

})







app.listen(3000);