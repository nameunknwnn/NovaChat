import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";

export default function Signin(){
    const navigate=useNavigate();
    
    const handleOnClick=()=>{
        navigate("/");
    }
    return(
        <div className="flex p-10">
        <input placeholder="email"/>  
        <input placeholder="password"/>
       
        <Button onClick={handleOnClick}>
            Submit
        </Button>
        </div>
    )
}