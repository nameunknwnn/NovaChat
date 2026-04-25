import { Button } from "../ui/button"

const chats=["intial     ","complete","blue2"]

export default function ChatHistory( {text}:{text:string}){
    const filteredChats=chats.filter((chat)=>{
       return chat.toLowerCase().includes(text.toLowerCase())
     })
    return(
        <div >
            <div className="text-xl text-black">List of Chats</div>
                {filteredChats.map((chat)=>{
                    return(
                        <Button className="text-sm flex w-[200px] overflow-hidden text-black bg-green-500">{chat}</Button>
                    )
                })}
        </div>
    )
}