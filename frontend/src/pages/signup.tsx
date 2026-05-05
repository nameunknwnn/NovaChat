import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function Signup(){
    const navigate=useNavigate();
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");
    const handleOnClick=async ()=>{
        console.log("andklansdkalsdna")
        const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        }
        )
        if (res.ok){
            navigate("/signin")
        }else{
            const data = await res.json();
            alert(data.message || "Signup failed");
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