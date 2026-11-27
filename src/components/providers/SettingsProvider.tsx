"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { settingsService } from "@/services/settings.service";

export interface UserPreferences {
  emailNotifications: boolean;
  appointmentReminders: boolean;
  healthTips: boolean;
  language: string;
  timeZone: string;
  darkMode: boolean;
  theme: string;
}

interface SettingsContextValue {
  preferences: UserPreferences | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => Promise<void>;
  updateMultiplePreferences: (
    updates: Partial<UserPreferences>
  ) => Promise<void>;
  loadPreferences: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

// Global subscribers for real-time updates
const subscribers = new Set<() => void>();

export function subscribeToSettingsChanges(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notifySubscribers() {
  subscribers.forEach(callback => callback());
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Load preferences on mount
  useEffect(() => {
    loadPreferencesInternal();
    
    // Set up polling for real-time updates (every 5 seconds)
    const pollInterval = setInterval(() => {
      loadPreferencesInternal();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  const loadPreferencesInternal = async () => {
    setLoading(true);
    setError(null);
    let retries = 3;

    while (retries > 0) {
      try {
        const prefs = await settingsService.getPreferences();
        if (prefs) {
          setPreferences({
            emailNotifications: prefs.emailNotifications ?? true,
            appointmentReminders: prefs.appointmentReminders ?? true,
            healthTips: prefs.healthTips ?? false,
            language: prefs.language ?? "English",
            timeZone: prefs.timeZone ?? "UTC",
            darkMode: Boolean(prefs.darkMode) ?? false,
            theme: prefs.theme ?? "light",
          });
        }
        setError(null);
        break;
      } catch (err: any) {
        retries--;
        console.error(`Failed to load preferences (${retries} retries left):`, err);
        if (retries === 0) {
          setError(err?.message || "Failed to load preferences");
          console.error("Failed to load preferences after 3 attempts", err);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
    setLoading(false);
  };

  const updatePreference = useCallback(
    async <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setSaving(true);
      setError(null);

      try {
        // Optimistic update - force re-render by creating new object reference
        setPreferences((prev) => {
          if (!prev) return null;
          const updated = { ...prev, [key]: value };
          // Force update trigger
          setUpdateTrigger(t => t + 1);
          return updated;
        });

        // Send to backend
        const payload = { [key]: value };
        await settingsService.updatePreferences(payload as any);
        
        // Notify all subscribers (for other components)
        notifySubscribers();
      } catch (err: any) {
        setError(err?.message || "Failed to update preference");
        console.error("Failed to update preference", err);
        // Reload from server on error
        await loadPreferencesInternal();
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const updateMultiplePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      setSaving(true);
      setError(null);

      try {
        // Optimistic update - force re-render
        setPreferences((prev) => {
          if (!prev) return null;
          const updated = { ...prev, ...updates };
          setUpdateTrigger(t => t + 1);
          return updated;
        });

        // Send to backend
        await settingsService.updatePreferences(updates as any);
        
        // Notify all subscribers
        notifySubscribers();
      } catch (err: any) {
        setError(err?.message || "Failed to update preferences");
        console.error("Failed to update preferences", err);
        // Reload from server on error
        await loadPreferencesInternal();
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const loadPreferences = useCallback(async () => {
    await loadPreferencesInternal();
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setSaving(true);
      setError(null);

      try {
        await settingsService.changePassword(currentPassword, newPassword);
      } catch (err: any) {
        setError(err?.message || "Failed to change password");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const deleteAccount = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      await settingsService.deleteAccount();
    } catch (err: any) {
      setError(err?.message || "Failed to delete account");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const refreshPreferences = useCallback(async () => {
    await loadPreferencesInternal();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        loading,
        saving,
        error,
        updatePreference,
        updateMultiplePreferences,
        loadPreferences,
        changePassword,
        deleteAccount,
        refreshPreferences,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
