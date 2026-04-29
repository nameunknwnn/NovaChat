import { middlewareauth } from "./middleware/middlewareauth";

const express = require('express');
const jwt=require('jsonwebtoken')

const app= express();

const note=[{username:"aditya",notes:"this is good"}];
const creds=[{username:"aditya",password:"aditya"}]

app.use(express.json());



//signup 
app.post(function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    
    if (creds.find(c=>c.username===username)){
        res.status(403).json({message:"user already exists"})
        return;
    }
    creds.push({
        username,password
    })
    res.status(200).json({message:"user added"})

})


//signin
app.post(function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    
    if (!creds.find(c=>c.username===username&&c.password===password)){
        res.status(401).json({message:"user didnt found"})
        return;
    }
    const token =jwt.sign(username,process.env.Secret);
    res.status(200).json({token:token,message:"user found"})
})



//get all notes
app.get(function(req,res){
    middlewareauth()
     const username=req.body.username
    const usernote=note.filter(note=>note.username===username);

    res.json({
        usernote
    })

})

//post a specific note for a user. 
app.post(function(req,res){
    middlewareauth()
    const username=req.body.username;
    const description=req.body.description;
    const notes=note.push(username,description);
    res.json({message:"note added"})

})


app.listen(3000);