import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button";


export default function QueryBox({query,setQuery,shown,setShown}:{query:string ,shown:boolean,setShown:React.Dispatch<React.SetStateAction<boolean>> ,setQuery: React.Dispatch<React.SetStateAction<string>>}){
    const ref=useRef(null);
    const [files,setFiles]=useState<File[]>([]);
    const inputfiles=useRef(null);
   
    useEffect(()=>{
        ref.current.focus();
        const timer= setTimeout(()=>{
            console.log(query);
        },1000)
        return ()=>clearTimeout(); 
    },[query])


    return(<div>
        <input placeholder="type your query" type="text" value={query} ref={ref} className="w-[400px] max-h-[200px] " onChange={(e)=>{
            setQuery(e.target.value);
            e.target.value==""?setShown(true):setShown(false)
        }}/>
        <input type="file" ref={inputfiles} onChange={(e)=>{
            const newfiles=Array.from(e.target.files);
            setFiles(p=>[...p,...newfiles])
        }} multiple  />
        <Button className="text-white" onClick={()=>{
            inputfiles.current.click()
        }}> attach</Button>
         </div>)
}