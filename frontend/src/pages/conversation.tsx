import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import QueryBox from "../components/headerComponents/queryBox";
import { ArrowLeft, Bot, User } from "lucide-react";
import type { Message } from "../lib/types";
import Markdown from "react-markdown";

export default function Conversation() {
  const [query, setQuery] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const conversationId = params.conversationId;
  const [aiMessage, setAiMessage] = useState("");
  const [content, setContent] = useState<Message[] | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendmessage = (message: Message[]) => {
    setContent((prev) => [...(prev ?? []), ...message]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchdata = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/conversation/${conversationId}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        },
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
  }, [content, aiMessage]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border/40 shrink-0 backdrop-blur-sm bg-background/80">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg px-2 py-1.5 hover:bg-accent/50"
        >
          <ArrowLeft size={15} />
          <span className="text-xs font-medium">Back</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-8">
        {content === null ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading conversation...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full">
            {content.map((msg, idx) => (
              <div
                key={msg.id + idx}
                className={`flex gap-3 ${msg.role === "USER" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                    msg.role === "USER"
                      ? "bg-primary/15 text-primary ring-1 ring-primary/20"
                      : "bg-muted/80 text-muted-foreground ring-1 ring-border/50"
                  }`}
                >
                  {msg.role === "USER" ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div
                  className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "USER"
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-card/80 border border-border/50 text-foreground rounded-tl-md"
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>
              </div>
            ))}

            {aiMessage && (
              <div className="flex gap-3 flex-row animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 bg-muted/80 text-muted-foreground ring-1 ring-border/50">
                  <Bot size={14} />
                </div>
                <div className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed bg-card/80 border border-border/50 text-foreground rounded-tl-md">
                  <div className="prose prose-invert prose-sm  [&>p]:mb-2 [&>p:last-child]:mb-0">
                    <Markdown>{aiMessage}</Markdown>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-6 pb-6 pt-3 bg-gradient-to-t from-background via-background to-transparent">
        <QueryBox
          sendmessage={sendmessage}
          setAiMessage={setAiMessage}
          query={query}
          setQuery={setQuery}
          conversationId={conversationId}
        />
      </div>
    </div>
  );
}
