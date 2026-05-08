import { useEffect, useState } from "react";
import { Plus, Check, Pencil, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";

interface Profile {
  id: string;
  name: string;
  occupation: string | null;
  preferences: string | null;
  tratis: string | null;
  active: boolean;
}

export default function ProfileSettings() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    occupation: "",
    traits: "",
    preferences: "",
  });

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchProfiles = async () => {
    try {
      const res = await fetch(`${backendUrl}/profile`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleActivate = async (profileId: string) => {
    setActivating(profileId);
    try {
      await fetch(`${backendUrl}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profileId }),
      });
      await fetchProfiles();
    } finally {
      setActivating(null);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await fetch(`${backendUrl}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          occupation: form.occupation,
          preferences: form.preferences,
          traits: form.traits,
        }),
      });
      setForm({ name: "", occupation: "", traits: "", preferences: "" });
      setIsCreating(false);
      await fetchProfiles();
    } finally {
      setSaving(false);
    }
  };

  const activeProfile = profiles.find((p) => p.active);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Customization</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage profiles that personalize how NovaChat responds to you.
        </p>
      </div>

      {/* Profile list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Profiles
          </h2>
          <button
            onClick={() => { setIsCreating(true); setSelectedProfileId(null); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus size={14} />
            New profile
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
            <Loader2 size={16} className="animate-spin" />
            Loading profiles…
          </div>
        ) : profiles.length === 0 && !isCreating ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No profiles yet.{" "}
            <button
              className="underline hover:text-foreground"
              onClick={() => setIsCreating(true)}
            >
              Create your first one
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors cursor-pointer group ${
                  profile.active
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-border/80 hover:bg-accent/30"
                }`}
                onClick={() => setSelectedProfileId(profile.id === selectedProfileId ? null : profile.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      profile.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{profile.name}</p>
                    {profile.occupation && (
                      <p className="text-xs text-muted-foreground mt-0.5">{profile.occupation}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {profile.active ? (
                    <span className="flex items-center gap-1 text-xs text-primary font-medium">
                      <Check size={13} />
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleActivate(profile.id); }}
                      className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all px-2 py-1 rounded hover:bg-accent"
                      disabled={activating === profile.id}
                    >
                      {activating === profile.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        "Set active"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active profile details */}
      {activeProfile && !isCreating && (
        <div className="space-y-4 rounded-lg border border-border p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Active profile — {activeProfile.name}</h2>
            <Pencil size={13} className="text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {activeProfile.occupation && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Occupation</p>
                <p>{activeProfile.occupation}</p>
              </div>
            )}
            {activeProfile.tratis && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Traits</p>
                <p>{activeProfile.tratis}</p>
              </div>
            )}
            {activeProfile.preferences && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Preferences</p>
                <p>{activeProfile.preferences}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create new profile form */}
      {isCreating && (
        <div className="space-y-4 rounded-lg border border-border p-5">
          <h2 className="text-sm font-semibold">New Profile</h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                What should NovaChat call you? <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="e.g. Alex"
                value={form.name}
                maxLength={50}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <p className="text-xs text-muted-foreground/60 text-right mt-1">{form.name.length}/50</p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">What do you do?</label>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="e.g. Software engineer"
                value={form.occupation}
                maxLength={100}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                What traits should NovaChat have?
              </label>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="e.g. concise, friendly, direct"
                value={form.traits}
                maxLength={100}
                onChange={(e) => setForm({ ...form, traits: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                Anything else NovaChat should know about you?
              </label>
              <textarea
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                placeholder="Share context, preferences, or anything helpful…"
                value={form.preferences}
                rows={3}
                maxLength={3000}
                onChange={(e) => setForm({ ...form, preferences: e.target.value })}
              />
              <p className="text-xs text-muted-foreground/60 text-right">{form.preferences.length}/3000</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setIsCreating(false); setForm({ name: "", occupation: "", traits: "", preferences: "" }); }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={saving || !form.name.trim()}>
              {saving ? <Loader2 size={14} className="animate-spin mr-1.5" /> : null}
              Save profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
