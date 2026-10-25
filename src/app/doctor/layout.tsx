// src/app/doctor/layout.tsx
import React from "react";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white font-sans">
      <DoctorSidebar />
      <main className="flex-1 p-8 lg:p-10 bg-white overflow-x-hidden">
        <div className="mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}