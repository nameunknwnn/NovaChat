import { useState } from "react";
import { Star } from "lucide-react";

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  tags: string[];
  providerColor: string;
  providerInitial: string;
}

const FREE_MODELS: Model[] = [
  {
    id: "google/gemini-2.0-flash:free",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Google's speedy all-rounder with massive context",
    tags: ["fast", "free"],
    providerColor: "bg-blue-500/20 text-blue-400",
    providerInitial: "G",
  },
  {
    id: "google/gemini-2.5-flash:free",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    description: "Upgraded speed with enhanced capabilities",
    tags: ["fast", "free"],
    providerColor: "bg-blue-500/20 text-blue-400",
    providerInitial: "G",
  },
  {
    id: "google/gemini-2.5-flash-lite:free",
    name: "Gemini 2.5 Flash Lite",
    provider: "Google",
    description: "Google's most cost-efficient Flash model",
    tags: ["free", "lite"],
    providerColor: "bg-blue-500/20 text-blue-400",
    providerInitial: "G",
  },
  {
    id: "google/gemini-2.0-flash-lite:free",
    name: "Gemini 2.0 Flash Lite",
    provider: "Google",
    description: "Faster, less precise Gemini model",
    tags: ["free", "lite"],
    providerColor: "bg-blue-500/20 text-blue-400",
    providerInitial: "G",
  },
  {
    id: "google/gemini-3-flash:free",
    name: "Gemini 3 Flash",
    provider: "Google",
    description: "Lightning-fast with surprising capability",
    tags: ["fast", "free"],
    providerColor: "bg-blue-500/20 text-blue-400",
    providerInitial: "G",
  },
  {
    id: "google/gemma-4-26b:free",
    name: "Gemma 4 26B A4B",
    provider: "Google",
    description: "Efficient multimodal Google MoE with optional thinking",
    tags: ["free", "open-source"],
    providerColor: "bg-blue-500/20 text-blue-400",
    providerInitial: "G",
  },
  {
    id: "meta-llama/llama-4-scout:free",
    name: "Llama 4 Scout",
    provider: "Meta",
    description: "Efficient multimodal explorer",
    tags: ["free", "open-source"],
    providerColor: "bg-violet-500/20 text-violet-400",
    providerInitial: "M",
  },
  {
    id: "moonshotai/kimi-k2:free",
    name: "Kimi K2 (0711)",
    provider: "Moonshot AI",
    description: "China's open-source capability champion",
    tags: ["free", "open-source"],
    providerColor: "bg-cyan-500/20 text-cyan-400",
    providerInitial: "K",
  },
  {
    id: "moonshotai/kimi-k2-0905:free",
    name: "Kimi K2 (0905)",
    provider: "Moonshot AI",
    description: "Enhanced version with longer context",
    tags: ["free", "open-source"],
    providerColor: "bg-cyan-500/20 text-cyan-400",
    providerInitial: "K",
  },
  {
    id: "moonshotai/kimi-k2.5:free",
    name: "Kimi K2.5",
    provider: "Moonshot AI",
    description: "Native multimodal with visual coding",
    tags: ["free", "multimodal"],
    providerColor: "bg-cyan-500/20 text-cyan-400",
    providerInitial: "K",
  },
  {
    id: "openai/gpt-oss-20b:free",
    name: "GPT OSS 20B",
    provider: "OpenAI",
    description: "Efficient open-source GPT model",
    tags: ["free", "open-source"],
    providerColor: "bg-emerald-500/20 text-emerald-400",
    providerInitial: "O",
  },
  {
    id: "openai/gpt-oss-120b:free",
    name: "GPT OSS 120B",
    provider: "OpenAI",
    description: "Full-size open-source GPT with strong reasoning",
    tags: ["free", "open-source"],
    providerColor: "bg-emerald-500/20 text-emerald-400",
    providerInitial: "O",
  },
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "Strong open-source reasoning model",
    tags: ["free", "reasoning"],
    providerColor: "bg-orange-500/20 text-orange-400",
    providerInitial: "D",
  },
  {
    id: "deepseek/deepseek-v3:free",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    description: "Latest generation DeepSeek with improved performance",
    tags: ["free", "open-source"],
    providerColor: "bg-orange-500/20 text-orange-400",
    providerInitial: "D",
  },
  {
    id: "mistralai/mistral-7b:free",
    name: "Mistral 7B",
    provider: "Mistral",
    description: "Lean, fast open-source model for everyday tasks",
    tags: ["free", "open-source", "lite"],
    providerColor: "bg-rose-500/20 text-rose-400",
    providerInitial: "Mi",
  },
];

const DEFAULT_STARRED = new Set([
  "google/gemini-2.5-flash-lite:free",
  "google/gemini-3-flash:free",
  "moonshotai/kimi-k2-0905:free",
  "openai/gpt-oss-120b:free",
]);

export default function ModelsSettings() {
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState<Set<string>>(DEFAULT_STARRED);

  const filtered = FREE_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStar = (id: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Models</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Free-tier models available on NovaChat. Star your favourites.
        </p>
      </div>

      {/* Search + count */}
      <div className="relative">
        <input
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm pr-12 focus:outline-none focus:ring-1 focus:ring-primary/50"
          placeholder="Search models…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5">
          {filtered.length}
        </span>
      </div>

      {/* Tag legend */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Tags:</span>
        {["free", "fast", "open-source", "reasoning", "multimodal", "lite"].map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Model list */}
      <div className="space-y-2">
        {filtered.map((model) => (
          <div
            key={model.id}
            className="flex items-center gap-4 rounded-lg border border-border px-4 py-3.5 hover:bg-accent/30 transition-colors group"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${model.providerColor}`}
            >
              {model.providerInitial}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium">{model.name}</p>
                <div className="flex gap-1 flex-wrap">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{model.description}</p>
            </div>

            <button
              onClick={() => toggleStar(model.id)}
              className="shrink-0 transition-colors"
              title={starred.has(model.id) ? "Unstar" : "Star"}
            >
              <Star
                size={15}
                className={
                  starred.has(model.id)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground opacity-0 group-hover:opacity-60"
                }
              />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No models match your search.
          </p>
        )}
      </div>
    </div>
  );
}
