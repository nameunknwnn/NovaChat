import { useEffect, useState } from "react";
import QueryBox from "./headerComponents/queryBox";
import WelcomeDashboard from "./headerComponents/welcomeDashboard";

const questions = {
  create: [
    "Write a short story about the future of AI",
    "Draft a product launch email",
    "Create a weekly meal plan",
    "Write a cover letter for a dev role",
  ],
  explore: [
    "How does quantum computing work?",
    "Are black holes real?",
    "What is the multiverse theory?",
    "Explain the Fermi paradox",
  ],
  code: [
    "How many R's are in 'strawberry'?",
    "Debug my React useEffect hook",
    "Explain async/await in JavaScript",
    "Write a binary search in Python",
  ],
  learn: [
    "How does AI work?",
    "Explain machine learning simply",
    "What is the meaning of life?",
    "Teach me about stoic philosophy",
  ],
};

export default function Header() {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(true);
  const [username, setUsername] = useState("there");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.name) setUsername(data.user.name);
        else if (data?.user?.email) setUsername(data.user.email.split("@")[0]);
      })
      .catch(() => {});

    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const active = (data.profiles || []).find((p: any) => p.active);
        if (active) setUsername(active.name);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-y-auto">
        {shown ? (
          <WelcomeDashboard
            username={username}
            questions={questions}
            setQuery={setQuery}
            setShown={setShown}
          />
        ) : (
          <div className="h-full" />
        )}
      </div>
      <div className="shrink-0 px-6 pb-6 pt-2">
        <QueryBox query={query} setQuery={setQuery} shown={shown} setShown={setShown} />
      </div>
    </div>
  );
}
