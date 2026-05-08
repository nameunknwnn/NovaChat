import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Loader2, ChevronRight } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function HistorySettings() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${backendUrl}/conversation`, {
          headers: { authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setConversations(data.conversation || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">History &amp; Sync</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your past conversations. Click any to resume.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-8">
          <Loader2 size={16} className="animate-spin" />
          Loading conversations…
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <MessageSquare size={32} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No conversations yet.</p>
          <button
            className="mt-3 text-xs underline text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/")}
          >
            Start chatting
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto] px-4 py-2.5 bg-muted/30 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">When</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {conversations.map((conv) => {
              const lastMessage = conv.messages?.[conv.messages.length - 1];
              const when = lastMessage?.createdAt ? timeAgo(lastMessage.createdAt) : "—";

              return (
                <button
                  key={conv.id}
                  onClick={() => navigate(`/c/${conv.id}`)}
                  className="w-full grid grid-cols-[1fr_auto] items-center px-4 py-3.5 hover:bg-accent/40 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageSquare size={14} className="text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{conv.title || "Untitled"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {conv.messages?.length ?? 0} message{conv.messages?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pl-4 shrink-0">
                    <span>{when}</span>
                    <ChevronRight size={13} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
