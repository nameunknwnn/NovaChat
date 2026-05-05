import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import QueryBox from "../components/headerComponents/queryBox";
import { Button } from "../components/ui/button";

interface Messages{
    content:string,
    id:string,
    role:string
}

interface Conversation{
    id:string,
    title:string,
    messages:Messages[]

}


export default function Conversation(){
    const [query,setQuery]=useState("")
    const params=useParams();
    const navigate=useNavigate();
    const conversationId= params.conversationId;
    const [content,setContent]= useState<Messages[]|null>(null);
    useEffect(()=>{
        const token=localStorage.getItem("token")
        const fetchdata=async()=>{
            const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversation/${conversationId}`,{
                method:"GET",
                headers:{
                    "authorization":`Bearer ${token}`
                }
            })
            const data=await res.json();
            console.log(data,"this si carya i")
            setContent(data.conversation.messages)
        }
            fetchdata();
    },[])   


    return(
    <div className="text-black p-4 space-y-2">
        <Button className="text-green-500" onClick={()=>{navigate("/")}}>
            go back
        </Button>
        {content ? (content.map((content)=>(
            <div className={`flex ${content.role==="USER"? "justify-start":"justify-end"} `}>
              <div className="p-4 border bg-gray space-y-2 max-w-xl">  {content.role}

                              <div>  {content.content}</div>
              </div>

            </div>

        ))) : "Loading..."}
        <QueryBox query={query} setQuery={setQuery}  conversationId={conversationId}/>
    </div>)

} 