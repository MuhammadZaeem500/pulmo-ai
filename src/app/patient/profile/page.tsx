"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, User, MapPin, Edit3, Loader2, Save, X, Droplets } from "lucide-react";
import ProfileField from "@/components/common/ProfileField";
import MetricCard from "@/components/common/MetricCard";
import ProfilePrescriptionItem from "@/components/common/ProfilePrescriptionItem";
import { patientProfileService } from "@/services/profile.service";

function EditProfileModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    fullName:    initial.fullName    ?? "",
    phoneNumber: initial.phoneNumber ?? "",
    gender:      initial.gender      ?? "",
    address:     initial.address     ?? "",
    dateOfBirth: initial.dateOfBirth ? initial.dateOfBirth.split("T")[0] : "",
    bloodGroup:  initial.bloodGroup  ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await patientProfileService.updateProfile(form);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div key={key}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field("Full Name",    "fullName")}
          {field("Phone Number", "phoneNumber")}
          {field("Date of Birth","dateOfBirth", "date")}

          {/* Gender select */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Blood group select */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Blood Group
            </label>
            <select
              value={form.bloodGroup}
              onChange={(e) => setForm((p) => ({ ...p, bloodGroup: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select blood group</option>
              {["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"].map((bg) => (
                <option key={bg} value={bg}>{bg.replace("_", " ").replace("POS", "+").replace("NEG", "-")}</option>
              ))}
            </select>
          </div>

          {field("Address", "address")}

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
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDob = (dob: string | null): string => {
  if (!dob) return "—";
  const d = new Date(dob);
  const age = new Date().getFullYear() - d.getFullYear();
  return `${d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} (${age} years)`;
};

const formatBloodGroup = (bg: string | null): string => {
  if (!bg) return "—";
  return bg.replace("_", " ").replace("POS", "+").replace("NEG", "-");
};

const formatGender = (g: string | null): string => {
  if (!g) return "—";
  return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
};

export default function ProfilePage() {
  const [loading,       setLoading]       = useState(true);
  const [showEdit,      setShowEdit]      = useState(false);
  const [profile,       setProfile]       = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [summary,       setSummary]       = useState<any>({});

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await patientProfileService.getProfile();
      setProfile(data);
      setPrescriptions(data.recentPrescriptions || []);
      setSummary(data.summary || {});
    } catch (err) {
      console.error("Failed to load patient profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const p = profile?.patientProfile;
  const name       = p?.fullName    || profile?.email || "Patient";
  const email      = profile?.email || "—";
  const phone      = p?.phone       || "—";
  const gender     = formatGender(p?.gender);
  const dob        = formatDob(p?.dateOfBirth);
  const address    = p?.address     || "—";
  const bloodGroup = formatBloodGroup(p?.bloodGroup);
  const initials   = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  const lastConsultation  = summary.lastConsultation
    ? new Date(summary.lastConsultation).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "No visits yet";
  const activePrescCount  = summary.activePrescriptionsCount ?? 0;
  const totalAppointments = summary.totalAppointments ?? 0;

  const editInitial = {
    fullName:    p?.fullName    ?? "",
    phoneNumber: p?.phone       ?? "",
    gender:      p?.gender      ?? "",
    address:     p?.address     ?? "",
    dateOfBirth: p?.dateOfBirth ?? "",
    bloodGroup:  p?.bloodGroup  ?? "",
  };

  return (
    <>
      {showEdit && (
        <EditProfileModal
          initial={editInitial}
          onClose={() => setShowEdit(false)}
          onSaved={fetchProfile}
        />
      )}

      <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Profile</h1>
          <p className="text-gray-500 text-sm">Manage your personal information and medical profile</p>
        </div>

        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xl">
                {initials || <User className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                <p className="text-xs font-medium text-gray-400 mt-0.5">
                  {bloodGroup !== "—" ? `Blood Group: ${bloodGroup}` : "Patient"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer w-fit"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <ProfileField icon={Mail}     label="Email"         value={email}      />
            <ProfileField icon={Phone}    label="Phone"         value={phone}      />
            <ProfileField icon={Calendar} label="Date of Birth" value={dob}        />
            <ProfileField icon={User}     label="Gender"        value={gender}     />
            <ProfileField icon={Droplets} label="Blood Group"   value={bloodGroup} />
            <div className="md:col-span-2">
              <ProfileField icon={MapPin}  label="Address"       value={address}    />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 px-1">Medical History Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Last Consultation"
              value={lastConsultation}
              valueColor="text-gray-900 text-xl"
            />
            <MetricCard
              title="Active Prescriptions"
              value={`${activePrescCount} medication${activePrescCount !== 1 ? "s" : ""}`}
              valueColor="text-gray-900 text-xl"
            />
            <MetricCard
              title="Total Appointments"
              value={`${totalAppointments} consultation${totalAppointments !== 1 ? "s" : ""}`}
              valueColor="text-gray-900 text-xl"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Prescriptions</h3>
          {prescriptions.length > 0 ? (
            <div className="space-y-3">
              {prescriptions.map((item: any) => (
                <ProfilePrescriptionItem
                  key={item.id}
                  medicine={item.medicationName || "Medication"}
                  prescribedDate={new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                  status={item.status || "Active"}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No recent prescriptions found.</p>
          )}
        </div>
      </div>
    </>
  );
}