import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { getProfile, updateProfile } from "../services/profile.js";
import { getPreferences, updatePreferences } from "../services/prefference.js";
import { extractErrorMessage } from "../services/api.js";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "preferences", label: "Preferences" },
];

const THEME_OPTIONS = ["dark", "light", "system"];
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    bio: "",
    avatar_url: "",
    phone_number: "",
    date_of_birth: "",
  });
  const [preferences, setPreferences] = useState({
    timezone: "",
    language: "en",
    theme: "dark",
    extra_settings: {},
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savedTab, setSavedTab] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [profileData, prefsData] = await Promise.all([
          getProfile(),
          getPreferences(),
        ]);
        setProfile({
          bio: profileData?.bio || "",
          avatar_url: profileData?.avatar_url || "",
          phone_number: profileData?.phone_number || "",
          date_of_birth: profileData?.date_of_birth || "",
        });
        setPreferences({
          timezone: prefsData?.timezone || "",
          language: prefsData?.language || "en",
          theme: prefsData?.theme || "dark",
          extra_settings: prefsData?.extra_settings || {},
        });
      } catch (err) {
        setError(extractErrorMessage(err, "Couldn't load your settings."));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const flashSaved = (tab) => {
    setSavedTab(tab);
    setTimeout(() => setSavedTab(null), 2000);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setError("");
    try {
      const updated = await updateProfile(profile);
      setProfile((prev) => ({ ...prev, ...updated }));
      flashSaved("profile");
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't save your profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPreferences(true);
    setError("");
    try {
      const updated = await updatePreferences(preferences);
      setPreferences((prev) => ({ ...prev, ...updated }));
      flashSaved("preferences");
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't save your preferences."));
    } finally {
      setSavingPreferences(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your profile details and app preferences.
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-1 bg-[#111827] border border-[#27272A] rounded-xl p-1 mb-6 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                          ${
                            activeTab === tab.id
                              ? "bg-[#FACC15] text-[#0F172A]"
                              : "text-gray-400 hover:text-white hover:bg-[#18181B]"
                          }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
            {error}
          </div>
        )}

        {loading ? (
          <SettingsSkeleton />
        ) : activeTab === "profile" ? (
          <div className="bg-[#111827] border border-[#27272A] rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#27272A] border border-[#27272A] flex items-center justify-center overflow-hidden flex-shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <UserIcon className="w-7 h-7 text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Profile photo</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Paste an image URL below to update it.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Field
                label="Avatar URL"
                value={profile.avatar_url}
                onChange={(v) => setProfile((p) => ({ ...p, avatar_url: v }))}
                placeholder="https://example.com/avatar.jpg"
              />

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, bio: e.target.value }))
                  }
                  rows={3}
                  placeholder="Tell your AI coach a bit about yourself"
                  className="w-full p-3 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white
                             placeholder-gray-500 outline-none resize-none
                             focus:border-[#FACC15]/50 transition-colors duration-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Phone number"
                  value={profile.phone_number}
                  onChange={(v) =>
                    setProfile((p) => ({ ...p, phone_number: v }))
                  }
                  placeholder="+91 98765 43210"
                />
                <Field
                  label="Date of birth"
                  type="date"
                  value={profile.date_of_birth}
                  onChange={(v) =>
                    setProfile((p) => ({ ...p, date_of_birth: v }))
                  }
                />
              </div>
            </div>

            <SaveBar
              saving={savingProfile}
              saved={savedTab === "profile"}
              onSave={handleSaveProfile}
            />
          </div>
        ) : (
          <div className="bg-[#111827] border border-[#27272A] rounded-2xl p-6">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Timezone"
                  value={preferences.timezone}
                  onChange={(v) =>
                    setPreferences((p) => ({ ...p, timezone: v }))
                  }
                  placeholder="Asia/Kolkata"
                />

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      setPreferences((p) => ({
                        ...p,
                        language: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white
                               outline-none focus:border-[#FACC15]/50 transition-colors duration-200"
                  >
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Theme
                </label>
                <div className="flex gap-2">
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setPreferences((p) => ({ ...p, theme }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium capitalize
                                  transition-all duration-200 ease-in-out
                                  ${
                                    preferences.theme === theme
                                      ? "bg-[#FACC15] text-[#0F172A]"
                                      : "bg-[#18181B] border border-[#27272A] text-gray-400 hover:text-white"
                                  }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <SaveBar
              saving={savingPreferences}
              saved={savedTab === "preferences"}
              onSave={handleSavePreferences}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ---------- shared bits ---------- */

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white
                   placeholder-gray-500 outline-none
                   focus:border-[#FACC15]/50 transition-colors duration-200"
      />
    </div>
  );
}

function SaveBar({ saving, saved, onSave }) {
  return (
    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#27272A]">
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 bg-[#FACC15] text-[#0F172A] font-semibold
                   px-4 py-2.5 rounded-xl shadow-md shadow-[#FACC15]/20
                   hover:bg-[#EAB308] hover:scale-[1.02] active:scale-95
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                   transition-all duration-200 ease-in-out"
      >
        {saving && <Spinner />}
        {saving ? "Saving…" : "Save changes"}
      </button>

      {saved && (
        <span className="text-sm text-[#22C55E] animate-[fadeIn_0.2s_ease-out]">
          Saved
        </span>
      )}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="bg-[#111827] border border-[#27272A] rounded-2xl p-6 animate-pulse space-y-5">
      <div className="h-4 w-1/3 bg-[#27272A] rounded" />
      <div className="h-11 w-full bg-[#27272A] rounded-xl" />
      <div className="h-11 w-full bg-[#27272A] rounded-xl" />
      <div className="h-11 w-2/3 bg-[#27272A] rounded-xl" />
    </div>
  );
}

/* ---------- icons ---------- */

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.5 20c1.5-3.8 4.5-5.5 7.5-5.5s6 1.7 7.5 5.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z"
      />
    </svg>
  );
}
