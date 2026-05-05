
import { useEffect, useState } from "react";
import { Button } from "../ui/button"
import { useNavigate } from "react-router";

interface Conversation{
    id:string,
    title:string,

}

export default function ChatHistory( {text}:{text:string}){
        const navigate=useNavigate();
        const token=localStorage.getItem("token")
        const [conversations,setConversations]=useState<Conversation[]>([]);
        useEffect(()=>{
            const fetchdata=async()=>{
                const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversation`,{
                    method:"GET",
                    headers:{
                    "authorization":`Bearer ${token}`
                    }
                })
                const data=await response.json()
                console.log(data.conversation,'this is data')
                setConversations(data.conversation);
            }
            fetchdata()
        },[])

        console.log(conversations,"this is conversations")

        const titles=conversations.map(conversation=>{
                return(conversation.title)
        })
        console.log(titles,"this is titles");


    return(
        <div >
            <div className="text-xl text-black">List of Chats</div>
                {conversations.map((chat)=>{
                    return(
                        <Button key={chat.id} className="text-sm flex w-[200px] overflow-hidden text-black bg-green-500" onClick={()=>{
                               navigate(`c/${chat.id}`)
                        }}>{chat.title}</Button>
                    )
                })}
        </div>
    )
}