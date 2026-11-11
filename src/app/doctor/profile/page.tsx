"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Edit3, Save, X, Shield, Award, Building2, Clock, Loader2, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { profileService } from "@/services/profile.service";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Weekly Consultation Hours Manager Modal Component
function ConsultationHoursModal({
  isOpen,
  onClose,
  currentHoursString,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentHoursString?: string;
  onSave: (formattedHours: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Record<string, { active: boolean; open: string; close: string }>>({
    Monday: { active: true, open: "09:00", close: "17:00" },
    Tuesday: { active: true, open: "09:00", close: "17:00" },
    Wednesday: { active: true, open: "09:00", close: "17:00" },
    Thursday: { active: true, open: "09:00", close: "17:00" },
    Friday: { active: true, open: "09:00", close: "17:00" },
    Saturday: { active: false, open: "09:00", close: "13:00" },
    Sunday: { active: false, open: "09:00", close: "13:00" },
  });

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

                {dayData.active ? (
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
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
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
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

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors cursor-pointer"
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

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    specialty: "",
    qualification: "",
    hospitalAffiliation: "",
    yearsOfExperience: "",
    licenseNumber: "",
    email: "",
    phone: "",
    consultationHours: "",
    totalPatients: 0,
    totalConsultations: 0,
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      
      setFormData({
        fullName: data.name || data.fullName || "",
        specialty: data.specialty || data.specialization || "Pulmonologist",
        qualification: data.qualification || "",
        hospitalAffiliation: data.hospitalAffiliation || "",
        yearsOfExperience: data.yearsOfExperience || "0 years",
        licenseNumber: data.licenseNumber || "",
        email: data.email || "",
        phone: data.phone || "",
        consultationHours: data.consultationHours || "",
        totalPatients: data.totalPatients ?? 0,
        totalConsultations: data.totalConsultations ?? 0,
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await profileService.updateProfile(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const initials = formData.fullName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Profile</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Manage your professional information</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-sm cursor-pointer w-full sm:w-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="h-15 relative" />

        <div className="px-4 sm:px-8 pb-6 sm:pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 -mt-10 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center border-4 border-white shadow-md shrink-0">
              {initials || "DR"}
            </div>
            <div className="mb-1">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">{formData.fullName}</h2>
              <p className="text-xs text-teal-600 font-semibold">{formData.specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-6 sm:gap-x-12">
            <div>
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800">{formData.fullName}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Specialty</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => handleChange("specialty", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800">{formData.specialty}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Qualification</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => handleChange("qualification", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800">{formData.qualification}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Hospital Affiliation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.hospitalAffiliation}
                  onChange={(e) => handleChange("hospitalAffiliation", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800">{formData.hospitalAffiliation}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Years of Experience</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800">{formData.yearsOfExperience}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">License Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange("licenseNumber", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800">{formData.licenseNumber}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800">{formData.phone}</p>
              )}
            </div>

            {/* Consultation Hours Section formatted as a clean list */}
            <div className="sm:col-span-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Consultation Hours (Visible to Patients)
                </label>
                {formData.consultationHours ? (
  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
    {formData.consultationHours.split(";").map((item, idx) => {
      const colonIndex = item.indexOf(":");
      if (colonIndex === -1) return null;
      const day = item.substring(0, colonIndex).trim();
      const timeSlot = item.substring(colonIndex + 1).trim();
      const isClosed = timeSlot.toLowerCase().includes("closed");

      return (
        <li key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-blue-100/60 shadow-2xs">
          <div className="flex items-center gap-2">
            {isClosed ? (
              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
            <span className="text-slate-900 font-bold">{day}:</span>
          </div>
          <span className={isClosed ? "text-rose-500 font-medium italic" : "text-slate-600 font-medium"}>
            {timeSlot}
          </span>
        </li>
      );
    })}
  </ul>
) : (
  <p className="text-xs font-normal text-slate-400 italic">Not specified yet</p>
)}
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 self-start"
              >
                Configure Hours
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">{formData.totalPatients}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Total Patients</p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">{formData.yearsOfExperience}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Experience</p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">{formData.totalConsultations}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Consultations</p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 truncate">{formData.licenseNumber}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">License Number</p>
          </div>
        </DashboardCard>
      </div>

      {/* Embedded Weekly Hours Modal */}
      <ConsultationHoursModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentHoursString={formData.consultationHours}
        onSave={async (newHours) => {
          try {
            setFormData((prev) => ({ ...prev, consultationHours: newHours }));
            await profileService.updateProfile({ ...formData, consultationHours: newHours });
            alert("Consultation hours updated successfully!");
            fetchProfile();
          } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update consultation hours.");
          }
        }}
      />
    </div>
  );
}