import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

export default async function middlewareauth(req,res,next){
    const token=(req.headers.token);
    const decoded=jwt.verify(token,`${process.env.JWT_SECRET}`); 
    const email=decoded.email;

    const userfound=await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if (!userfound){
        res.json({message:"failed auth"})
        return
    }
    res.json({user:userfound})
    next()
}