"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api"; // Adjust this to your API service path
import { ShieldCheck, UserCheck, XCircle, Stethoscope, Mail } from "lucide-react";

interface DoctorRequest {
  userId: string;
  email: string;
  createdAt: string;
  profile?: {
    fullName: string;
    licenseNumber: string;
    specialization: string;
  };
}

export default function DoctorVerificationPage() {
  const [pendingDoctors, setPendingDoctors] = useState<DoctorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 1. Fetch pending doctors from backend
  useEffect(() => {
    const fetchPendingDoctors = async () => {
      try {
        setLoading(true);
        // Assuming this endpoint exists on your NestJS backend
        const response = await api.get("/auth/admin/pending-doctors");
        setPendingDoctors(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load pending doctor requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDoctors();
  }, []);

  // 2. Handle Approve or Reject actions
  const handleStatusUpdate = async (userId: string, status: "ACTIVE" | "REJECTED") => {
    try {
      setActionLoading(userId);
      // Assuming this endpoint exists on your NestJS backend
      await api.patch(`/auth/admin/doctor-status/${userId}`, { status });
      
      // Remove the handled request from the local state to update the UI immediately
      setPendingDoctors((prev) => prev.filter((doc) => doc.userId !== userId));
      
      // Optional: Show a success toast notification here
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-wider text-blue-600/80 uppercase mb-1">
              — Credential Operations
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
              Doctor Verification Requests
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
              Review professional credentials and approve or reject pending doctor accounts.
              Doctors will only be able to sign in once their account is verified and activated by an administrator.
            </p>
          </div>
          <div className="flex-shrink-0 self-start md:self-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium flex items-center gap-2.5 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            {pendingDoctors.length} Pending Review
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium shadow-inner">
            {error}
          </div>
        )}

        {/* Empty State */}
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
          /* List of Verification Cards */
          <div className="space-y-5">
            {pendingDoctors.map((doc) => (
              <div
                key={doc.userId}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                {/* Doctor Info Left Side */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <h3 className="text-base font-bold text-slate-950">
                        Dr. {doc.profile?.fullName || "N/A"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{doc.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credentials Right Side - Flex layout for alignment */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full md:w-auto">
                  {/* Credentials Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8 text-sm text-slate-700">
                     <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 sm:bg-transparent sm:border-none sm:px-0 sm:py-0">
                      <span className="text-slate-500 text-xs block sm:hidden">Specialization</span>
                      {doc.profile?.specialization || "N/A"}
                    </div>
                    <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 sm:bg-transparent sm:border-none sm:px-0 sm:py-0">
                      <span className="text-slate-500 text-xs block sm:hidden">License / PMDC Number</span>
                      {doc.profile?.licenseNumber || "N/A"}
                    </div>
                    <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 sm:bg-transparent sm:border-none sm:px-0 sm:py-0">
                      <span className="text-slate-500 text-xs block sm:hidden">Submitted Date</span>
                      {new Date(doc.createdAt).toLocaleDateString("en-US", {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-3 sm:pt-0 w-full sm:w-auto justify-end border-t border-slate-100 sm:border-none">
                    <button
                      onClick={() => handleStatusUpdate(doc.userId, "REJECTED")}
                      disabled={actionLoading === doc.userId}
                      className="flex-grow sm:flex-grow-0 text-center py-2.5 px-5 rounded-xl border border-red-200 text-red-700 font-semibold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <XCircle className="w-4 h-4" />
                      {actionLoading === doc.userId ? "..." : "Reject"}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(doc.userId, "ACTIVE")}
                      disabled={actionLoading === doc.userId}
                      className="flex-grow sm:flex-grow-0 text-center py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <UserCheck className="w-4 h-4" />
                      {actionLoading === doc.userId ? "Updating..." : "Verify & Approve"}
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
    </div>
  );
}