import { Plus, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import Searchbox from "./sidebarComponents/search";
import ProfileButton from "./sidebarComponents/profilebutton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 px-2 h-screen bg-sidebar border-r border-border/50 transition-all duration-300">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Expand sidebar"
        >
          <PanelLeftOpen size={18} />
        </button>
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary transition-colors"
          title="New Chat"
        >
          <Plus size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-64 bg-sidebar border-r border-border/50 shrink-0 transition-all duration-300">
      {/* Branding */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles size={14} className="text-primary" />
          </div>
          <span className="text-foreground font-semibold text-base tracking-tight">NovaChat</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Collapse sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 pb-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Chat
        </button>
      </div>

      {/* Search + Chat history */}
      <div className="flex-1 overflow-hidden px-3 py-2">
        <Searchbox />
      </div>

      {/* Profile at bottom */}
      <div className="border-t border-border/50 px-3 py-3">
        <ProfileButton />
      </div>
    </div>
  );
}
