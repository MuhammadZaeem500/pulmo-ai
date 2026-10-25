"use client";

import { useState } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Shield, Lock, Bell, Palette, Sun, Moon, Check, Globe } from "lucide-react";

export default function DoctorSettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const [accountData, setAccountData] = useState({
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.mitchell@citymedical.com",
    phone: "+1 (555) 234-5678",
    specialty: "Pulmonologist",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    newAppointment: true,
    appointmentReminders: true,
    patientMessages: true,
    testResults: true,
    weeklySummary: true,
    systemAlerts: false,
  });

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("UTC-5 (Eastern Time)");

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  const navTabs = [
    { id: "account", label: "Account", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Manage your account preferences</p>
      </div>

      {/* Main Layout: Sub-navigation & Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sub-navigation */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm space-y-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
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

        {/* Right Content Area using Reusable DashboardCard */}
        <div className="lg:col-span-3">
          {/* TAB 1: ACCOUNT */}
          {activeTab === "account" && (
            <DashboardCard title="Account Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={accountData.firstName}
                    onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={accountData.lastName}
                    onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={accountData.phone}
                    onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Specialty</label>
                  <input
                    type="text"
                    value={accountData.specialty}
                    onChange={(e) => setAccountData({ ...accountData, specialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </DashboardCard>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === "security" && (
            <DashboardCard title="Security Settings">
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Two-Factor Authentication Box */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">Two-Factor Authentication</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Enhance account security with 2FA. Recommended for healthcare providers.</p>
                  </div>
                  <button onClick={() => alert("Enable 2FA modal")} className="text-xs font-bold text-blue-600 hover:underline shrink-0">
                    Enable 2FA &rarr;
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </DashboardCard>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <DashboardCard title="Notification Preferences">
              <div className="space-y-4 pt-2">
                {[
                  { key: "newAppointment", title: "New Appointment", desc: "Notified when a new appointment is scheduled" },
                  { key: "appointmentReminders", title: "Appointment Reminders", desc: "Receive reminders before appointments" },
                  { key: "patientMessages", title: "Patient Messages", desc: "Alerts when patients send messages" },
                  { key: "testResults", title: "Test Results Available", desc: "When lab or scan results are uploaded" },
                  { key: "weeklySummary", title: "Weekly Summary Report", desc: "Weekly overview of activity and patients" },
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
                        onClick={() =>
                          setNotifications({ ...notifications, [item.key]: !isChecked })
                        }
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

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </DashboardCard>
          )}

          {/* TAB 4: PREFERENCES */}
          {activeTab === "preferences" && (
            <DashboardCard title="Preferences">
              <div className="space-y-6 pt-2">
                {/* Theme Selector */}
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
                          onClick={() => setTheme(t.id)}
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

                {/* Language */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>

                {/* Time Zone */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Time Zone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                    <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                    <option value="UTC+0 (Greenwich Mean Time)">UTC+0 (Greenwich Mean Time)</option>
                    <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
}