"use client";

import React, { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Suspended" | "Pending">("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Dr. Emily Watson", email: "e.watson@metro.com", role: "Physician", registered: "Jan 12, 2024", lastLogin: "Today, 9:41 AM", status: "Active", avatarBg: "bg-blue-600", initials: "EW" },
    { id: 2, name: "James Okafor", email: "j.okafor@breathe.io", role: "Patient", registered: "Feb 3, 2024", lastLogin: "Yesterday, 3:15 PM", status: "Active", avatarBg: "bg-teal-600", initials: "JO" },
    { id: 3, name: "Dr. Sarah Lin", email: "s.lin@riverside.com", role: "Specialist", registered: "Nov 28, 2023", lastLogin: "Jun 10, 2026", status: "Active", avatarBg: "bg-purple-600", initials: "SL" },
    { id: 4, name: "Marcus Reid", email: "m.reid@gmail.com", role: "Patient", registered: "Mar 5, 2024", lastLogin: "May 30, 2026", status: "Suspended", avatarBg: "bg-amber-600", initials: "MR" },
    { id: 5, name: "Dr. Priya Nair", email: "p.nair@pacific.org", role: "Physician", registered: "Oct 14, 2023", lastLogin: "Today, 11:05 AM", status: "Active", avatarBg: "bg-rose-600", initials: "PN" },
    { id: 6, name: "Aisha Tremblay", email: "a.tremblay@outlook.com", role: "Patient", registered: "Apr 19, 2024", lastLogin: "Jun 8, 2026", status: "Pending", avatarBg: "bg-teal-500", initials: "AT" },
    { id: 7, name: "Dr. Carlos Mejia", email: "c.mejia@heartland.med", role: "Specialist", registered: "Dec 1, 2023", lastLogin: "Today, 8:30 AM", status: "Active", avatarBg: "bg-emerald-600", initials: "CM" },
    { id: 8, name: "Hannah Park", email: "h.park@yahoo.com", role: "Patient", registered: "May 22, 2024", lastLogin: "Jun 11, 2026", status: "Active", avatarBg: "bg-blue-500", initials: "HP" },
    { id: 9, name: "Robert Tanner", email: "r.tanner@desert.com", role: "Admin", registered: "Jun 5, 2023", lastLogin: "Today, 2:20 PM", status: "Active", avatarBg: "bg-cyan-600", initials: "RT" },
    { id: 10, name: "Fatima Al-Hassan", email: "f.alhassan@nw.org", role: "Physician", registered: "Sep 10, 2023", lastLogin: "Jun 9, 2026", status: "Suspended", avatarBg: "bg-purple-500", initials: "FA" },
  ]);

  const handleToggleSuspend = (userId: number) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === "Suspended" ? "Active" : "Suspended";
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
     
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Users</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Manage user accounts, profiles, and access controls.</p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

     
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleSuspend={handleToggleSuspend}
      />
    </div>
  );
}