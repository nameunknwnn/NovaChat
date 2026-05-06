import { Search } from "lucide-react";
import ChatHistory from "./chathistory";
import { useEffect, useState } from "react";

export default function Searchbox() {
  const [text, setText] = useState("");
  const [debouncedtext, setDebouncedtext] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedtext(text);
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border">
        <Search size={14} className="text-muted-foreground shrink-0" />
        <input
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
          type="text"
          placeholder="Search threads..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <ChatHistory text={debouncedtext} />
      </div>
    </div>
  );
}
