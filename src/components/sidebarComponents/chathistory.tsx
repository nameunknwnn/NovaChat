const chats=["naklsdnak","complete","blue2"]

export default function ChatHistory( {text}:{text:string}){
    const filteredChats=chats.filter((chat)=>{
       return chat.toLowerCase().includes(text.toLowerCase())
     })
    return(
        <div >
            <div className="text-xl text-black">List of Chats</div>
                {filteredChats.map((chat)=>{
                    return(
                        <div className="text-sm text-black">{chat}</div>
                    )
                })}
        </div>
    )
}