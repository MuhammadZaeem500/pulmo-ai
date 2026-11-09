"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { AddClinicModalProps } from "@/types/admin.types";

export default function AddClinicModal({ isOpen, onClose, onAddClinic }: AddClinicModalProps) {
  const [newClinic, setNewClinic] = useState({
    name: "",
    location: "",
    phone: "",
    specialists: "",
    type: "Pulmonary",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClinic({
      name: newClinic.name,
      location: newClinic.location,
      phone: newClinic.phone,
      specialists: Number(newClinic.specialists) || 1,
      type: newClinic.type,
    });
    setNewClinic({ name: "", location: "", phone: "", specialists: "", type: "Pulmonary" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-4 sm:p-6 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-base font-extrabold text-slate-900">Add New Clinic</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] mb-1.5 text-slate-700 font-bold uppercase tracking-wider">
              Clinic / Hospital Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Metro Pulmonary Center"
              value={newClinic.name}
              onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1.5 text-slate-700 font-bold uppercase tracking-wider">
              Location (City, State)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Boston, MA"
              value={newClinic.location}
              onChange={(e) => setNewClinic({ ...newClinic, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1.5 text-slate-700 font-bold uppercase tracking-wider">
              Phone Number
            </label>
            <input
              type="text"
              required
              placeholder="+1 (555) 000-0000"
              value={newClinic.phone}
              onChange={(e) => setNewClinic({ ...newClinic, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1.5 text-slate-700 font-bold uppercase tracking-wider">
              Specialist Count
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 10"
              value={newClinic.specialists}
              onChange={(e) => setNewClinic({ ...newClinic, specialists: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1.5 text-slate-700 font-bold uppercase tracking-wider">
              Facility Type
            </label>
            <select
              value={newClinic.type}
              onChange={(e) => setNewClinic({ ...newClinic, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Pulmonary">Pulmonary</option>
              <option value="Respiratory">Respiratory</option>
              <option value="General + Pulmonary">General + Pulmonary</option>
              <option value="Pulmonary + Cardio">Pulmonary + Cardio</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer text-center"
            >
              Add Clinic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}