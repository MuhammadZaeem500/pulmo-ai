"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { ShieldCheck, UserCheck, XCircle, Stethoscope, Mail } from "lucide-react";
import DoctorRequest from "@/types/admin.types";

export default function DoctorVerificationPage() {
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/doctors");
        
        // Filter pending doctor requests
        const pending = response.data.filter(
          (doc: any) => doc.verificationStatus === "PENDING"
        );
        setPendingDoctors(pending);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load pending doctor requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleStatusUpdate = async (doctorId: string, status: "APPROVED" | "REJECTED") => {
    try {
      setActionLoading(doctorId);

      await api.patch(`/admin/doctors/${doctorId}/verify`, { status });
      
      // Remove processed doctor from the list
      setPendingDoctors((prev) => prev.filter((doc) => doc.id !== doctorId));
      
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update doctor status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Loading verification requests...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-blue-600/80 uppercase mb-1">
            — Credential Operations
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Doctor Verification Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 max-w-2xl">
            Review professional credentials and approve or reject pending doctor accounts.
            Doctors will only be able to sign in once their account is verified and activated by an administrator.
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          {pendingDoctors.length} Pending Review
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium shadow-inner">
          {error}
        </div>
      )}

      {pendingDoctors.length === 0 && !error ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-lg flex flex-col items-center justify-center">
          <Stethoscope className="w-16 h-16 text-slate-300 mb-6" />
          <h3 className="text-xl font-bold text-slate-800">No pending requests</h3>
          <p className="text-slate-500 mt-2 max-w-md">
            Great job! All submitted doctor accounts have been reviewed and processed.
            New registrations will appear here for verification.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {pendingDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-950">
                      Dr. {doc.fullName || "N/A"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{doc.user?.email || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full md:w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8 text-sm text-slate-700">
                  <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 sm:bg-transparent sm:border-none sm:px-0 sm:py-0">
                    <span className="text-slate-500 text-xs block sm:hidden">Specialization</span>
                    {doc.specialization || "N/A"}
                  </div>
                  <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 sm:bg-transparent sm:border-none sm:px-0 sm:py-0">
                    <span className="text-slate-500 text-xs block sm:hidden">License / PMDC Number</span>
                    {doc.licenseNumber || "N/A"}
                  </div>
                  <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 sm:bg-transparent sm:border-none sm:px-0 sm:py-0">
                    <span className="text-slate-500 text-xs block sm:hidden">Submitted Date</span>
                    {new Date(doc.createdAt).toLocaleDateString("en-US", {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 sm:pt-0 w-full sm:w-auto justify-end border-t border-slate-100 sm:border-none">
                  <button
                    onClick={() => handleStatusUpdate(doc.id, "REJECTED")}
                    disabled={actionLoading === doc.id}
                    className="grow sm:grow-0 text-center py-2.5 px-5 rounded-xl border border-red-200 text-red-700 font-semibold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <XCircle className="w-4 h-4" />
                    {actionLoading === doc.id ? "..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(doc.id, "APPROVED")}
                    disabled={actionLoading === doc.id}
                    className="grow sm:grow-0 text-center py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <UserCheck className="w-4 h-4" />
                    {actionLoading === doc.id ? "Updating..." : "Verify & Approve"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-400 text-right pt-4">
            Requests are ordered by submission date, newest first.
          </p>
        </div>
      )}
    </div>
  );
}