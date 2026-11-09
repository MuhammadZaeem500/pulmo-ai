"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Shield, Lock, Bell, Palette, Sun, Moon, Check, Globe, Loader2 } from "lucide-react";
import { doctorSettingsService } from "@/services/doctor.service";

export default function DoctorSettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [accountData, setAccountData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialty: "Pulmonologist",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    newAppointment: true,
    appointmentReminders: true,
    patientMessages: true,
    testResultsAvailable: true,
    weeklySummaryReport: true,
    systemAlerts: false,
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("UTC-5 (Eastern Time)");

  // Load profile and preferences on mount
  useEffect(() => {
    (async () => {
      try {
        const [profile, prefs] = await Promise.all([
          doctorSettingsService.getProfile(),
          doctorSettingsService.getPreferences(),
        ]);

        if (profile) {
          setAccountData({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            email: profile.email || "",
            phoneNumber: profile.phoneNumber || "",
            specialty: profile.specialty || "Pulmonologist",
          });
        }

        if (prefs) {
          setNotifications({
            newAppointment: prefs.newAppointment ?? true,
            appointmentReminders: prefs.appointmentReminders ?? true,
            patientMessages: prefs.patientMessages ?? true,
            testResultsAvailable: prefs.testResultsAvailable ?? true,
            weeklySummaryReport: prefs.weeklySummaryReport ?? true,
            systemAlerts: prefs.systemAlerts ?? false,
          });
          setTheme(prefs.theme || "light");
          setLanguage(prefs.language || "English");
          setTimeZone(prefs.timeZone || "UTC-5 (Eastern Time)");
        }
      } catch (err) {
        console.error("Failed to load doctor settings", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSaving(true);
    try {
      await doctorSettingsService.updateProfile(accountData);
      setSuccessMsg("Account profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (securityData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await doctorSettingsService.changePassword(
        securityData.currentPassword,
        securityData.newPassword
      );
      setSuccessMsg("Password changed successfully!");
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotification = async (key: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    const updatedNotifs = { ...notifications, [key]: nextVal };
    setNotifications(updatedNotifs);
    try {
      await doctorSettingsService.updatePreferences(updatedNotifs);
    } catch (err) {
      console.error("Failed to update notification preference", err);
    }
  };

  const handlePreferenceChange = async (key: string, value: string) => {
    if (key === "theme") setTheme(value);
    if (key === "language") setLanguage(value);
    if (key === "timeZone") setTimeZone(value);

    try {
      await doctorSettingsService.updatePreferences({
        theme,
        language,
        timeZone,
        [key]: value,
      });
    } catch (err) {
      console.error("Failed to update preference", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const navTabs = [
    { id: "account", label: "Account", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Manage your account preferences</p>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">{error}</div>}
      {successMsg && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs rounded-xl font-medium">{successMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="flex flex-row overflow-x-auto lg:flex-col bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm gap-1 pb-2 sm:pb-2 lg:pb-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(""); setSuccessMsg(""); }}
                className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 lg:shrink lg:w-full ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3">
          {activeTab === "account" && (
            <form onSubmit={handleSaveAccount}>
              <DashboardCard title="Account Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">First Name</label>
                    <input
                      type="text"
                      value={accountData.firstName}
                      onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={accountData.lastName}
                      onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={accountData.email}
                      onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={accountData.phoneNumber}
                      onChange={(e) => setAccountData({ ...accountData, phoneNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Specialty</label>
                    <input
                      type="text"
                      value={accountData.specialty}
                      onChange={(e) => setAccountData({ ...accountData, specialty: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </DashboardCard>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handleSaveSecurity}>
              <DashboardCard title="Security Settings">
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </DashboardCard>
            </form>
          )}

          {activeTab === "notifications" && (
            <DashboardCard title="Notification Preferences">
              <div className="space-y-4 pt-2">
                {[
                  { key: "newAppointment", title: "New Appointment", desc: "Notified when a new appointment is scheduled" },
                  { key: "appointmentReminders", title: "Appointment Reminders", desc: "Receive reminders before appointments" },
                  { key: "patientMessages", title: "Patient Messages", desc: "Alerts when patients send messages" },
                  { key: "testResultsAvailable", title: "Test Results Available", desc: "When lab or scan results are uploaded" },
                  { key: "weeklySummaryReport", title: "Weekly Summary Report", desc: "Weekly overview of activity and patients" },
                  { key: "systemAlerts", title: "System Alerts", desc: "Platform updates and maintenance notices" },
                ].map((item) => {
                  const isChecked = notifications[item.key as keyof typeof notifications];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleNotification(item.key, isChecked)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          isChecked ? "bg-teal-500" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            isChecked ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </DashboardCard>
          )}

          {activeTab === "preferences" && (
            <DashboardCard title="Preferences">
              <div className="space-y-6 pt-2">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Globe },
                    ].map((t) => {
                      const Icon = t.icon;
                      const isSelected = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handlePreferenceChange("theme", t.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs font-semibold transition-all ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/30 text-blue-600"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="w-5 h-5 mb-2" />
                          {t.label}
                          {isSelected && <Check className="w-3.5 h-3.5 mt-1 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => handlePreferenceChange("language", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block nz-1">Time Zone</label>
                  <select
                    value={timeZone}
                    onChange={(e) => handlePreferenceChange("timeZone", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                  >
                    <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                    <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                    <option value="UTC+0 (Greenwich Mean Time)">UTC+0 (Greenwich Mean Time)</option>
                    <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
                  </select>
                </div>
              </div>
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
}