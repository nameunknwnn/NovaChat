import { useState } from "react";
import { Sparkles, Compass, Code2, GraduationCap } from "lucide-react";

type QuestionsType = {
  create: string[];
  explore: string[];
  code: string[];
  learn: string[];
};

type Props = {
  username: string;
  questions: QuestionsType;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setShown: React.Dispatch<React.SetStateAction<boolean>>;
};

const categories = [
  { key: "create", label: "Create", icon: Sparkles },
  { key: "explore", label: "Explore", icon: Compass },
  { key: "code", label: "Code", icon: Code2 },
  { key: "learn", label: "Learn", icon: GraduationCap },
] as const;

type CategoryKey = "create" | "explore" | "code" | "learn";

export default function WelcomeDashboard({ username, questions, setQuery, setShown }: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("create");

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-10 animate-in fade-in duration-500">
      <div className="text-center space-y-1">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
          How can I help you, <span className="text-primary">{username}</span>?
        </h1>
      </div>

      <div className="flex items-center gap-1.5 p-1 rounded-full bg-muted/40 border border-border/60 backdrop-blur-sm">
        {categories.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === key
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-0.5 w-full max-w-lg">
        {questions[activeCategory].map((q, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(q);
              setShown(false);
            }}
            className="px-4 py-3.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-accent/40 transition-all duration-150 text-left leading-relaxed group"
          >
            <span className="group-hover:translate-x-0.5 inline-block transition-transform duration-150">
              {q}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
