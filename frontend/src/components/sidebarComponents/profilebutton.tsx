import { LogIn, LogOut, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ProfileButton() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.name) setUserName(data.user.name);
      })
      .catch(() => {});
  }, [token]);

  const handleAuth = () => {
    if (token) {
      localStorage.removeItem("token");
      navigate("/signin");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="relative group/profile">
      {/* Profile page button — visible only on hover */}
      {token && (
        <button
          onClick={() => navigate("/settings/profile")}
          className="absolute -top-10 left-0 right-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all opacity-0 group-hover/profile:opacity-100 pointer-events-none group-hover/profile:pointer-events-auto text-sm"
        >
          <Settings size={14} />
          <span className="font-medium">Profile settings</span>
        </button>
      )}

      {/* Main account / sign-in button */}
      <button
        onClick={handleAuth}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors group/btn"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary shrink-0">
          <User size={14} />
        </div>
        <span className="text-sm font-medium flex-1 text-left truncate">
          {token ? (userName ?? "My Account") : "Sign In"}
        </span>
        {token ? (
          <LogOut size={14} className="opacity-0 group-hover/btn:opacity-60 transition-opacity shrink-0" />
        ) : (
          <LogIn size={14} className="opacity-0 group-hover/btn:opacity-60 transition-opacity shrink-0" />
        )}
      </button>
    </div>
  );
}
