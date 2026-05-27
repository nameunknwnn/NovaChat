import { useState } from "react";
import { Star, Search } from "lucide-react";
import { FREE_MODELS } from "../../lib/models";

const DEFAULT_STARRED = new Set([
  "qwen/qwen3-coder:free",
  "deepseek/deepseek-v4-flash:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-4-31b-it:free",
]);

export default function ModelsSettings() {
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState<Set<string>>(DEFAULT_STARRED);

  const filtered = FREE_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()),
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

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
        <input
          className="w-full rounded-xl border border-border/60 bg-muted/40 pl-10 pr-14 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground/60 bg-muted rounded-md px-1.5 py-0.5 border border-border/40">
          {filtered.length}
        </span>
      </div>

      {/* Model list */}
      <div className="space-y-2">
        {filtered.map((model) => (
          <div
            key={model.id}
            className="flex items-center gap-4 rounded-xl border border-border/50 px-4 py-3.5 hover:bg-accent/20 hover:border-border/70 transition-all duration-150 group"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${model.providerColor}`}
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
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/80 text-muted-foreground font-medium border border-border/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {model.description}
              </p>
            </div>

            <button
              onClick={() => toggleStar(model.id)}
              className="shrink-0 transition-all duration-200 p-1.5 rounded-lg hover:bg-accent"
              title={starred.has(model.id) ? "Unstar" : "Star"}
            >
              <Star
                size={15}
                className={
                  starred.has(model.id)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity"
                }
              />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-muted-foreground">No models match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
