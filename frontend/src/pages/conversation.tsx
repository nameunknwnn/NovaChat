import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import QueryBox from "../components/headerComponents/queryBox";
import { ArrowLeft, Bot, User } from "lucide-react";
import type { Message } from "../lib/types";


export default function Conversation() {
  const [query, setQuery] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const conversationId = params.conversationId;
  const [content, setContent] = useState<Message[] | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendmessage=(message)=>{
    setContent((prev)=>{return[...prev,...message]})
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchdata = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/conversation/${conversationId}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 401) {
        localStorage.setItem("token", "");
        navigate("/signin");
        return;
      }
      const data = await res.json();
      setContent(data.conversation.messages);
    };
    fetchdata();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [content]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
        {content === null ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading conversation...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            {content.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "USER" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                    msg.role === "USER"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.role === "USER" ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "USER"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card border border-border text-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-6 pb-6 pt-2">
        <QueryBox sendmessage={sendmessage} query={query} setQuery={setQuery} conversationId={conversationId} />
      </div>
    </div>
  );
}
