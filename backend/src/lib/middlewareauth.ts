import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import type { NextFunction, Request, Response } from "express";

export default async function middlewareauth(req:Request,res:Response,next:NextFunction){
    try{
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "No token" });
            return;
        }

        const token = authHeader.split(" ")[1];
        if (!token){
            return res.json({message:"token empty"})
        }

        const decoded=jwt.verify(token,`${process.env.JWT_SECRET}`); 

        if (typeof decoded==="string"){
            return res.json({message:"invalid type of jwt"})
        }
        const email=decoded.email;
  
        const userfound=await prisma.user.findFirst({
            where:{
                email:email
            }
        })
        if (!userfound){
            res.status(401).json({message:"failed auth"})
            return
        }
        req.user=userfound;
        next();
    }catch(e){
        res.status(500).json(e);
    }
  
}