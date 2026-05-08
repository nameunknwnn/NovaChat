import { NavLink, useNavigate } from "react-router-dom";
import { User, History, Cpu, ChevronLeft, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Customization", path: "/settings/profile", icon: Settings },
  { label: "History & Sync", path: "/settings/history", icon: History },
  { label: "Models", path: "/settings/models", icon: Cpu },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(payload.email || "");
    } catch {}
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left sidebar */}
      <aside className="w-72 border-r border-border flex flex-col shrink-0">
        {/* User info */}
        <div className="flex flex-col items-center py-8 px-6 border-b border-border gap-3">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={36} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-base">{userEmail.split("@")[0] || "User"}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
            <span className="text-xs text-muted-foreground/70 mt-1 inline-block">Free Plan</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Back to chat */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full rounded-lg hover:bg-accent/50"
          >
            <ChevronLeft size={16} />
            Back to Chat
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
