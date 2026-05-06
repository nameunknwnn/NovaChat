import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
}

interface GroupedConversations {
  label: string;
  items: Conversation[];
}

function groupByDate(conversations: Conversation[]): GroupedConversations[] {
  return [{ label: "Recent", items: conversations }];
}

export default function ChatHistory({ text }: { text: string }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversation`, {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setConversations(data.conversation || []);
    };
    fetchdata();
  }, []);

  const filtered = text
    ? conversations.filter((c) => c.title.toLowerCase().includes(text.toLowerCase()))
    : conversations;

  const groups = groupByDate(filtered);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <MessageSquare size={20} className="text-muted-foreground/50" />
        <p className="text-xs text-muted-foreground">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {group.label}
          </p>
          {group.items.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigate(`/c/${chat.id}`)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors group"
            >
              <MessageSquare size={13} className="text-muted-foreground shrink-0 group-hover:text-foreground/60 transition-colors" />
              <span className="truncate flex-1">{chat.title}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
