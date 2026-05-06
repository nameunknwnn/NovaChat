import { useState } from "react";
import { Wand2, Compass, Code2, GraduationCap } from "lucide-react";

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
  { key: "create", label: "Create", icon: Wand2 },
  { key: "explore", label: "Explore", icon: Compass },
  { key: "code", label: "Code", icon: Code2 },
  { key: "learn", label: "Learn", icon: GraduationCap },
] as const;

type CategoryKey = "create" | "explore" | "code" | "learn";

export default function WelcomeDashboard({ username, questions, setQuery, setShown }: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("create");

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-8">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-semibold text-foreground tracking-tight">
          How can I help you?
        </h1>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/60 border border-border">
        {categories.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Suggestion cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
        {questions[activeCategory].map((q, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(q);
              setShown(false);
            }}
            className="px-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-card/80 transition-all text-left leading-snug"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

