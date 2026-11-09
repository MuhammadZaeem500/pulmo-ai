"use client";

import React, { useState } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Monitor, 
  ChevronRight, 
  Check 
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"Account" | "Security" | "Notification" | "Language" | "Theme">("Account");

  const [fullName, setFullName] = useState("Dr. Admin User");
  const [email, setEmail] = useState("admin@pulmoai.com");
  const [organization, setOrganization] = useState("PulmoAI Administration");
  const [role, setRole] = useState("Super Admin");
  const [bio, setBio] = useState("");

  const [twoFactor, setTwoFactor] = useState(true);
  const [autoSession, setAutoSession] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [apiAccess, setApiAccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifVerification, setNotifVerification] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifSystem, setNotifSystem] = useState(true);
  const [notifAdminUpdates, setNotifAdminUpdates] = useState(false);
  const [notifEmailDigest, setNotifEmailDigest] = useState(true);
  const [notifSms, setNotifSms] = useState(false);

  const [language, setLanguage] = useState("English (US)");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeZone, setTimeZone] = useState("UTC");

  const [selectedTheme, setSelectedTheme] = useState<"Light" | "Blue Dark" | "Teal">("Light");
  const [sidebarWidth, setSidebarWidth] = useState<"Compact" | "Default" | "Wide">("Default");

  const handleSave = () => {
    alert(`Settings saved successfully for: ${activeTab}`);
  };

  const navItems = [
    { name: "Account", icon: User },
    { name: "Security", icon: Shield },
    { name: "Notification", icon: Bell },
    { name: "Language", icon: Globe },
    { name: "Theme", icon: Monitor },
  ] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
     
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Manage your account preferences and platform configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
       
        <div className="lg:col-span-1">
          <DashboardCard className="p-2">
            <nav className="flex flex-row overflow-x-auto lg:flex-col gap-1 pb-1 lg:pb-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name as any)}
                    className={`flex items-center justify-between px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 lg:shrink lg:w-full ${
                      isActive
                        ? "bg-blue-50 text-blue-600 shadow-xs"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-blue-600 hidden lg:block" />}
                  </button>
                );
              })}
            </nav>
          </DashboardCard>
        </div>

       
        <div className="lg:col-span-3 space-y-6">
          <DashboardCard>
           
            {activeTab === "Account" && (
              <div className="space-y-6">
                <h3 className="text-base font-extrabold text-slate-900 pb-4 border-b border-slate-100">Account Settings</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Admin Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Clinic Manager">Clinic Manager</option>
                    <option value="Support Admin">Support Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Bio / Notes</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Optional admin notes..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            )}

           
            {activeTab === "Security" && (
              <div className="space-y-6">
                <h3 className="text-base font-extrabold text-slate-900 pb-4 border-b border-slate-100">Security Settings</h3>

                <div className="space-y-5 divide-y divide-slate-100">
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication</h4>
                      <p className="text-[11px] text-slate-400">Require a second verification step on every login.</p>
                    </div>
                    <button
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${twoFactor ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"}`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Auto Session Timeout</h4>
                      <p className="text-[11px] text-slate-400">Automatically log out after 30 minutes of inactivity.</p>
                    </div>
                    <button
                      onClick={() => setAutoSession(!autoSession)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${autoSession ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"}`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Login Alerts</h4>
                      <p className="text-[11px] text-slate-400">Receive email notifications for new sign-ins to your account.</p>
                    </div>
                    <button
                      onClick={() => setLoginAlerts(!loginAlerts)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${loginAlerts ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"}`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">API Access</h4>
                      <p className="text-[11px] text-slate-400">Allow programmatic access to the admin API.</p>
                    </div>
                    <button
                      onClick={() => setApiAccess(!apiAccess)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${apiAccess ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"}`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 space-y-4 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold text-slate-900">Change Password</h4>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

           
            {activeTab === "Notification" && (
              <div className="space-y-6">
                <h3 className="text-base font-extrabold text-slate-900 pb-4 border-b border-slate-100">Notification Preferences</h3>

                <div className="space-y-5 divide-y divide-slate-100">
                  {[
                    { title: "Verification Requests", desc: "Get notified when a clinic submits a verification request.", val: notifVerification, set: setNotifVerification },
                    { title: "Security Alerts", desc: "Receive alerts for suspicious activity and unauthorized access.", val: notifSecurity, set: setNotifSecurity },
                    { title: "System Announcements", desc: "Platform maintenance and update notifications.", val: notifSystem, set: setNotifSystem },
                    { title: "Administrative Updates", desc: "Changes to admin accounts, roles, and permissions.", val: notifAdminUpdates, set: setNotifAdminUpdates },
                    { title: "Email Digest", desc: "Weekly summary of platform activity delivered to your inbox.", val: notifEmailDigest, set: setNotifEmailDigest },
                    { title: "SMS Alerts", desc: "Receive critical security alerts via text message.", val: notifSms, set: setNotifSms },
                  ].map((item, idx) => (
                    <div key={item.title} className={`flex items-center justify-between ${idx > 0 ? "pt-4" : "pt-2"}`}>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.set(!item.val)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${item.val ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"}`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

           
            {activeTab === "Language" && (
              <div className="space-y-6">
                <h3 className="text-base font-extrabold text-slate-900 pb-4 border-b border-slate-100">Language Preferences</h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Interface Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Date Format</label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Time Zone</label>
                    <select
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                      <option value="PKT">PKT</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

           
            {activeTab === "Theme" && (
              <div className="space-y-6">
                <h3 className="text-base font-extrabold text-slate-900 pb-4 border-b border-slate-100">Theme Preferences</h3>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700">Color Theme</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { name: "Light", previewBg: "bg-white", accent: "bg-blue-500" },
                      { name: "Blue Dark", previewBg: "bg-slate-900", accent: "bg-blue-500" },
                      { name: "Teal", previewBg: "bg-emerald-50/50", accent: "bg-teal-500" },
                    ].map((theme) => {
                      const isSelected = selectedTheme === theme.name;
                      return (
                        <div
                          key={theme.name}
                          onClick={() => setSelectedTheme(theme.name as any)}
                          className={`rounded-2xl border-2 p-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${
                            isSelected ? "border-blue-600 bg-blue-50/20 shadow-md" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className={`w-full h-16 rounded-xl ${theme.previewBg} border border-slate-200 p-2 flex gap-2`}>
                            <div className={`w-8 h-full rounded-md ${theme.accent}`} />
                            <div className="flex-1 bg-slate-100 rounded-md" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">{theme.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700">Sidebar Width</label>
                  <div className="flex items-center gap-2">
                    {(["Compact", "Default", "Wide"] as const).map((width) => (
                      <button
                        key={width}
                        onClick={() => setSidebarWidth(width)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          sidebarWidth === width
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {width}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

           
            <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}