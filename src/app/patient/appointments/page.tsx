"use client";

import { useState, useEffect } from 'react';
import AvailableDoctorCard from '@/components/common/AvailableDoctorCard';
import PreviousAppointmentCard from '@/components/common/PreviousAppointmentCard';
import { Loader2 } from 'lucide-react';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'book' | 'previous'>('book');
  
  // State for fetched data
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Form state for booking
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedClinicId, setSelectedClinicId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00:00');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch registered doctors from the backend directory API
  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/patient/directory/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch doctors');
      const result = await response.json();
      setAvailableDoctors(result.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Fetch previous appointments from backend
  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/patient/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch appointments');
      const result = await response.json();
      setAppointments(result.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  // Handle booking submission
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !date) {
      alert('Please select a doctor and a date.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      // Combine date and time into a proper ISO string
      const scheduledAt = new Date(`${date}T${time}`).toISOString();

      const response = await fetch('http://localhost:3000/patient/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          clinicId: selectedClinicId || undefined,
          scheduledAt,
          reason,
        }),
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      alert('Appointment booked successfully!');
      setReason('');
      setDate('');
      setSelectedDoctorId('');
      fetchAppointments();
      setActiveTab('previous');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <form onSubmit={handleBookAppointment} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Select Doctor</h2>
            
            {loadingDoctors ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : availableDoctors.length > 0 ? (
              <div className="space-y-3">
                {availableDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      if (doc.facilityId) setSelectedClinicId(doc.facilityId);
                    }}
                    className={`cursor-pointer transition-all rounded-xl ${selectedDoctorId === doc.id ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <AvailableDoctorCard
                      name={doc.fullName}
                      specialty={doc.specialization}
                      nextAvailable="Available Soon"
                      onBook={() => {
                        setSelectedDoctorId(doc.id);
                        if (doc.facilityId) setSelectedClinicId(doc.facilityId);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No registered doctors available right now.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5">Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5">Select Time</label>
                <select 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 shadow-xs"
                >
                  <option value="09:00:00">9:00 AM</option>
                  <option value="10:00:00">10:00 AM</option>
                  <option value="14:00:00">2:00 PM</option>
                  <option value="15:00:00">3:00 PM</option>
                  <option value="16:00:00">4:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5">Reason for Visit</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your symptoms or reason for consultation..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 shadow-xs resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3.5 bg-[#2F80ED] hover:bg-[#2668c7] text-white font-medium rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>Confirm Booking</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'previous' && (
        <div className="space-y-4">
          {loadingAppointments ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : appointments.length > 0 ? (
            appointments.map((app) => (
              <PreviousAppointmentCard
                key={app.id}
                doctor={app.doctor?.fullName || 'Doctor'}
                specialty={app.doctor?.specialization || 'Specialist'}
                date={new Date(app.scheduledAt).toLocaleDateString()}
                time={new Date(app.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                clinic={app.clinic?.name || 'General Clinic'}
                status={app.status}
                notes={app.reason || 'No notes provided'}
                onChat={() => console.log(`Chat with doctor`)}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
              <p className="text-gray-500 text-sm">No appointment history found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}