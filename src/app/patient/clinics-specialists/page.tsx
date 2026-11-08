"use client";

import { useState, useEffect } from "react";
import DoctorClinicCard from "@/components/common/DoctorClinicCard";
import { Search, Building2, User, Loader2 } from "lucide-react";

export default function ClinicsSpecialistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"clinics" | "specialists">("clinics");
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from backend when activeTab changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Retrieve JWT token
        
        // Determine endpoint based on active tab
        const endpoint = activeTab === "clinics" 
          ? "http://localhost:3000/patient/directory/clinics" 
          : "http://localhost:3000/patient/directory/doctors";

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch directory data");
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Filter data client-side based on search input
  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    if (activeTab === "clinics") {
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.address?.toLowerCase().includes(searchLower) ||
        item.city?.toLowerCase().includes(searchLower)
      );
    } else {
      return (
        item.fullName?.toLowerCase().includes(searchLower) ||
        item.specialization?.toLowerCase().includes(searchLower)
      );
    }
  });

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Clinics & Specialists</h1>
        <p className="text-gray-500 text-sm">Find nearby clinics and pulmonary specialists</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, location, or specialty..."
          className="w-full bg-white pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-hidden focus:border-blue-500 transition-all shadow-xs"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setActiveTab("clinics"); setSearchQuery(""); }}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer shadow-xs ${
            activeTab === "clinics"
              ? "bg-[#2F80ED] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Nearby Clinics
        </button>
        <button
          onClick={() => { setActiveTab("specialists"); setSearchQuery(""); }}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === "specialists"
              ? "bg-[#2F80ED] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Specialists
        </button>
      </div>

      {/* Results Section */}
      <div className="space-y-4 relative min-h-[200px]">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
            <DoctorClinicCard
              key={item.id}
              icon={activeTab === "clinics" ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
              title={activeTab === "clinics" ? item.name : item.fullName}
              subtitle={activeTab === "clinics" ? `${item.address || "Address unavailable"} • ${item.city || ""}` : item.specialization}
              metaText={activeTab === "clinics" ? "Verified Clinic" : `License: ${item.licenseNumber || "N/A"}`}
              availability={activeTab === "specialists" ? "Available for Booking" : undefined}
              rating="4.8"
              actionText={activeTab === "clinics" ? "View Details & Book" : "Book Appointment"}
              onActionClick={() => console.log(`Action clicked for ${activeTab === "clinics" ? item.name : item.fullName}`)}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
            <p className="text-gray-500 text-sm">No matching {activeTab} found.</p>
          </div>
        )}
      </div>
    </div>
  );
}