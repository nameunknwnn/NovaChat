import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Paperclip,
  ArrowUp,
  X,
  Search,
  SlidersHorizontal,
  ChevronUp,
  Star,
  Info,
} from "lucide-react";
import type { Message } from "../../lib/types";
import { FREE_MODELS } from "../../lib/models";

const PROVIDER_ICONS: Record<string, string> = {
  openai: "⬡",
  anthropic: "△",
  google: "✦",
  meta: "∞",
  mistral: "◎",
};
const DEFAULT_STARRED = new Set([
  "qwen/qwen3-coder:free",
  "deepseek/deepseek-v4-flash:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-4-31b-it:free",
]);

function ModelPicker({
  models,
  selected,
  onSelect,
  onClose,
}: {
  models: typeof FREE_MODELS;
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const providers = Array.from(new Set(models.map((m) => m.provider)));

  const filtered = models
    .filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.provider.toLowerCase().includes(search.toLowerCase());
      const matchProvider = !activeProvider || m.provider === activeProvider;
      return matchSearch && matchProvider;
    })
    .sort((a, b) => {
      const aStarred = DEFAULT_STARRED.has(a.id) ? 0 : 1;
      const bStarred = DEFAULT_STARRED.has(b.id) ? 0 : 1;
      return aStarred - bStarred;
    });

  return (
    <div
      className="absolute bottom-full left-0 mb-2 w-[420px] rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200"
      style={{ maxHeight: "520px" }}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/60">
        <Search size={14} className="text-muted-foreground shrink-0" />
        <input
          autoFocus
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SlidersHorizontal
          size={14}
          className="text-muted-foreground shrink-0"
        />
      </div>

      <div className="flex" style={{ maxHeight: "360px" }}>
        <div className="flex flex-col gap-0.5 p-2 border-r border-border/60 shrink-0 overflow-y-auto">
          <button
            onClick={() => setActiveProvider(null)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${
              !activeProvider
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Star size={15} />
          </button>
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => setActiveProvider(activeProvider === p ? null : p)}
              title={p}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-colors ${
                activeProvider === p
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {PROVIDER_ICONS[p.toLowerCase()] ?? p.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((m) => {
            const isSelected = m.id === selected;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelect(m.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-accent/60 ${
                  isSelected ? "bg-accent/80" : ""
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0">
                    {PROVIDER_ICONS[(m.provider ?? "").toLowerCase()] ?? "◆"}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-medium truncate ${isSelected ? "text-foreground" : "text-foreground/80"}`}
                      >
                        {m.name}
                      </span>
                      <Star
                        size={11}
                        className={
                          DEFAULT_STARRED.has(m.id)
                            ? "text-yellow-400 fill-yellow-400 shrink-0"
                            : "text-muted-foreground/30 shrink-0"
                        }
                      />
                    </div>
                    {m.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {m.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-muted-foreground/40 hover:text-foreground transition-colors">
                    <Info size={13} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function QueryBox({
  query,
  setQuery,
  setShown,
  conversationId,
  sendmessage,
  setAiMessage,
}: {
  query: string;
  shown?: boolean;
  setShown?: React.Dispatch<React.SetStateAction<boolean>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  conversationId?: string;
  sendmessage?: (message: Message[]) => void;
  setAiMessage?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const inputfiles = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [modelId, setModelId] = useState(FREE_MODELS[0]?.id ?? "");
  const [modelselection, setmodelselection] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const selectedModel =
    FREE_MODELS.find((m) => m.id === modelId) ?? FREE_MODELS[0];

  useEffect(() => {
    ref.current?.focus();
  }, [query]);

  useEffect(() => {
    if (!modelselection) return;
    const handleClick = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) {
        setmodelselection(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [modelselection]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    setShown?.(e.target.value === "");
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
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/conversation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: query }),
      },
    );
    if (res.status === 401) {
      localStorage.setItem("token", "");
      navigate("/signin");
    }
    return (await res.json()).conversationId;
  };

  const handleSend = async () => {
    if (!query.trim() || isSending) return;
    setIsSending(true);
    try {
      const token = localStorage.getItem("token");
      const cId = await fetchConversationId();
      sendmessage?.([{ content: query, id: cId, role: "USER" }]);
      setQuery("");
      const chat = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: query, conversationId: cId, model: modelId }),
      });
      if (chat.status === 401) {
        localStorage.setItem("token", "");
        navigate("/signin");
        return;
      }
      if (!chat.ok) {
        const err = await chat.json().catch(() => null);
        const errMsg = err?.message ?? "Something went wrong. Please try again.";
        sendmessage?.([{ content: errMsg, id: cId, role: "ASSISTANT" }]);
        if (!conversationId) navigate(`/c/${cId}`);
        return;
      }
      const reader = chat.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        fullText += decoder.decode(value);
        setAiMessage?.(fullText);
      }
      sendmessage?.([{ content: fullText, id: cId, role: "ASSISTANT" }]);
      setAiMessage?.("");
      if (!conversationId) navigate(`/c/${cId}`);
    } finally {
      setIsSending(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 px-1">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/80 border border-border/60 text-xs text-foreground/80"
            >
              <Paperclip size={11} className="text-muted-foreground" />
              <span className="max-w-[140px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(i)}
                className="text-muted-foreground hover:text-foreground ml-1 transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg transition-all duration-200 focus-within:border-primary/40 focus-within:shadow-primary/5 focus-within:shadow-xl">
        <textarea
          ref={ref}
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none leading-relaxed scrollbar-thin"
          style={{ minHeight: "56px", maxHeight: "200px" }}
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-0.5" ref={pickerRef}>
            {modelselection && (
              <ModelPicker
                models={FREE_MODELS}
                selected={modelId}
                onSelect={setModelId}
                onClose={() => setmodelselection(false)}
              />
            )}

            <button
              onClick={() => setmodelselection(!modelselection)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                modelselection
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <span>{selectedModel?.name ?? modelId}</span>

              <ChevronUp
                size={12}
                className={`transition-transform duration-200 ${modelselection ? "" : "rotate-180"}`}
              />
            </button>

            <div className="w-px h-4 bg-border/60 mx-1" />
            <button
              onClick={() => inputfiles.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-150"
            >
              <Paperclip size={12} />
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

          <button
            onClick={handleSend}
            disabled={!query.trim() || isSending}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
