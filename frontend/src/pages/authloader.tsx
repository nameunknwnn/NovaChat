import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router"

export default function AuthSuccess(){

    const navigate=useNavigate();
    
    const [searchparams]=useSearchParams();
    useEffect(()=>{
        const token=searchparams.get("token")
        if (token){
            localStorage.setItem("token",token);
            navigate('/')
        }
    },[])
    
    return(<div>
        logging you in.
    </div>)
}