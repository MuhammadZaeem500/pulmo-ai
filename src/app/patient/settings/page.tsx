"use client";

import { useState } from "react";
import { User, Bell, Globe, Moon, Loader2, KeyRound, X } from "lucide-react";
import SettingSectionCard from "@/components/common/SettingSectionCard";
import SettingToggleItem from "@/components/common/SettingToggleItem";
import { authService } from "@/services/auth.service";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

// ─── Change Password Modal ───────────────────────────────────────────────────
function ChangePasswordModal({ 
  onClose,
  onSuccess,
}: { 
  onClose: () => void;
  onSuccess: (title: string, message?: string) => void;
}) {
  const { changePassword, saving, error: contextError } = useSettings();
  const [current, setCurrent] = useState("");
  const [next, setNext]       = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (next.length < 6) {
      setLocalError("New password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await changePassword(current, next);
      onSuccess("Password Changed", "Your password has been updated successfully!");
      onClose();
    } catch (err: any) {
      setLocalError(err?.message || "Failed to change password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
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
                disabled={saving}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
              />
            </div>
          ))}

          {(localError || contextError) && (
            <p className="text-xs text-rose-600 font-medium">{localError || contextError}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
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
  const { setTheme } = useTheme();
  const { preferences, loading, saving, updatePreference, deleteAccount } = useSettings();
  const { setLanguage, setTimeZone } = useLocale();
  const { toasts, removeToast, success, error, warning, loading: showLoading } = useToast();
  const [showPwModal, setShowPwModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Handle preference toggle ───────────────────────────────────────────────
  const handleToggle = async (key: string, currentValue: boolean) => {
    try {
      await updatePreference(key as any, !currentValue);
      // Update theme globally if darkMode changed
      if (key === "darkMode") {
        setTheme(!currentValue ? "dark" : "light");
      }
    } catch (error) {
      console.error("Failed to toggle preference", error);
    }
  };

  // ── Handle dropdown change ─────────────────────────────────────────────────
  const handleSelectChange = async (key: string, value: string) => {
    try {
      await updatePreference(key as any, value);
      
      // Update locale providers for real-time translation updates
      if (key === "language") {
        setLanguage(value);
      } else if (key === "timeZone") {
        setTimeZone(value);
      }
    } catch (error) {
      console.error("Failed to update preference", error);
    }
  };

  // ── Handle Account Deletion ────────────────────────────────────────────────
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setShowFinalConfirm(true);
  };

  const handleFinalConfirmDelete = async () => {
    setShowFinalConfirm(false);
    setIsDeleting(true);
    
    try {
      // Show loading toast
      showLoading("Deleting Account", "Please wait while we delete your account and data...");
      
      // Delete account from backend database
      await deleteAccount();
      
      // Delete Firebase user
      await authService.deleteAccount();
      
      // Show success message
      success(
        "Account Deleted Successfully",
        "Your account and all associated data have been permanently deleted. You will be redirected to login."
      );
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "/auth/patient/sign-in";
      }, 2000);
    } catch (err: any) {
      console.error("Failed to delete account", err);
      setIsDeleting(false);
      error(
        "Failed to Delete Account",
        err?.message || "An error occurred while deleting your account. Please try again or contact support."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="flex justify-center items-center py-32">
        <p className="text-gray-500">Failed to load preferences. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <>
      {showPwModal && (
        <ChangePasswordModal 
          onClose={() => setShowPwModal(false)} 
          onSuccess={success}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmationModal
          title="Delete Account?"
          description="⚠️ WARNING: This will permanently delete your account and ALL associated data."
          details={[
            "All medical records",
            "All appointments",
            "All prescriptions",
            "All chat history",
          ]}
          confirmText="Proceed"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showFinalConfirm && (
        <ConfirmationModal
          title="Final Confirmation"
          description="Your account cannot be recovered after this action. This is permanent."
          confirmText="Permanently Delete"
          cancelText="Cancel"
          isDangerous={true}
          isLoading={isDeleting}
          onConfirm={handleFinalConfirmDelete}
          onCancel={() => setShowFinalConfirm(false)}
        />
      )}

      <div className="p-2 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Settings</h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Manage your account preferences and privacy settings</p>
          </div>
          {saving && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">

          {/* ── Account Settings ─────────────────────────────────────── */}
          <SettingSectionCard icon={User} title="Account Settings">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">Change Password</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Update your password regularly for security</p>
              </div>
              <button
                onClick={() => setShowPwModal(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm hover:bg-gray-50 transition-all cursor-pointer text-center"
              >
                Change
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">Delete Account</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Permanently delete your account and data</p>
              </div>
              <button
                onClick={handleDeleteClick}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-rose-200 text-rose-600 font-medium text-xs sm:text-sm hover:bg-rose-50 transition-all cursor-pointer text-center"
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
              enabled={preferences.emailNotifications}
              onToggle={() => handleToggle("emailNotifications", preferences.emailNotifications)}
            />
            <div className="pt-4 border-t border-gray-100">
              <SettingToggleItem
                title="Appointment Reminders"
                description="Get reminded about upcoming appointments"
                enabled={preferences.appointmentReminders}
                onToggle={() => handleToggle("appointmentReminders", preferences.appointmentReminders)}
              />
            </div>
            <div className="pt-4 border-t border-gray-100">
              <SettingToggleItem
                title="Health Tips"
                description="Receive personalized health recommendations"
                enabled={preferences.healthTips}
                onToggle={() => handleToggle("healthTips", preferences.healthTips)}
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
                value={preferences.language}
                onChange={(e) => handleSelectChange("language", e.target.value)}
                disabled={saving}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs disabled:opacity-50"
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
                value={preferences.timeZone}
                onChange={(e) => handleSelectChange("timeZone", e.target.value)}
                disabled={saving}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs disabled:opacity-50"
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
              enabled={preferences.darkMode}
              onToggle={() => handleToggle("darkMode", preferences.darkMode)}
            />
          </SettingSectionCard>

        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}