"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import DashboardCard from "@/components/common/DashboardCard";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import { 
  Search, 
  Filter, 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle 
} from "lucide-react";
import { User } from "@/types/admin.types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Suspended" | "Pending">("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch users from backend on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/users");
        
        // Map and normalize backend statuses to match frontend User interface types
        const formattedUsers = response.data.map((u: any) => {
          let normalizedStatus: "Active" | "Pending" | "Suspended" = "Active";
          if (u.status === "PENDING") normalizedStatus = "Pending";
          else if (u.status === "SUSPENDED" || u.status === "REJECTED") normalizedStatus = "Suspended";
          else if (u.status === "ACTIVE") normalizedStatus = "Active";

          return {
            id: u.id,
            name: u.name || u.email.split("@")[0],
            email: u.email,
            role: u.role,
            registered: new Date(u.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
            lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
            status: normalizedStatus,
            avatarBg: "bg-blue-600",
            initials: (u.email.substring(0, 2)).toUpperCase(),
          };
        });

        setUsers(formattedUsers);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load user list.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleSuspend = async (userId: number | string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    try {
      setActionLoading(String(userId));
      const nextStatusUI = targetUser.status === "Suspended" ? "Active" : "Suspended";
      const nextStatusBackend = nextStatusUI === "Active" ? "ACTIVE" : "SUSPENDED";

      // Call backend API to update user status
      await api.patch(`/admin/users/${userId}/status`, { status: nextStatusBackend });

      // Update local state instantly
      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, status: nextStatusUI };
        }
        return u;
      }));

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, status: nextStatusUI } : null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update user status.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Loading user records...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Users</h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Manage user accounts, profiles, and access controls.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Total Users</span>
          <span className="text-3xl font-extrabold text-blue-600">{users.length}</span>
        </DashboardCard>
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Active</span>
          <span className="text-3xl font-extrabold text-emerald-600">{users.filter(u => u.status === "Active").length}</span>
        </DashboardCard>
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Pending</span>
          <span className="text-3xl font-extrabold text-amber-500">{users.filter(u => u.status === "Pending").length}</span>
        </DashboardCard>
        <DashboardCard>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Suspended</span>
          <span className="text-3xl font-extrabold text-rose-500">{users.filter(u => u.status === "Suspended").length}</span>
        </DashboardCard>
      </div>

      {/* Controls & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
            {(["All", "Active", "Suspended", "Pending"] as const).map((status) => (
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

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${user.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                          {user.initials}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{user.name}</span>
                          <span className="text-[11px] text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700 text-[11px]">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{user.registered}</td>
                    <td className="py-3.5 px-4 text-slate-500">{user.lastLogin}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : user.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {user.status === "Active" && <CheckCircle2 className="w-3 h-3" />}
                        {user.status === "Pending" && <Clock className="w-3 h-3" />}
                        {user.status === "Suspended" && <XCircle className="w-3 h-3" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer inline-block"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer inline-block"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details & Action Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleSuspend={handleToggleSuspend}
      />
    </div>
  );
}