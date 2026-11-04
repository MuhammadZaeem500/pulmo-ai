"use client";

import PrescriptionCard from "@/components/common/PrescriptionCard";

export default function PrescriptionsPage() {
  const prescriptions = [
    {
      id: 1,
      medicine: 'Albuterol Inhaler',
      doctor: 'Dr. Sarah Johnson',
      date: 'May 25, 2026',
      dosage: '2 puffs every 4-6 hours as needed',
      duration: '30 days',
    },
    {
      id: 2,
      medicine: 'Amoxicillin 500mg',
      doctor: 'Dr. Michael Chen',
      date: 'May 15, 2026',
      dosage: '1 capsule three times daily',
      duration: '7 days',
    },
    {
      id: 3,
      medicine: 'Cetirizine 10mg',
      doctor: 'Dr. Emily Williams',
      date: 'April 10, 2026',
      dosage: '1 tablet once daily',
      duration: 'Ongoing',
    },
  ];

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
     
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Prescriptions</h1>
        <p className="text-gray-500 text-sm">View and manage all your prescriptions</p>
      </div>

     
      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <PrescriptionCard
            key={prescription.id}
            medicine={prescription.medicine}
            doctor={prescription.doctor}
            date={prescription.date}
            dosage={prescription.dosage}
            duration={prescription.duration}
            onDownload={() => console.log(`Download prescription ${prescription.id}`)}
            onViewFull={() => console.log(`View full prescription ${prescription.id}`)}
          />
        ))}
      </div>
    </div>
  );
}