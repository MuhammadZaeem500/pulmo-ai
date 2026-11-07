"use client";

import React, { useState } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Clinic } from "@/types/admin.types";
import AddClinicModal from "@/components/admin/AddClinicModal";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MoreVertical 
} from "lucide-react";



export default function AdminClinicsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Verified" | "Pending" | "Suspended">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [clinics, setClinics] = useState<Clinic[]>([
    { id: 1, name: "Riverside Pulmonary Center", phone: "+1 (916) 555-0142", location: "Sacramento, CA", status: "Verified", specialists: 8, type: "Pulmonary", since: "Mar 2023" },
    { id: 2, name: "Metro General Hospital", phone: "+1 (212) 555-0198", location: "New York, NY", status: "Verified", specialists: 24, type: "General + Pulmonary", since: "Jan 2022" },
    { id: 3, name: "Breathe Well Clinic", phone: "+1 (512) 555-0167", location: "Austin, TX", status: "Pending", specialists: 4, type: "Pulmonary", since: "May 2024" },
    { id: 4, name: "Pacific Lung Associates", phone: "+1 (206) 555-0123", location: "Seattle, WA", status: "Verified", specialists: 12, type: "Pulmonary", since: "Nov 2022" },
    { id: 5, name: "Sunrise Medical Center", phone: "+1 (305) 555-0189", location: "Miami, FL", status: "Pending", specialists: 6, type: "Respiratory", since: "Jun 2024" },
    { id: 6, name: "NorthWest Health Hub", phone: "+1 (503) 555-0145", location: "Portland, OR", status: "Suspended", specialists: 3, type: "Pulmonary", since: "Aug 2023" },
    { id: 7, name: "Heartland Respiratory Institute", phone: "+1 (312) 555-0177", location: "Chicago, IL", status: "Verified", specialists: 18, type: "Pulmonary + Cardio", since: "Feb 2023" },
    { id: 8, name: "Desert Lung Specialists", phone: "+1 (602) 555-0134", location: "Phoenix, AZ", status: "Verified", specialists: 9, type: "Pulmonary", since: "Sep 2022" },
  ]);

  const handleAddNewClinic = (clinicData: {
    name: string;
    location: string;
    phone: string;
    specialists: number;
    type: string;
  }) => {
    const clinicEntry: Clinic = {
      id: clinics.length + 1,
      ...clinicData,
      status: "Pending",
      since: "Just now",
    };
    setClinics([clinicEntry, ...clinics]);
    setIsModalOpen(false);
    alert("New clinic submitted for review!");
  };

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          clinic.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || clinic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 relative">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinics & Hospitals</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Manage and verify healthcare facilities on the platform.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Clinic
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Total Facilities</span>
          <span className="text-3xl font-extrabold text-slate-900">{clinics.length}</span>
        </DashboardCard>
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Verified</span>
          <span className="text-3xl font-extrabold text-emerald-600">{clinics.filter(c => c.status === "Verified").length}</span>
        </DashboardCard>
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Pending Review</span>
          <span className="text-3xl font-extrabold text-amber-500">{clinics.filter(c => c.status === "Pending").length}</span>
        </DashboardCard>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search clinics or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
            {(["All", "Verified", "Pending", "Suspended"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-3 px-4">Facility</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Specialists</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Since</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredClinics.length > 0 ? (
                filteredClinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{clinic.name}</span>
                          <span className="text-[11px] text-slate-400">{clinic.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {clinic.location}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          clinic.status === "Verified"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : clinic.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {clinic.status === "Verified" && <CheckCircle2 className="w-3 h-3" />}
                        {clinic.status === "Pending" && <Clock className="w-3 h-3" />}
                        {clinic.status === "Suspended" && <XCircle className="w-3 h-3" />}
                        {clinic.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                        {clinic.specialists}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{clinic.type}</td>
                    <td className="py-3.5 px-4 text-slate-500">{clinic.since}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No clinics or hospitals found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddClinicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddClinic={handleAddNewClinic}
      />
    </div>
  );
}