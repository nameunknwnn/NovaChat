import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button";
import { useNavigate } from "react-router";


export default function QueryBox({query,setQuery,shown,setShown,conversationId}:{query:string ,shown:boolean,setShown:React.Dispatch<React.SetStateAction<boolean>> ,setQuery: React.Dispatch<React.SetStateAction<string>>,conversationId?:string}){
    const ref=useRef<HTMLInputElement>(null);
    // The error occurs because TypeScript doesn't know the ref will be attached to an input element before useEffect runs. Fix it by typing the ref properly:
    // typescriptconst ref = useRef<HTMLInputElement>(null);
    // By default useRef(null) gives you RefObject<unknown>, so ref.current is typed as unknown | null. When you specify useRef<HTMLInputElement>(null), TypeScript knows current is an HTMLInputElement | null.
    // You'll still need to guard against null in the effect since TypeScript can't guarantee the ref is attached at runtime:
    const [files,setFiles]=useState<File[]>([]);
    const inputfiles=useRef<HTMLInputElement>(null);
    const[content,setContent]=useState("")
    const navigate=useNavigate()

    useEffect(()=>{
        ref.current?.focus();
        const timer= setTimeout(()=>{
            console.log(query);
        },1000)
        return ()=>clearTimeout(timer); 
    },[query])

    const fetchconversationId=async()=>{
        console.log(conversationId,"this is conversationId")
         if (conversationId) return `${conversationId}`;

         const token =localStorage.getItem("token")
         const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversation`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                prompt:query
            })
        })
        const data=await res.json();
        return(data.conversationId)
    }
    const handleonclick=async()=>{
        const token =localStorage.getItem("token")
        const conversationId = await fetchconversationId();
        console.log(query,"this is prompt")
        const chat=await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                prompt:query,
                conversationId:conversationId
            })
        })
        const chatdata=await chat.json();
        setContent(chatdata.llm_response)
        if (conversationId){
            return
        }else(navigate(`c/${conversationId}`))
    }


    return(<div>
        <input placeholder="type your query" type="text" value={query} ref={ref} className="w-[400px] max-h-[200px] " onChange={(e)=>{
            setQuery(e.target.value);
            e.target.value==""?setShown(true):setShown(false)
        }}/>
        <input type="file" ref={inputfiles} onChange={(e)=>{
            const newfiles=Array.from(e.target.files as ArrayLike<File>);//remember that e.target.files is not recognized as array so you told ts that its an array
            setFiles(p=>[...p,...newfiles])
        }} multiple  />
        <Button className="text-white" onClick={()=>{
            inputfiles.current?.click()
        }}> attach</Button>
        <Button className="text-white" onClick={()=>{
            handleonclick()
        }}> send</Button>

        <div>
            {content}
        </div>

         </div>)
}