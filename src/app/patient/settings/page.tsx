// src/app/patient/settings/page.tsx
"use client";

import { useState } from "react";
import { User, Bell, Globe, Moon } from "lucide-react";
import SettingSectionCard from "@/components/common/SettingSectionCard";
import SettingToggleItem from "@/components/common/SettingToggleItem";

export default function SettingsPage() {
  // Notification States
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [healthTips, setHealthTips] = useState(false);

  // Theme State
  const [darkMode, setDarkMode] = useState(false);

  // Region States
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("EST (UTC-5)");

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your account preferences and privacy settings</p>
      </div>

      <div className="space-y-6">
        {/* Account Settings Section */}
        <SettingSectionCard icon={User} title="Account Settings">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Change Password</h3>
              <p className="text-xs text-gray-500 mt-0.5">Update your password regularly for security</p>
            </div>
            <button
              onClick={() => console.log("Change password clicked")}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer"
            >
              Change
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Email Address</h3>
              <p className="text-xs text-gray-500 mt-0.5">john.doe@example.com</p>
            </div>
            <button
              onClick={() => console.log("Update email clicked")}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer"
            >
              Update
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Delete Account</h3>
              <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and data</p>
            </div>
            <button
              onClick={() => console.log("Delete account clicked")}
              className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 font-medium text-sm hover:bg-rose-50 transition-all cursor-pointer"
            >
              Delete
            </button>
          </div>
        </SettingSectionCard>

        {/* Notification Preferences Section */}
        <SettingSectionCard icon={Bell} title="Notification Preferences">
          <SettingToggleItem
            title="Email Notifications"
            description="Receive updates via email"
            enabled={emailNotifs}
            onToggle={() => setEmailNotifs(!emailNotifs)}
          />
          <div className="pt-4 border-t border-gray-100">
            <SettingToggleItem
              title="Appointment Reminders"
              description="Get reminded about upcoming appointments"
              enabled={appointmentReminders}
              onToggle={() => setAppointmentReminders(!appointmentReminders)}
            />
          </div>
          <div className="pt-4 border-t border-gray-100">
            <SettingToggleItem
              title="Health Tips"
              description="Receive personalized health recommendations"
              enabled={healthTips}
              onToggle={() => setHealthTips(!healthTips)}
            />
          </div>
        </SettingSectionCard>

        {/* Language & Region Section */}
        <SettingSectionCard icon={Globe} title="Language & Region">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Language</h3>
              <p className="text-xs text-gray-500 mt-0.5">Choose your preferred language</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
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
              onChange={(e) => setTimeZone(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs"
            >
              <option value="EST (UTC-5)">EST (UTC-5)</option>
              <option value="PST (UTC-8)">PST (UTC-8)</option>
              <option value="CST (UTC-6)">CST (UTC-6)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </SettingSectionCard>

        {/* Theme Preferences Section */}
        <SettingSectionCard icon={Moon} title="Theme Preferences">
          <SettingToggleItem
            title="Dark Mode"
            description="Switch to dark theme"
            enabled={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
        </SettingSectionCard>
      </div>
    </div>
  );
}
