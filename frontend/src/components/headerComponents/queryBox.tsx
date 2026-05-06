import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Paperclip, SendHorizonal, X } from "lucide-react";

export default function QueryBox({
  query,
  setQuery,
  shown,
  setShown,
  conversationId,
}: {
  query: string;
  shown?: boolean;
  setShown?: React.Dispatch<React.SetStateAction<boolean>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  conversationId?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const inputfiles = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    ref.current?.focus();
  }, [query]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    if (e.target.value === "") {
      setShown?.(true);
    } else {
      setShown?.(false);
    }
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fetchConversationId = async () => {
    if (conversationId) return conversationId;
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/conversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt: query }),
    });
    if (res.status === 401) {
      localStorage.setItem("token", "");
      navigate("/signin");
    }
    const data = await res.json();
    return data.conversationId;
  };

  const handleSend = async () => {
    if (!query.trim() || isSending) return;
    setIsSending(true);
    try {
      const token = localStorage.getItem("token");
      const cId = await fetchConversationId();
      const chat = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: query, conversationId: cId }),
      });
      if (chat.status === 401) {
        localStorage.setItem("token", "");
        navigate("/signin");
        return;
      }
      setQuery("");
      navigate(`/c/${cId}`);
    } finally {
      setIsSending(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* File previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 px-1">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground/80"
            >
              <Paperclip size={11} className="text-muted-foreground" />
              <span className="max-w-[140px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(i)}
                className="text-muted-foreground hover:text-foreground ml-1"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="relative flex flex-col rounded-2xl border border-border bg-card shadow-lg transition-colors focus-within:border-primary/50">
        <textarea
          ref={ref}
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed scrollbar-thin"
          style={{ minHeight: "56px", maxHeight: "200px" }}
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            {/* File attach */}
            <button
              onClick={() => inputfiles.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Paperclip size={13} />
              Attach
            </button>
            <input
              type="file"
              ref={inputfiles}
              onChange={(e) => {
                const newfiles = Array.from(e.target.files as ArrayLike<File>);
                setFiles((p) => [...p, ...newfiles]);
              }}
              multiple
              className="hidden"
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!query.trim() || isSending}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <SendHorizonal size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
