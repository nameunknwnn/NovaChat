import { Button } from "../ui/button"

type Props={
    username:string;
    questions:string[];
}


export default function WelcomeDashboard({username ,questions}:Props){
    return(
        <div className="pt-10">
            <div className="text-3xl flex justify-center ">
                How can I help you, {username}?
            </div>
            <div className="flex justify-center gap-4 pt-10">
                <Button>Create</Button>
                <Button>Explore</Button>
                <Button>Code</Button>
                <Button>Learn</Button>
            </div>
             <div className="flex justify-center gap-4 pt-10">
                {questions.map((v)=>{
                    return(
                        <Button>{v}</Button>
                    )
                })}
            </div>
        </div>
       
    )
}