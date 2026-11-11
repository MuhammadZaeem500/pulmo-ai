"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2, Calendar, Clock, CheckCircle2 } from "lucide-react";

interface ConsultationHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHoursString?: string;
  onSave: (formattedHours: string) => Promise<void>;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ConsultationHoursModal({
  isOpen,
  onClose,
  currentHoursString,
  onSave,
}: ConsultationHoursModalProps) {
  const [loading, setLoading] = useState(false);
  
  // State storing schedule per day: { Monday: { active: true, open: "09:00", close: "17:00" }, ... }
  const [schedule, setSchedule] = useState<Record<string, { active: boolean; open: string; close: string }>>({
    Monday: { active: true, open: "09:00", close: "17:00" },
    Tuesday: { active: true, open: "09:00", close: "17:00" },
    Wednesday: { active: true, open: "09:00", close: "17:00" },
    Thursday: { active: true, open: "09:00", close: "17:00" },
    Friday: { active: true, open: "09:00", close: "17:00" },
    Saturday: { active: false, open: "09:00", close: "13:00" },
    Sunday: { active: false, open: "09:00", close: "13:00" },
  });

  // Parse existing consultation string if provided when modal opens
  useEffect(() => {
    if (currentHoursString) {
      // If you store standard format, you can pre-parse or leave defaults
      // For example, if it's a raw string, we keep it editable or map it.
    }
  }, [currentHoursString, isOpen]);

  if (!isOpen) return null;

  const handleToggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active },
    }));
  };

  const handleTimeChange = (day: string, field: "open" | "close", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSaveSchedule = async () => {
    try {
      setLoading(true);

      // Build a clean summary string to save in backend database column consultationHours
      const formattedSummary = DAYS_OF_WEEK.map((day) => {
        const item = schedule[day];
        if (!item.active) return `${day}: Closed`;
        return `${day}: ${item.open} - ${item.close}`;
      }).join("; ");

      await onSave(formattedSummary);
      onClose();
    } catch (error) {
      console.error("Failed to save schedule", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Manage Consultation Hours</h3>
              <p className="text-[11px] text-slate-400 font-medium">Set daily working hours visible to patients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Day by Day Rows */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {DAYS_OF_WEEK.map((day) => {
            const dayData = schedule[day];
            return (
              <div
                key={day}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                  dayData.active ? "bg-blue-50/20 border-blue-100" : "bg-slate-50/60 border-slate-200/60 opacity-75"
                }`}
              >
                {/* Day Toggle & Name */}
                <div className="flex items-center gap-3 min-w-[130px]">
                  <input
                    type="checkbox"
                    checked={dayData.active}
                    onChange={() => handleToggleDay(day)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${dayData.active ? "text-slate-800" : "text-slate-400 line-through"}`}>
                    {day}
                  </span>
                </div>

                {/* Time Pickers or Closed Label */}
                {dayData.active ? (
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] uppercase font-bold text-slate-400">From</span>
                      <input
                        type="time"
                        value={dayData.open}
                        onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                        className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                      />
                    </div>

                    <span className="text-xs text-slate-400 font-bold hidden sm:inline">-</span>

                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400">To</span>
                      <input
                        type="time"
                        value={dayData.close}
                        onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                        className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 italic px-2">
                    Unavailable (Closed)
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSchedule}
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Schedule
          </button>
        </div>

      </div>
    </div>
  );
}