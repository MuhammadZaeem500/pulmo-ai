"use client";

import { useState, useEffect } from "react";
import { Search, ChevronRight, FileText, Plus, Loader2, Edit2 } from "lucide-react";
import { consultationService } from "@/services/consultation.service";
import AddConsultationNoteModal from "@/components/common/AddConsultationNoteModal";

export default function ConsultationNotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await consultationService.getNotes(searchQuery);
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleOpenCreateModal = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: any) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleNoteSaved = () => {
    fetchNotes();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Consultation Notes</h1>
          <p className="text-xs text-slate-400 mt-0.5">{notes.length} total notes</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search notes by patient or diagnosis..."
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
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:border-blue-200 transition-all flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-slate-900">{note.patientName}</h3>
                    <span className="text-xs text-slate-400 font-medium">{note.date}</span>
                  </div>
                  <p className="text-xs font-bold text-blue-600 mt-1">{note.diagnosis} — {note.status}</p>
                  <p className="text-xs text-slate-500 mt-1">{note.notes}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenEditModal(note)}
                  className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500 text-sm">No consultation notes found.</p>
            </div>
          )}
        </div>
      )}

      <AddConsultationNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleNoteSaved}
        noteToEdit={selectedNote}
      />
    </div>
  );
}