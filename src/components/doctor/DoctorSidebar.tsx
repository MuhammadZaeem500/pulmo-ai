"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Pill, 
  TestTube, 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Stethoscope,
  X
} from "lucide-react";
import { doctorPortalService } from "@/services/doctor.service";
import DoctorSidebarProps from "@/types/doctor.types";


export default function DoctorSidebar({ mobileOpen, setMobileOpen }: DoctorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [doctor, setDoctor] = useState({
    name: "Dr. Doctor",
    initials: "DR",
    specialty: "Pulmonologist",
  });
  const [loading, setLoading] = useState(true);

  const fetchDoctorProfile = () => {
    doctorPortalService.getProfile()
      .then((data) => {
        if (data) {
          setDoctor({
            name: data.fullName || data.name,
            initials: data.initials,
            specialty: data.specialty,
          });
        }
      })
      .catch((err) => console.error("Failed to load doctor profile", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctorProfile();

    const handleProfileUpdate = () => {
      fetchDoctorProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/sign-in");
  };

  const navItems = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "Patients", href: "/doctor/patients", icon: Users },
    { name: "Consultation Notes", href: "/doctor/notes", icon: FileText },
    { name: "Prescriptions", href: "/doctor/prescriptions", icon: Pill },
    { name: "Recommended Tests", href: "/doctor/tests", icon: TestTube },
    { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
  ];

  const bottomNavItems = [
    { name: "Profile", href: "/doctor/profile", icon: User },
    { name: "Settings", href: "/doctor/settings", icon: Settings },
  ];

  return (
    <>
     
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

     
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 select-none shrink-0 transition-transform duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div>
         
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">PulmoAI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Doctor Portal</span>
              </div>
            </div>
           
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

         
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {loading ? "..." : doctor.initials}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-800 truncate">
                {loading ? "Loading..." : doctor.name}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {loading ? "..." : doctor.specialty}
              </p>
            </div>
          </div>

         
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

       
        <div className="space-y-1 pt-4 border-t border-slate-200/60">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                {item.name}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}