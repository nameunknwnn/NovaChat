
import { Button } from "./ui/button";
import Searchbox from "./sidebarComponents/search";
import ProfileButton from "./sidebarComponents/profilebutton";
import { useState } from "react";
import { NavLink } from "react-router-dom";




export default function sidebar() {
   const [collapsed,setCollapsed]=useState(true)
   return (collapsed?
    <div className="border-r border-black h-screen ">
        <div className="h-3/4">
        <div className="flex justify-between p-2"><Button className="bg-green-700 text-white hover:bg-green-900" onClick={()=>{
         setCollapsed(!collapsed)
        }
        }>collapse</Button>
        
        <NavLink to="/messages" ><Button className="bg-green-700 text-white hover:bg-green-900" onClick={()=>{
         console.log("moved to xyz router")
        }
        }>canvas</Button></NavLink>

        </div>
        <div >
             <h1>NovaChat</h1>
         </div>
         <div >
            <Button className="bg-green-700 text-white hover:bg-green-900">new chat</Button>
         </div>
         <div >
         <Searchbox />
         </div>
         </div>
         <div className="h-1/4">
            <ProfileButton/>
         </div>
     </div>:
     <div><Button className="bg-green-700 text-white hover:bg-green-900" onClick={()=>{
      setCollapsed(!collapsed)
     }
     }>collapse</Button></div>
  )
}