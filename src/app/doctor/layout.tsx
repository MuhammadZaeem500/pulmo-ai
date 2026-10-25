import DoctorSidebar from "@/components/doctor/dashboard/DoctorSidebar";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-['Ubuntu',sans-serif]">
      <DoctorSidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}