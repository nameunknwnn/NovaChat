const chats=["naklsdnak","complete","blue2"]


export default function ChatHistory(){
    return(
        <div >
            <div className="text-xl text-black">List of Chats</div>
            {chats.map(chat=>{
                return(
                    <div className="text-black">{chat}</div>
                )
            })}

        </div>
    )
}