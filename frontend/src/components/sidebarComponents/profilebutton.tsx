import { LogOut, Settings, User, MessageCircle, ChevronUp, Check, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

interface Profile {
  id: string;
  name: string;
  active: boolean;
}

export default function ProfileButton() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.name) setUserName(data.user.name);
        if (data?.user?.image) setUserImage(data.user.image);
      })
      .catch(() => {});

    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setProfiles(data.profiles || []);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const handleProfileSwitch = async (profileId: string) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ profileId }),
    });
    setProfiles((prev) => prev.map((p) => ({ ...p, active: p.id === profileId })));
  };

  const activeProfile = profiles.find((p) => p.active);

  return (
    <div className="relative" ref={menuRef}>
      {/* Popup menu */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="px-4 py-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {userName ?? "User"}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border/60 text-muted-foreground">
                Free
              </span>
            </div>
          </div>

          {/* Profile switcher */}
          {profiles.length > 0 && (
            <div className="px-2 py-2 border-b border-border/50">
              <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
                <UserCircle size={12} className="text-muted-foreground/60" />
                <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">Profile</span>
              </div>
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleProfileSwitch(profile.id)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm hover:bg-accent/50 transition-colors"
                >
                  <span className={profile.active ? "text-foreground font-medium" : "text-foreground/70"}>
                    {profile.name}
                  </span>
                  {profile.active && <Check size={13} className="text-primary" />}
                </button>
              ))}
            </div>
          )}

          <div className="py-1">
            <button
              onClick={() => { navigate("/settings/profile"); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <Settings size={14} />
              Settings
            </button>
            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <MessageCircle size={14} />
              Feedback
            </button>
          </div>
          <div className="border-t border-border/50 py-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={() => token ? setOpen(!open) : navigate("/signin")}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all duration-150 group"
      >
        {userImage ? (
          <img
            src={userImage}
            alt={userName ?? "User"}
            className="w-8 h-8 rounded-full shrink-0 object-cover ring-1 ring-border/50"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-primary shrink-0 ring-1 ring-primary/20">
            <User size={14} />
          </div>
        )}
        <div className="flex-1 text-left min-w-0">
          <span className="text-sm font-medium block truncate text-foreground/80">
            {token ? (userName ?? "My Account") : "Sign In"}
          </span>
          {activeProfile && (
            <span className="text-[11px] text-muted-foreground/60 truncate block">
              {activeProfile.name}
            </span>
          )}
        </div>
        {token && (
          <ChevronUp
            size={14}
            className={`text-muted-foreground/50 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
          />
        )}
      </button>
    </div>
  );
}
