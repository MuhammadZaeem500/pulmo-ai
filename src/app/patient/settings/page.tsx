"use client";

import { useState, useEffect } from "react";
import { User, Bell, Globe, Moon, Loader2, KeyRound, X } from "lucide-react";
import SettingSectionCard from "@/components/common/SettingSectionCard";
import SettingToggleItem from "@/components/common/SettingToggleItem";
import { settingsService } from "@/services/settings.service";

// ─── Change Password Modal ───────────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext]       = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await settingsService.changePassword(current, next);
      alert("Password changed successfully!");
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Change Password</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Current Password", value: current, onChange: setCurrent },
            { label: "New Password",     value: next,    onChange: setNext    },
            { label: "Confirm Password", value: confirm, onChange: setConfirm },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {label}
              </label>
              <input
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          ))}

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Settings Page ──────────────────────────────────────────────────────
export default function SettingsPage() {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);

  // Preferences state — mirrors UpdatePreferencesDto
  const [emailNotifs,           setEmailNotifs]           = useState(true);
  const [appointmentReminders,  setAppointmentReminders]  = useState(true);
  const [healthTips,            setHealthTips]            = useState(false);
  const [darkMode,              setDarkMode]              = useState(false);
  const [language,              setLanguage]              = useState("English");
  const [timeZone,              setTimeZone]              = useState("UTC");

  // ── Load saved preferences on mount ────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const prefs = await settingsService.getPreferences();
        if (prefs) {
          setEmailNotifs(prefs.emailNotifications  ?? true);
          setAppointmentReminders(prefs.appointmentReminders ?? true);
          setHealthTips(prefs.healthTips           ?? false);
          setDarkMode(prefs.darkMode               ?? false);
          setLanguage(prefs.language               ?? "English");
          setTimeZone(prefs.timeZone               ?? "UTC");
        }
      } catch (err) {
        console.error("Failed to load preferences", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Persist any preference change immediately ───────────────────────────────
  const persist = async (patch: Parameters<typeof settingsService.updatePreferences>[0]) => {
    setSaving(true);
    try {
      await settingsService.updatePreferences(patch);
    } catch (err) {
      console.error("Failed to save preference", err);
    } finally {
      setSaving(false);
    }
  };

  const toggle = (
    current: boolean,
    setter: (v: boolean) => void,
    key: Parameters<typeof settingsService.updatePreferences>[0]
  ) => {
    const next = !current;
    setter(next);
    persist({ ...key, ...{ [Object.keys(key)[0]]: next } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}

      <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Settings</h1>
            <p className="text-gray-500 text-sm">Manage your account preferences and privacy settings</p>
          </div>
          {saving && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium pt-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
            </div>
          )}
        </div>

        <div className="space-y-6">

          {/* ── Account Settings ─────────────────────────────────────── */}
          <SettingSectionCard icon={User} title="Account Settings">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Change Password</h3>
                <p className="text-xs text-gray-500 mt-0.5">Update your password regularly for security</p>
              </div>
              <button
                onClick={() => setShowPwModal(true)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer"
              >
                Change
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Delete Account</h3>
                <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and data</p>
              </div>
              <button
                onClick={() => alert("Please contact support to delete your account.")}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 font-medium text-sm hover:bg-rose-50 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </SettingSectionCard>

          {/* ── Notification Preferences ──────────────────────────────── */}
          <SettingSectionCard icon={Bell} title="Notification Preferences">
            <SettingToggleItem
              title="Email Notifications"
              description="Receive updates via email"
              enabled={emailNotifs}
              onToggle={() => toggle(emailNotifs, setEmailNotifs, { emailNotifications: emailNotifs })}
            />
            <div className="pt-4 border-t border-gray-100">
              <SettingToggleItem
                title="Appointment Reminders"
                description="Get reminded about upcoming appointments"
                enabled={appointmentReminders}
                onToggle={() => toggle(appointmentReminders, setAppointmentReminders, { appointmentReminders })}
              />
            </div>
            <div className="pt-4 border-t border-gray-100">
              <SettingToggleItem
                title="Health Tips"
                description="Receive personalized health recommendations"
                enabled={healthTips}
                onToggle={() => toggle(healthTips, setHealthTips, { healthTips })}
              />
            </div>
          </SettingSectionCard>

          {/* ── Language & Region ─────────────────────────────────────── */}
          <SettingSectionCard icon={Globe} title="Language & Region">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Language</h3>
                <p className="text-xs text-gray-500 mt-0.5">Choose your preferred language</p>
              </div>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  persist({ language: e.target.value });
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Time Zone</h3>
                <p className="text-xs text-gray-500 mt-0.5">Set your local time zone</p>
              </div>
              <select
                value={timeZone}
                onChange={(e) => {
                  setTimeZone(e.target.value);
                  persist({ timeZone: e.target.value });
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
              >
                <option value="EST (UTC-5)">EST (UTC-5)</option>
                <option value="PST (UTC-8)">PST (UTC-8)</option>
                <option value="CST (UTC-6)">CST (UTC-6)</option>
                <option value="UTC">UTC</option>
                <option value="PKT (UTC+5)">PKT (UTC+5)</option>
              </select>
            </div>
          </SettingSectionCard>

          {/* ── Theme Preferences ─────────────────────────────────────── */}
          <SettingSectionCard icon={Moon} title="Theme Preferences">
            <SettingToggleItem
              title="Dark Mode"
              description="Switch to dark theme"
              enabled={darkMode}
              onToggle={() => toggle(darkMode, setDarkMode, { darkMode })}
            />
          </SettingSectionCard>

        </div>
      </div>
    </>
  );
}
