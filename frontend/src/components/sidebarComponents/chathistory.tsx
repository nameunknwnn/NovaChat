import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  createdAt?: string;
}

interface GroupedConversations {
  label: string;
  items: Conversation[];
}

function groupByDate(conversations: Conversation[]): GroupedConversations[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 86400000);
  const monthAgo = new Date(today.getTime() - 30 * 86400000);

  const groups: { last7: Conversation[]; last30: Conversation[]; older: Conversation[] } = {
    last7: [],
    last30: [],
    older: [],
  };

  for (const c of conversations) {
    const date = c.createdAt ? new Date(c.createdAt) : new Date(0);
    if (date >= weekAgo) groups.last7.push(c);
    else if (date >= monthAgo) groups.last30.push(c);
    else groups.older.push(c);
  }

  const result: GroupedConversations[] = [];
  if (groups.last7.length) result.push({ label: "Last 7 Days", items: groups.last7 });
  if (groups.last30.length) result.push({ label: "Last 30 Days", items: groups.last30 });
  if (groups.older.length) result.push({ label: "Older", items: groups.older });
  if (result.length === 0) result.push({ label: "Recent", items: conversations });
  return result;
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
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <MessageSquare size={20} className="text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground/70">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((chat) => (
              <button
                key={chat.id}
                onClick={() => navigate(`/c/${chat.id}`)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left text-sm text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all duration-150 group"
              >
                <MessageSquare size={13} className="text-muted-foreground/50 shrink-0 group-hover:text-foreground/60 transition-colors" />
                <span className="truncate flex-1">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
