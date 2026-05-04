
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { useState } from "react";



export default function Signin(){
    const navigate=useNavigate();
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");
    
    const handleOnClick=async ()=>{
        await fetch(`${process.env.BACKEND_URL}/signin`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                email:email,
                password:password})
        })
        navigate("/");
    }
    return(
        <div className="flex p-10">
        <input placeholder="email" value={email} onChange={(e)=>{
            setemail(e.target.value)
        }}/>  
        <input placeholder="password" value={password} onChange={(e)=>{
            setpassword(e.target.value)
        }}/>  
       
        <Button onClick={handleOnClick}>
            Submit
        </Button>
        </div>
    )
}