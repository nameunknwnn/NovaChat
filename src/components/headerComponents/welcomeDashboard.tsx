import { useState } from "react";
import { Button } from "../ui/button"

type QuestionsType={
    create:string[]
}

type Props={
    username:string;
    questions:QuestionsType;
    setQuery:React.Dispatch<React.SetStateAction<string>> ;
    setShown:React.Dispatch<React.SetStateAction<boolean>> ;
}


export default function WelcomeDashboard({username ,questions, setQuery, setShown}:Props){
    const [word,setWord]=useState("create")
    return(
        <div className="pt-10">
            <div className="text-3xl flex justify-center ">
                How can I help you, {username}?
            </div>
            <div className="flex justify-center gap-4 pt-10">
                <Button onClick={()=>{
                    setWord("create")
                }}>Create</Button>
                <Button onClick={()=>{
                    setWord("explore")
                }}>Explore</Button>
                <Button onClick={()=>{
                    setWord("code")
                }} >Code</Button>
                <Button onClick={()=>{
                    setWord("learn")
                }}>Learn</Button>
            </div>
             <div className="flex justify-center gap-4 pt-10">
                {questions[word].map((v)=>{
                    return(
                        <Button onClick={()=>{
                            setQuery(v);
                            setShown(false);
                        }}>{v}</Button>
                    )
                })}
            </div>
        </div>
       
    )
}