import { useEffect, useState } from "react"


export default function QueryBox({query,setQuery,shown,setShown}:{query:string ,shown:boolean,setShown:React.Dispatch<React.SetStateAction<boolean>> ,setQuery: React.Dispatch<React.SetStateAction<string>>}){
    // const [s, setText]=useState("")
    useEffect(()=>{
        const timer= setTimeout(()=>{
            
        },1000)
        return ()=>clearTimeout(timer); 
    },[query])


    return(<div>
        <input placeholder="type your query" type="word" value={query} className="w-[400px] max-h-[200px] " onChange={(e)=>{
            setQuery(e.target.value);
            e.target.value==""?setShown(true):setShown(false)
        }}/>
         </div>)
}