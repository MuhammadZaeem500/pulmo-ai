import Sidebar from "@/components/paitient /Sidebar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}