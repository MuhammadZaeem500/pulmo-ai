"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import AddClinicModal from "@/components/admin/AddClinicModal";
import AdminModal from "@/components/common/AdminModal";
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
  MoreVertical,
  Loader2,
  Trash2,
  Edit3
} from "lucide-react";
import api from "@/services/api";

export default function AdminClinicsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Verified" | "Pending" | "Suspended">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Edit Facility Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editType, setEditType] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchClinics();
  }, []);

  async function fetchClinics() {
    try {
      setLoading(true);
      const res = await api.get('/admin/clinics');
      const data = res.data?.data || res.data || res;
      if (Array.isArray(data)) {
        setClinics(data.map((c: any) => ({
          id: c.id,
          name: c.name,
          phone: c.phone || 'Not provided',
          address: c.address,
          city: c.city,
          location: `${c.address}, ${c.city}`,
          status: c.isActive ? "Verified" : "Suspended",
          specialists: c._count?.doctors || c.specialists || 0,
          type: c.type || "General Healthcare",
          since: new Date(c.createdAt || Date.now()).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })
        })));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load clinics.");
    } finally {
      setLoading(false);
    }
  }

  const handleAddNewClinic = async (clinicData: {
    name: string;
    location: string;
    phone: string;
    specialists: number;
    type: string;
  }) => {
    try {
      const [address, city = 'Unknown'] = clinicData.location.split(',').map(s => s.trim());

      await api.post('/admin/clinics', {
        name: clinicData.name,
        address,
        city,
        phone: clinicData.phone,
        type: clinicData.type,
      });

      setIsModalOpen(false);
      fetchClinics();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create clinic.");
    }
  };

  const handleToggleStatus = async (clinicId: string, currentStatus: string) => {
    try {
      const newActiveState = currentStatus !== "Verified";
      await api.patch(`/admin/clinics/${clinicId}/status`, { isActive: newActiveState });
      setActiveDropdownId(null);
      fetchClinics();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update clinic status.");
    }
  };

  const handleDeleteClinic = async (clinicId: string) => {
    if (!confirm("Are you sure you want to delete this clinic facility?")) return;
    try {
      await api.delete(`/admin/clinics/${clinicId}`);
      setActiveDropdownId(null);
      fetchClinics();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete clinic.");
    }
  };

  const handleUpdateClinicDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClinic) return;
    try {
      await api.patch(`/admin/clinics/${selectedClinic.id}`, {
        name: editName,
        phone: editPhone,
        address: editAddress,
        city: editCity,
        type: editType,
      });
      setIsEditModalOpen(false);
      setSelectedClinic(null);
      fetchClinics();
    } catch (err: any) {
      alert("Failed to update facility details.");
    }
  };

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          clinic.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || clinic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Clinics & Hospitals</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Manage and verify healthcare facilities on the platform.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Clinic
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
          {error}
        </div>
      )}

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Total Facilities</span>
          <span className="text-3xl font-extrabold text-slate-900">{clinics.length}</span>
        </DashboardCard>
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Verified / Active</span>
          <span className="text-3xl font-extrabold text-emerald-600">{clinics.filter(c => c.status === "Verified").length}</span>
        </DashboardCard>
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Suspended / Inactive</span>
          <span className="text-3xl font-extrabold text-rose-500">{clinics.filter(c => c.status === "Suspended").length}</span>
        </DashboardCard>
      </div>

      {/* SEARCH AND FILTERS */}
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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

        {/* RESPONSIVE TABLE CONTAINER */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[750px]">
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
                    
                    {/* RESPONSIVE DROPDOWN FIX */}
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="inline-block relative" ref={activeDropdownId === clinic.id ? dropdownRef : null}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === clinic.id ? null : clinic.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeDropdownId === clinic.id && (
                          <div className="absolute right-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-left">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(clinic.id, clinic.status);
                              }}
                              className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                            >
                              {clinic.status === "Verified" ? <XCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              {clinic.status === "Verified" ? "Suspend Facility" : "Verify Facility"}
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(null);
                                setSelectedClinic(clinic);
                                setEditName(clinic.name || "");
                                setEditPhone(clinic.phone || "");
                                setEditAddress(clinic.address || "");
                                setEditCity(clinic.city || "");
                                setEditType(clinic.type || "General Healthcare");
                                setIsEditModalOpen(true);
                              }}
                              className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4 text-blue-500" />
                              Edit Facility Details
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClinic(clinic.id);
                              }}
                              className="w-full px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer border-t border-slate-100 mt-1 pt-2.5"
                            >
                              <Trash2 className="w-4 h-4 text-rose-500" />
                              Delete Facility
                            </button>
                          </div>
                        )}
                      </div>
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

      {/* REUSABLE ADMIN MODAL FOR EDITING */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Facility Details"
      >
        <form onSubmit={handleUpdateClinicDetails} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Facility / Clinic Name</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Phone Number</label>
            <input
              type="text"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Street Address</label>
              <input
                type="text"
                required
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">City / State</label>
              <input
                type="text"
                required
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Facility Type</label>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50/50"
            >
              <option value="Pulmonary">Pulmonary</option>
              <option value="General Healthcare">General Healthcare</option>
              <option value="Respiratory">Respiratory</option>
              <option value="Specialized Care">Specialized Care</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}