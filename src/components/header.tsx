import { useState } from "react";
import QueryBox from "./headerComponents/queryBox";
import WelcomeDashboard from "./headerComponents/welcomeDashboard";

const questions={create:["How Does AI Work", "Are Black Holes real?","how many r's are there in strawberry","how is this?"],
    explore:["How Does AI Work", "Are Black Holes real?","how many r's are there in strawberry","how is this?"],
    learn:["How Does AI Work", "Are Black Holes real?","how many r's are there in strawberry","how is this?"],
    code:["How Does AI Work", "Are Black Holes real?","how many r's are there in strawberry","how is this?"]
}

export default function header(){
    const [query,setQuery]=useState("");
    const [shown,setShown]=useState(true);
    return(
        <div className="h-screen">
            <div className="h-3/4">{shown?<WelcomeDashboard username="Aditya" questions={questions} setQuery={setQuery} setShown={setShown}/>:<div></div>}</div>
            <div className="h-1/4">
                <QueryBox query={query} setQuery={setQuery} shown={shown} setShown={setShown}/>
            </div>
        </div>
    )
} 