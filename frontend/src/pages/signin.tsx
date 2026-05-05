
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { useState } from "react";



export default function Signin(){
    const backend_url=import.meta.env.VITE_BACKEND_URL
    const navigate=useNavigate();
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");
    
    const handleOnClick=async ()=>{
        const res= await fetch(`${backend_url}/signin`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                email:email,
                password:password})
        })
        if (res.ok){
            const data=await res.json();
            console.log(data.token)
            localStorage.setItem("token",data.token)
            navigate("/");
        }else{
            const data=await res.json();
            alert(data.message||"signup failed")
        }
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