"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import {
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Database,
  Loader2,
} from "lucide-react";
import { ReportItem, RecentDownload } from "@/types/admin.types";
import { fetchAdminReportsData } from "@/services/admin.service"; // Point to your existing api file

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
    async function loadReportsData() {
      try {
        setLoading(true);
        const response = await fetchAdminReportsData();
        
        console.log("RAW API RESPONSE:", response); // <- Check your browser console

        // Handle case where axios wraps response in .data or returns it directly
        const data = response.data || response;
        console.log("PARSED DATA OBJECT:", data);

        const reportsList = data.reports || [];
        const downloadsList = data.recentDownloads || [];

        const mappedReports = reportsList.map((report: any, index: number) => {
          const colors = [
            { bg: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20" },
            { bg: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20" },
            { bg: "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/20" },
            { bg: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20" },
          ];
          return {
            ...report,
            lastDate: report.lastGenerated,
            icon: FileText,
            buttonBg: colors[index % colors.length]?.bg || colors[0].bg,
            buttonText: index === 0 ? "Regenerate" : "Generate"
          };
        });

        setReports(mappedReports);
        setRecentDownloads(downloadsList);
      } catch (err: any) {
        console.error("FETCH ERROR:", err); // <- Check browser console for errors
        setError(err.message || "Failed to load reports data.");
      } finally {
        setLoading(false);
      }
    }

    loadReportsData();
  }, []);

  const handleAction = async (id: string) => {
    try {
      alert(`Generating report for: ${id}`);
      // Add API call here if you have a generate endpoint: e.g., await api.post(`/admin/reports/${id}/generate`);
    } catch (err) {
      alert("Failed to generate report.");
    }
  };

  const handleDownload = async (title: string, format = "PDF") => {
    alert(`Downloading: ${title} as ${format}`);
    // Add real file download blob handling here if connected to an export endpoint
  };

  const handleExport = async (format: string) => {
    alert(`Exporting raw data as ${format}...`);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl text-sm font-medium">
        Error loading reports: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
          Generate, download, and export administrative reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <DashboardCard key={report.id} icon={report.icon} iconGradient={true}>
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {report.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {report.description}
              </p>

              <div className="flex items-center gap-4 pt-1 text-[11px] font-semibold text-slate-400">
                <span>Last: {report.lastDate}</span>
                <span>•</span>
                <span>{report.fileSize}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {report.status}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <button
                  onClick={() => handleAction(report.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${report.buttonBg}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> {report.buttonText}
                </button>
                <button
                  onClick={() => handleDownload(report.title)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard title="Export Data">
        <p className="text-xs text-slate-400 font-medium pb-4">
          Export raw data in your preferred format for external analysis.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleExport("PDF")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-rose-500" /> Export as PDF
          </button>
          <button
            onClick={() => handleExport("CSV")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export as
            CSV
          </button>
          <button
            onClick={() => handleExport("XLSX")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Database className="w-4 h-4 text-blue-600" /> Export as XLSX
          </button>
          <button
            onClick={() => handleExport("JSON")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-amber-500" /> Export as JSON
          </button>
        </div>
      </DashboardCard>

      <DashboardCard title="Recent Downloads">
        <div className="divide-y divide-slate-100">
          {recentDownloads.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">
              No recent downloads found.
            </p>
          ) : (
            recentDownloads.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      item.format === "PDF"
                        ? "bg-rose-50 text-rose-600"
                        : item.format === "CSV"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {item.format}
                  </span>
                  <button
                    onClick={() => handleDownload(item.title, item.format)}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
