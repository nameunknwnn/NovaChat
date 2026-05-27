import { NavLink, useNavigate } from "react-router-dom";
import { User, ChevronLeft, LogOut, Command } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";

const navItems = [
  { label: "Customization", path: "/settings/profile" },
  { label: "History & Sync", path: "/settings/history" },
  { label: "Models", path: "/settings/models" },
];

const shortcuts = [
  { label: "Search", keys: ["K"] },
  { label: "New Chat", keys: ["Shift", "O"] },
  { label: "Toggle Sidebar", keys: ["B"] },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState<string | null>(null);

  const handleAuth = () => {
    if (token) {
      localStorage.removeItem("token");
      navigate("/signin");
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(payload.email || "");
      setUserName(payload.email?.split("@")[0] || "User");
    } catch {}

    fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.name) setUserName(data.user.name);
        if (data?.user?.image) setUserImage(data.user.image);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left sidebar */}
      <aside className="w-72 border-r border-border/50 flex flex-col shrink-0">
        {/* Back button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
          >
            <ChevronLeft size={16} />
            Back to Chat
          </button>
        </div>

        {/* User info */}
        <div className="flex flex-col items-center py-6 px-6 gap-3">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <User size={40} className="text-primary/80" />
            </div>
          )}
          <div className="text-center space-y-1">
            <p className="font-semibold text-base">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>

          </div>
        </div>

        {/* Usage Limits */}
        <div className="px-5 py-4 mx-4 rounded-xl bg-muted/30 border border-border/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Usage Limits</span>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span>Base</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary w-2/3 transition-all duration-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="px-5 py-4 mt-4 mx-4 rounded-xl bg-muted/30 border border-border/40">
          <span className="text-xs font-medium text-muted-foreground">Keyboard Shortcuts</span>
          <div className="mt-3 space-y-2.5">
            {shortcuts.map(({ label, keys }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-foreground/70">{label}</span>
                <div className="flex items-center gap-1">
                  <kbd className="flex items-center justify-center h-5 min-w-[20px] px-1 rounded bg-muted border border-border/60 text-[10px] text-muted-foreground">
                    <Command size={9} />
                  </kbd>
                  {keys.map((k) => (
                    <kbd key={k} className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded bg-muted border border-border/60 text-[10px] text-muted-foreground">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* Sign out */}
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAuth}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut size={14} className="mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation tabs */}
        <div className="border-b border-border/50 px-8 pt-6">
          <nav className="flex items-center gap-1">
            {navItems.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? "text-foreground bg-accent/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
