"use client";

import { useState } from 'react';
import AvailableDoctorCard from '@/components/common/AvailableDoctorCard';
import PreviousAppointmentCard from '@/components/common/PreviousAppointmentCard';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'book' | 'previous'>('book');

  const previousAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Pulmonologist',
      date: 'May 20, 2026',
      time: '2:00 PM',
      clinic: 'City Medical Center',
      status: 'Completed',
      notes: 'Discussed breathing exercises and prescribed new inhaler.',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Respiratory Specialist',
      date: 'April 15, 2026',
      time: '10:30 AM',
      clinic: 'Respiratory Care Clinic',
      status: 'Completed',
      notes: 'Follow-up for seasonal allergies. Medication adjusted.',
    },
  ];

  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Pulmonologist',
      nextAvailable: 'June 5, 2026',
    },
    {
      id: 2,
      name: 'Dr. Emily Williams',
      specialty: 'Pulmonologist',
      nextAvailable: 'June 8, 2026',
    },
  ];

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
     
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Appointments</h1>
        <p className="text-gray-500 text-sm">Book new appointments or view your appointment history</p>
      </div>

     
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('book')}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer shadow-xs ${
            activeTab === 'book'
              ? 'bg-[#2F80ED] text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Book Appointment
        </button>
        <button
          onClick={() => setActiveTab('previous')}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'previous'
              ? 'bg-[#2F80ED] text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Previous Appointments
        </button>
      </div>

     
      {activeTab === 'book' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Available Doctors</h2>
            <div className="space-y-3">
              {availableDoctors.map((doctor) => (
                <AvailableDoctorCard
                  key={doctor.id}
                  name={doctor.name}
                  specialty={doctor.specialty}
                  nextAvailable={doctor.nextAvailable}
                  onBook={() => console.log(`Selected ${doctor.name}`)}
                />
              ))}
            </div>
          </div>

         
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5">Select Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5">Select Time</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 shadow-xs">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5">Reason for Visit</label>
                <textarea
                  rows={3}
                  placeholder="Describe your symptoms or reason for consultation..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 shadow-xs resize-none"
                />
              </div>
              <button className="w-full py-3.5 bg-[#2F80ED] hover:bg-[#2668c7] text-white font-medium rounded-xl transition-colors cursor-pointer shadow-xs">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

     
      {activeTab === 'previous' && (
        <div className="space-y-4">
          {previousAppointments.map((appointment) => (
            <PreviousAppointmentCard
              key={appointment.id}
              doctor={appointment.doctor}
              specialty={appointment.specialty}
              date={appointment.date}
              time={appointment.time}
              clinic={appointment.clinic}
              status={appointment.status}
              notes={appointment.notes}
              onChat={() => console.log(`Chat with ${appointment.doctor}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
