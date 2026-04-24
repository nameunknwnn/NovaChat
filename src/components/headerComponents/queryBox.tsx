import { useEffect } from "react"


export default function QueryBox({text}:{text:string}){
    useEffect(()=>{
        const timer= setTimeout(()=>{
            
        },1000)
        return ()=>clearTimeout(timer); 
    },[text])


    return(<div>
        <input placeholder="type your query" type="word" value={text} className="w-[400px] max-h-[200px] "/>
         </div>)
}