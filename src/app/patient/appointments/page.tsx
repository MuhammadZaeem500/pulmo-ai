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
  const [time, setTime] = useState('09:00');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Minimum date for date picker (today)
  const todayString = new Date().toISOString().split('T')[0];

  // Computed selected day of the week safely parsed
  const selectedDayOfWeek = date && !isNaN(new Date(date + 'T00:00:00').getTime())
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }) 
    : '';

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
      
      console.log('🩺 Fetched Doctors Directory Response:', result);
      console.log('🩺 Doctor Profiles Array:', result.data);

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

  // Robust lookup supporting id, userId, or nested user records
  const selectedDoctor = availableDoctors.find(d => 
    d.id === selectedDoctorId || 
    d.userId === selectedDoctorId || 
    d.user?.id === selectedDoctorId
  );

  useEffect(() => {
    if (selectedDoctorId) {
      console.log('🎯 Currently Selected Doctor ID:', selectedDoctorId);
      console.log('🎯 Resolved Selected Doctor Object:', selectedDoctor);
      console.log('⏰ Doctor Consultation Hours:', selectedDoctor?.consultationHours);
    }
  }, [selectedDoctorId, selectedDoctor]);

  // Validate if selected time falls within doctor's consultation hours
  const validateConsultationHours = () => {
    if (!selectedDoctor?.consultationHours || !date || !time) return true;

    const dayOfWeek = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    const entries = selectedDoctor.consultationHours.split(';');
    const dayEntry = entries.find((e: string) => e.trim().startsWith(dayOfWeek));

    if (!dayEntry) return true;

    if (dayEntry.toLowerCase().includes('closed')) {
      alert(`The doctor is closed on ${dayOfWeek}. Please choose another date.`);
      return false;
    }

    const colonIndex = dayEntry.indexOf(':');
    const timeRange = dayEntry.substring(colonIndex + 1).trim();
    const [openTime, closeTime] = timeRange.split('-').map((t: string) => t?.trim());

    if (openTime && closeTime) {
      if (time < openTime || time > closeTime) {
        alert(`Selected time (${time}) is outside the doctor's working hours for ${dayOfWeek} (${openTime} - ${closeTime}).`);
        return false;
      }
    }

    return true;
  };

  // Handle booking submission with strict validation
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctorId) {
      alert('Please select a doctor from the list.');
      return;
    }
    if (!date) {
      alert('Please select an appointment date.');
      return;
    }
    if (!time) {
      alert('Please select an appointment time.');
      return;
    }
    if (!reason.trim()) {
      alert('Please provide a reason or symptoms for your visit.');
      return;
    }

    // Validate consultation hours before making API request
    if (!validateConsultationHours()) {
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      const formattedTime = time.length === 5 ? `${time}:00` : time;
      const scheduledAt = new Date(`${date}T${formattedTime}`).toISOString();

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
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Appointments
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Book new appointments or view your appointment history
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-xs text-center ${
            activeTab === 'book'
              ? 'bg-[#2F80ED] text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Book Appointment
        </button>
        <button
          onClick={() => setActiveTab('previous')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer text-center ${
            activeTab === 'previous'
              ? 'bg-[#2F80ED] text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Previous Appointments
        </button>
      </div>

      {activeTab === 'book' && (
        <form onSubmit={handleBookAppointment} className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Select Doctor</h2>
            
            {loadingDoctors ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : availableDoctors.length > 0 ? (
              <div className="space-y-3">
                {availableDoctors.map((doc) => {
                  const docId = doc.id || doc.userId || doc.user?.id;
                  const isSelected = selectedDoctorId === docId;
                  return (
                    <div
                      key={docId}
                      onClick={() => {
                        setSelectedDoctorId(docId);
                        if (doc.facilityId) setSelectedClinicId(doc.facilityId);
                      }}
                      className={`cursor-pointer transition-all rounded-xl ${isSelected ? 'ring-2 ring-blue-500 shadow-md bg-blue-50/20' : ''}`}
                    >
                      <AvailableDoctorCard
                        name={doc.fullName}
                        specialty={doc.specialization}
                        nextAvailable={doc.consultationHours || "Consultation hours not specified"}
                        onBook={() => {
                          setSelectedDoctorId(docId);
                          if (doc.facilityId) setSelectedClinicId(doc.facilityId);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No registered doctors available right now.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Booking Details</h2>
            <div className="space-y-4">
              
              {/* Date Selection with Sanity Check & Automatic Day Display */}
              <div>
                <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
                  <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase">Select Date</label>
                  {selectedDayOfWeek && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                      📅 Selected Day: {selectedDayOfWeek}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  min={todayString}
                  max="2100-12-31"
                  value={date}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      const yearPart = val.split('-')[0];
                      if (yearPart && yearPart.length > 4) return;
                    }
                    setDate(val);
                  }}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 shadow-xs text-slate-700"
                />
              </div>
              
              {/* Time Selection with Structured Doctor Availability List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase">Select Time</label>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 flex items-center gap-1.5">
                    🕒 Doctor Schedule Overview
                  </span>
                </div>

                {/* Structured List of Weekly Availability */}
                {selectedDoctor?.consultationHours ? (
                  <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Weekly Consultation Hours</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedDoctor.consultationHours.split(";").map((item: string, idx: number) => {
                        const colonIndex = item.indexOf(":");
                        if (colonIndex === -1) return null;
                        const day = item.substring(0, colonIndex).trim();
                        const timeSlot = item.substring(colonIndex + 1).trim();
                        const isClosed = timeSlot.toLowerCase().includes("closed");
                        
                        return (
                          <li key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-2xs">
                            <span className="text-slate-900 font-bold">{day}</span>
                            <span className={isClosed ? "text-rose-500 font-medium italic" : "text-emerald-600 font-medium"}>
                              {timeSlot}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl text-xs font-medium text-amber-600">
                    {selectedDoctorId ? '⚠️ Consultation hours not specified by this doctor yet.' : '👆 Please select a doctor above to view their consultation schedule.'}
                  </div>
                )}

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 shadow-xs text-slate-700 mt-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5">Reason for Visit</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your symptoms or reason for consultation..."
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20 shadow-xs resize-none text-slate-700"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 sm:py-3.5 bg-[#2F80ED] hover:bg-[#2668c7] text-white font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />}
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