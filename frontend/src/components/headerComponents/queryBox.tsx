import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button";


export default function QueryBox({query,setQuery,shown,setShown}:{query:string ,shown:boolean,setShown:React.Dispatch<React.SetStateAction<boolean>> ,setQuery: React.Dispatch<React.SetStateAction<string>>}){
    const ref=useRef<HTMLInputElement>(null);
    // The error occurs because TypeScript doesn't know the ref will be attached to an input element before useEffect runs. Fix it by typing the ref properly:
    // typescriptconst ref = useRef<HTMLInputElement>(null);
    // By default useRef(null) gives you RefObject<unknown>, so ref.current is typed as unknown | null. When you specify useRef<HTMLInputElement>(null), TypeScript knows current is an HTMLInputElement | null.
    // You'll still need to guard against null in the effect since TypeScript can't guarantee the ref is attached at runtime:
    const [files,setFiles]=useState<File[]>([]);
    const inputfiles=useRef<HTMLInputElement>(null);
   
    useEffect(()=>{
        ref.current?.focus();
        const timer= setTimeout(()=>{
            console.log(query);
        },1000)
        return ()=>clearTimeout(timer); 
    },[query])


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
         </div>)
}