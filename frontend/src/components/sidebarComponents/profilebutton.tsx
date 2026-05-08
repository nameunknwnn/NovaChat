import { LogIn, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

export default function ProfileButton() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAuth = () => {
    if (token) {
      localStorage.removeItem("token");
      navigate("/signin");
    } else {
      navigate("/signin");
    }
  };

  return (<>
    <Button onClick={()=>{navigate('/settings/profile')}}>
      profile page
    </Button>
    <button
      onClick={handleAuth}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors group `}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary shrink-0">
        <User size={14} />
      </div>
      <span className="text-sm font-medium flex-1 text-left">
        {token ? "My Account" : "Sign In"}
      </span>
      {token ? (
        <LogOut size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
      ) : (
        <LogIn size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
      )}
    </button>
    </>
  );
}
