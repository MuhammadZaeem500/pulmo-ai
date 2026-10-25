"use client";

import { useState } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Edit3, Save, X, Shield, Award, Building2, Clock } from "lucide-react";

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Dr. Sarah Mitchell",
    specialty: "Pulmonologist",
    qualification: "MD, FCCP, DABSM",
    hospitalAffiliation: "City Medical Center",
    yearsOfExperience: "12 years",
    licenseNumber: "MC-2014-089342",
    email: "sarah.mitchell@citymedical.com",
    phone: "+1 (555) 234-5678",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header & Edit/Save Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Profile</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Manage your professional information</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors shadow-sm"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
              Cancel
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                alert("Profile updated successfully!");
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-15 bg-gradient-to-r  relative" />

        {/* Profile Content Section */}
        <div className="px-8 pb-8 relative">
          {/* Avatar & Title Overlapping Banner */}
          <div className="flex items-end gap-4 -mt-10 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center border-4 border-white shadow-md">
              SM
            </div>
            <div className="mb-1">
              <h2 className="text-lg font-extrabold text-slate-900">Dr. Sarah Mitchell</h2>
              <p className="text-xs text-teal-600 font-semibold">Pulmonologist</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              ) : (
                <p className="text-xs font-bold text-slate-800">{formData.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metric Cards using Reusable DashboardCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">47</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Total Patients</p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">12 yrs</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Experience</p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">1,240+</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Consultations</p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">12</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Years Licensed</p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}