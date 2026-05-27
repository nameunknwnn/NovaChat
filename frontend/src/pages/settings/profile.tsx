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
  const [edit, setEdit] = useState(false);

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

  const handleditSubmit = async () => {
    await fetch(`${backendUrl}/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: activeProfile?.id,
        name: activeProfile?.name,
        occupation: form.occupation,
        preferences: form.preferences,
        traits: form.traits,
      }),
    });
  };

  const activeProfile = profiles.find((p) => p.active);

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Customize NovaChat</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage profiles that personalize how NovaChat responds to you.
          </p>
        </div>
      </div>

      {/* Profile selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">
            Profile
          </h2>
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedProfileId(null);
            }}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Plus size={14} />
            New profile
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-6">
            <Loader2 size={16} className="animate-spin" />
            Loading profiles...
          </div>
        ) : profiles.length === 0 && !isCreating ? (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            No profiles yet.{" "}
            <button
              className="text-primary hover:text-primary/80 font-medium transition-colors"
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
                className={`flex items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200 cursor-pointer group ${
                  profile.active
                    ? "border-primary/40 bg-primary/5 shadow-sm shadow-primary/5"
                    : "border-border/50 hover:border-border hover:bg-accent/20"
                }`}
                onClick={() =>
                  setSelectedProfileId(
                    profile.id === selectedProfileId ? null : profile.id,
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      profile.active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {profile.name}
                    </p>
                    {profile.occupation && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {profile.occupation}
                      </p>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivate(profile.id);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all px-2.5 py-1 rounded-lg hover:bg-accent"
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
        <div className="space-y-5 rounded-xl border border-border/50 p-6 bg-card/50">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              Active profile — {activeProfile.name}
            </h2>
            <button
              onClick={() => {
                setForm({
                  name: activeProfile.name,
                  occupation: activeProfile.occupation || "",
                  traits: activeProfile.tratis || "",
                  preferences: activeProfile.preferences || "",
                });
                setEdit(true);
              }}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <Pencil size={13} className="text-muted-foreground" />
            </button>
          </div>
          {edit ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                    Occupation
                  </p>
                  <input
                    className="w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                    placeholder="Occupation"
                    value={form.occupation}
                    onChange={(e) =>
                      setForm({ ...form, occupation: e.target.value })
                    }
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium">Traits</p>
                  <input
                    className="w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                    placeholder="e.g. concise, friendly"
                    value={form.traits}
                    onChange={(e) =>
                      setForm({ ...form, traits: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                    Preferences
                  </p>
                  <textarea
                    className="w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none transition-all duration-200"
                    placeholder="Share context, preferences, or anything helpful..."
                    value={form.preferences}
                    rows={3}
                    onChange={(e) =>
                      setForm({ ...form, preferences: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEdit(false)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await handleditSubmit();
                      await fetchProfiles();
                      setEdit(false);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="rounded-lg"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                  ) : null}
                  Save changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {activeProfile.occupation && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">
                    Occupation
                  </p>
                  <p className="text-foreground/80">{activeProfile.occupation}</p>
                </div>
              )}
              {activeProfile.tratis && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Traits</p>
                  <p className="text-foreground/80">{activeProfile.tratis}</p>
                </div>
              )}
              {activeProfile.preferences && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">
                    Preferences
                  </p>
                  <p className="text-foreground/80">{activeProfile.preferences}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create new profile form */}
      {isCreating && (
        <div className="space-y-5 rounded-xl border border-border/50 p-6 bg-card/50">
          <h2 className="text-sm font-semibold">New Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                What should NovaChat call you?{" "}
                <span className="text-destructive">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                placeholder="e.g. Alex"
                value={form.name}
                maxLength={50}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <p className="text-[11px] text-muted-foreground/50 text-right mt-1">
                {form.name.length}/50
              </p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                What do you do?
              </label>
              <input
                className="w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                placeholder="e.g. Software engineer"
                value={form.occupation}
                maxLength={100}
                onChange={(e) =>
                  setForm({ ...form, occupation: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                What traits should NovaChat have?
              </label>
              <input
                className="w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                placeholder="e.g. concise, friendly, direct"
                value={form.traits}
                maxLength={100}
                onChange={(e) => setForm({ ...form, traits: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                Anything else NovaChat should know about you?
              </label>
              <textarea
                className="w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none transition-all duration-200"
                placeholder="Share context, preferences, or anything helpful..."
                value={form.preferences}
                rows={3}
                maxLength={3000}
                onChange={(e) =>
                  setForm({ ...form, preferences: e.target.value })
                }
              />
              <p className="text-[11px] text-muted-foreground/50 text-right">
                {form.preferences.length}/3000
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreating(false);
                setForm({
                  name: "",
                  occupation: "",
                  traits: "",
                  preferences: "",
                });
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={saving || !form.name.trim()}
              className="rounded-lg"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin mr-1.5" />
              ) : null}
              Save profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
