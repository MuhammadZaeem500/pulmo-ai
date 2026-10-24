// src/app/patient/profile/page.tsx
"use client";

import { Mail, Phone, Calendar, User, MapPin, Edit3 } from "lucide-react";
import ProfileField from "@/components/common/ProfileField";
import MetricCard from "@/components/common/MetricCard";
import ProfilePrescriptionItem from "@/components/common/ProfilePrescriptionItem";

export default function ProfilePage() {
  const profileData = {
    name: "John Doe",
    patientId: "PC-2026-001",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dob: "January 15, 1990 (36 years)",
    gender: "Male",
    address: "123 Main St, Downtown, City",
  };

  const recentPrescriptions = [
    { id: 1, medicine: "Albuterol Inhaler", prescribedDate: "May 25, 2026", status: "Active" },
    { id: 2, medicine: "Cetirizine 10mg", prescribedDate: "April 10, 2026", status: "Active" },
  ];

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-gray-500 text-sm">Manage your personal information and medical profile</p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
              <p className="text-xs font-medium text-gray-400 mt-0.5">Patient ID: {profileData.patientId}</p>
            </div>
          </div>

          <button
            onClick={() => console.log("Edit profile clicked")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer w-fit"
          >
            <Edit3 className="w-4 h-4 text-gray-500" />
            Edit Profile
          </button>
        </div>

        {/* Profile Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <ProfileField icon={Mail} label="Email" value={profileData.email} />
          <ProfileField icon={Phone} label="Phone" value={profileData.phone} />
          <ProfileField icon={Calendar} label="Date of Birth" value={profileData.dob} />
          <ProfileField icon={User} label="Gender" value={profileData.gender} />
          <div className="md:col-span-2">
            <ProfileField icon={MapPin} label="Address" value={profileData.address} />
          </div>
        </div>
      </div>

      {/* Medical History Summary Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 px-1">Medical History Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Last Consultation" value="May 25, 2026" valueColor="text-gray-900 text-xl" />
          <MetricCard title="Active Prescriptions" value="2 medications" valueColor="text-gray-900 text-xl" />
          <MetricCard title="Total Appointments" value="12 consultations" valueColor="text-gray-900 text-xl" />
        </div>
      </div>

      {/* Recent Prescriptions Section */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Prescriptions</h3>
        <div className="space-y-3">
          {recentPrescriptions.map((item) => (
            <ProfilePrescriptionItem
              key={item.id}
              medicine={item.medicine}
              prescribedDate={item.prescribedDate}
              status={item.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}