"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Paperclip,
  Send,
  History,
  X,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Check,
  MoreVertical,
  Sparkles,
} from "lucide-react";

type Slot = {
  date: string;
  time: string;
  iso: string;
};

type Doctor = {
  id: string;
  fullName: string;
  specialization: string;
  hospitalAffiliation?: string;
  availableSlots?: Slot[];
};

type Message = {
  role: "user" | "assistant";
  content: string;
  specialization?: string;
  doctors?: Doctor[];
};

type ChatSessionItem = {
  id: string;
  title: string;
  updatedAt: string;
};

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSessionItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Rename & Delete state management
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [selectedSlots, setSelectedSlots] = useState<{
    [doctorId: string]: string;
  }>({});
  const [bookingStatus, setBookingStatus] = useState<{
    [doctorId: string]: string;
  }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const fetchChatSessions = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(
        "http://localhost:3000/patient/chatbot/sessions",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setChatHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setShowHistory(false);
    setIsLoading(true);
    setOpenMenuId(null);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(
        `http://localhost:3000/patient/chatbot/sessions/${sessionId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load session messages", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setShowHistory(false);
  };

  // --- RENAME CHAT API HANDLER ---
  const handleRenameChat = async (sessionId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(
        `http://localhost:3000/patient/chatbot/sessions/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTitle.trim() }),
        },
      );

      if (res.ok) {
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === sessionId ? { ...chat, title: newTitle.trim() } : chat
          )
        );
        setEditingSessionId(null);
        setNewTitle("");
        setOpenMenuId(null);
      }
    } catch (err) {
      console.error("Failed to rename chat session", err);
    }
  };

  // --- DELETE CHAT API HANDLER ---
  const handleDeleteChat = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(
        `http://localhost:3000/patient/chatbot/sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        setChatHistory((prev) => prev.filter((chat) => chat.id !== sessionId));
        if (activeSessionId === sessionId) {
          handleNewChat();
        }
        setOpenMenuId(null);
      }
    } catch (err) {
      console.error("Failed to delete chat session", err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        "http://localhost:3000/patient/chatbot/analyze-and-recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            symptomText: userMessage,
            sessionId: activeSessionId,
          }),
        },
      );

      const textResponse = await response.text();
      const data = textResponse ? JSON.parse(textResponse) : {};

      if (!response.ok) {
        throw new Error(data.message || "AI request failed");
      }

      if (data.sessionId && activeSessionId !== data.sessionId) {
        setActiveSessionId(data.sessionId);
        fetchChatSessions();
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          specialization: data.specialization,
          doctors: data.doctors,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to connect to the backend server. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = async (doctorId: string) => {
    const chosenSlotIso = selectedSlots[doctorId];
    if (!chosenSlotIso) {
      alert("Please select an available time slot first!");
      return;
    }

    try {
      setBookingStatus((prev) => ({ ...prev, [doctorId]: "booking" }));
      const token = localStorage.getItem("token") || "";

      const response = await fetch(
        "http://localhost:3000/patient/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId,
            scheduledAt: chosenSlotIso,
            reason: "Referred via PulmoAI Symptom Chatbot",
          }),
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to book appointment");

      setBookingStatus((prev) => ({ ...prev, [doctorId]: "success" }));
    } catch (err) {
      setBookingStatus((prev) => ({ ...prev, [doctorId]: "error" }));
      alert(err instanceof Error ? err.message : "Booking failed");
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)] bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative">
      {/* Chat History Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 sm:w-80 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          showHistory
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between gap-2">
          <button
            onClick={handleNewChat}
            className="flex-1 bg-gradient-to-r from-[#2F80ED] to-[#14B8A6] text-white font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-all cursor-pointer text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
          <button
            onClick={() => setShowHistory(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2 px-1">
            Chat History
          </p>
          {chatHistory.length === 0 ? (
            <p className="text-xs text-gray-400 px-1">No previous chats found.</p>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`group relative flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors ${
                  activeSessionId === chat.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {editingSessionId === chat.id ? (
                  <form
                    onSubmit={(e) => handleRenameChat(chat.id, e)}
                    className="flex items-center gap-1 w-full"
                  >
                    <input
                      type="text"
                      value={newTitle}
                      autoFocus
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-xs outline-none text-gray-900"
                    />
                    <button
                      type="submit"
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSessionId(null)}
                      className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      onClick={() => handleSelectSession(chat.id)}
                      className="text-left truncate flex-1 cursor-pointer pr-6"
                    >
                      {chat.title || "Respiratory Consultation"}
                    </button>

                    <div className="absolute right-2 flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === chat.id ? null : chat.id
                          );
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {openMenuId === chat.id && (
                        <div className="absolute right-0 top-6 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 text-xs">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSessionId(chat.id);
                              setNewTitle(chat.title);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" /> Rename
                          </button>
                          <button
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                            className="w-full text-left px-3 py-1.5 hover:bg-rose-50 flex items-center gap-1.5 text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showHistory && (
        <div
          onClick={() => setShowHistory(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-20 lg:hidden"
        />
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        <div className="px-3 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate">
              AI Healthcare Chatbot
            </h1>
            <p className="text-gray-500 text-[11px] sm:text-xs truncate">
              Ask questions & discuss symptoms
            </p>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            title="Chat History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 sm:p-4 shadow-xs border border-gray-100 text-gray-800 text-xs sm:text-sm leading-relaxed space-y-2">
                <p>
                  Hello! I&apos;m your healthcare assistant. How can I help you
                  today? You can describe your symptoms or ask health-related
                  questions.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col gap-2 max-w-2xl ${
                msg.role === "user" ? "ml-auto items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-2xl p-3.5 sm:p-4 shadow-xs border text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white border-blue-500 rounded-tr-sm"
                    : "bg-white text-gray-800 border-gray-100 rounded-tl-sm w-full"
                }`}
              >
                <p>{msg.content}</p>

                {/* Render Doctor Cards with Slot Selection */}
                {msg.doctors && msg.doctors.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {msg.doctors.map((doc) => {
                      const status = bookingStatus[doc.id];
                      return (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3"
                        >
                          <div>
                            <p className="font-semibold text-gray-950 text-xs sm:text-sm">
                              {doc.fullName}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {doc.specialization}{" "}
                              {doc.hospitalAffiliation
                                ? `• ${doc.hospitalAffiliation}`
                                : ""}
                            </p>
                          </div>

                          {status !== "success" && doc.availableSlots && (
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                                Select Preferred Time Slot:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {doc.availableSlots.map((slot, idx) => {
                                  const isSelected =
                                    selectedSlots[doc.id] === slot.iso;
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() =>
                                        setSelectedSlots((prev) => ({
                                          ...prev,
                                          [doc.id]: slot.iso,
                                        }))
                                      }
                                      className={`text-[11px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                                        isSelected
                                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                                      }`}
                                    >
                                      {slot.date} @ {slot.time}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end pt-1">
                            {status === "success" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Booked
                              </span>
                            ) : (
                              <button
                                onClick={() => handleBookAppointment(doc.id)}
                                disabled={
                                  status === "booking" || !selectedSlots[doc.id]
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Calendar className="w-3 h-3" />
                                {status === "booking"
                                  ? "Confirming..."
                                  : "Confirm & Book Slot"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-2xl rounded-tl-sm p-3 border border-gray-100 text-gray-500 text-xs shadow-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
                <span>Analyzing symptoms & matching specialists...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-xs text-center">{error}</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-2.5 sm:p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto">
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-xs focus-within:border-blue-500 transition-all">
              <button
                type="button"
                className="pl-3 pr-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your symptoms..."
                className="flex-1 py-2 sm:py-3 px-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-hidden"
              />

              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="mr-1.5 bg-gradient-to-r from-[#2F80ED] to-[#14B8A6] text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-1 hover:opacity-95 transition-all cursor-pointer shadow-xs shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}