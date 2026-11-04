"use client";

import React, { useState } from "react";
import DashboardCard from "@/components/common/DashboardCard";
import { 
  FileText, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  FileSpreadsheet, 
  FileCode, 
  Database 
} from "lucide-react";
import { ReportItem, RecentDownload } from "@/types/admin.types";



export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: "healthcare",
      title: "Healthcare Analytics Report",
      description: "Symptom trends, disease patterns, seasonal health data, and user engagement metrics.",
      lastDate: "Jun 12, 2026",
      fileSize: "2.4 MB",
      status: "Ready",
      icon: FileText,
      buttonBg: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20",
      buttonText: "Regenerate"
    },
    {
      id: "user",
      title: "User Activity Report",
      description: "User registrations, login activity, role breakdown, account statuses, and session data.",
      lastDate: "Jun 11, 2026",
      fileSize: "1.8 MB",
      status: "Ready",
      icon: FileText,
      buttonBg: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20",
      buttonText: "Generate"
    },
    {
      id: "clinic",
      title: "Clinic Verification Report",
      description: "Verified, pending, and suspended facilities list with contact info and specialist availability.",
      lastDate: "Jun 10, 2026",
      fileSize: "1.2 MB",
      status: "Ready",
      icon: FileText,
      buttonBg: "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/20",
      buttonText: "Generate"
    },
    {
      id: "security",
      title: "Security Report",
      description: "Alert summary, suspicious activity log, access anomalies, and resolution tracking.",
      lastDate: "Jun 9, 2026",
      fileSize: "980 KB",
      status: "Ready",
      icon: FileText,
      buttonBg: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20",
      buttonText: "Generate"
    },
  ]);

  const recentDownloads: RecentDownload[] = [
    { id: "1", title: "Healthcare Analytics Report — May 2026", date: "Jun 5, 2026", format: "PDF" },
    { id: "2", title: "User Activity Report — Q1 2026", date: "May 28, 2026", format: "CSV" },
    { id: "3", title: "Security Report — May 2026", date: "May 20, 2026", format: "PDF" },
    { id: "4", title: "Clinic Verification Report — Apr 2026", date: "May 1, 2026", format: "XLSX" },
  ];

  const handleAction = (id: string) => {
    alert(`Generating / Regenerating report for: ${id}`);
  };

  const handleDownload = (title: string) => {
    alert(`Downloading: ${title}`);
  };

  return (
    <div className="space-y-6">
     
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Generate, download, and export administrative reports.</p>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <DashboardCard key={report.id} icon={report.icon} iconGradient={true}>
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900">{report.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{report.description}</p>
              
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
        <p className="text-xs text-slate-400 font-medium pb-4">Export raw data in your preferred format for external analysis.</p>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => alert("Exporting as PDF...")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-rose-500" /> Export as PDF
          </button>
          <button 
            onClick={() => alert("Exporting as CSV...")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export as CSV
          </button>
          <button 
            onClick={() => alert("Exporting as XLSX...")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Database className="w-4 h-4 text-blue-600" /> Export as XLSX
          </button>
          <button 
            onClick={() => alert("Exporting as JSON...")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-amber-500" /> Export as JSON
          </button>
        </div>
      </DashboardCard>

     
      <DashboardCard title="Recent Downloads">
        <div className="divide-y divide-slate-100">
          {recentDownloads.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                  item.format === "PDF" ? "bg-rose-50 text-rose-600" :
                  item.format === "CSV" ? "bg-emerald-50 text-emerald-600" :
                  "bg-blue-50 text-blue-600"
                }`}>
                  {item.format}
                </span>
                <button 
                  onClick={() => handleDownload(item.title)}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}