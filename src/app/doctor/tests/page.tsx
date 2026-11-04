"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { Search, Plus, TestTube, Loader2, Trash2 } from "lucide-react";
import { testService } from "@/services/test.service";
import AddTestModal from "@/components/common/AddTestModal";

export default function DoctorRecommendedTestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [testRecommendations, setTestRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await testService.getTests(searchQuery);
      setTestRecommendations(data);
    } catch (err) {
      console.error("Failed to load test recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchTests, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this test recommendation?")) {
      try {
        await testService.deleteTest(id);
        setTestRecommendations((prev) => prev.filter((t) => t.id !== id));
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete test.");
      }
    }
  };

  return (
    <div className="space-y-6">
     
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Recommended Tests</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{testRecommendations.length} recommendations issued</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Tests
        </button>
      </div>

     
      <div className="relative max-w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by patient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-slate-50/50"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testRecommendations.map((rec) => (
            <DashboardCard key={rec.id} className="hover:border-blue-200 transition-all">
             
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {rec.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rec.patient}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{rec.date} · {rec.testsCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${rec.statusColor}`}>
                    ● {rec.status}
                  </span>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Test"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

             
              <div className="space-y-3">
                {rec.testsList.map((test: any, testIdx: number) => (
                  <div key={testIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                      <TestTube className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{test.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{test.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          ))}

          {testRecommendations.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500 text-sm">No recommended tests found.</p>
            </div>
          )}
        </div>
      )}

      <AddTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchTests}
      />
    </div>
  );
}