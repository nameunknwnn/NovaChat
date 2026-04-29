const jwt= require('jsonwebtoken')

export function middlewareauth(req,res,next){
    const token =req.header.token
    const username= jwt.verify(token,process.env.Secret)
    if(!username){
        res.status(403).json({message:"not logged in"})
        return;
    }
    next();
}