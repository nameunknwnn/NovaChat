import { Search } from "lucide-react";
import ChatHistory from "./chathistory";
import { useEffect, useState } from "react";


export default function Searchbox(){

const [text,setText]=useState("");
const [debouncedtext,setDebouncedtext]=useState("");

useEffect(()=>{
    const timer = setTimeout(()=>{
        console.log(text);
        setDebouncedtext(text);
    },1000);
    return ()=>clearTimeout(timer);    
},[text])
    return(
        <div className=" space-y-10">
            <div className="underline  flex">
                <Search className="text-black" />
                <input className="ml-2 bg-transparent text-black outline-none" type="text" placeholder="Search" 
                value={text}
                onChange={(e)=>{setText(e.target.value)}}/>
            </div>
            <ChatHistory text={debouncedtext} />
        </div>
    )
}