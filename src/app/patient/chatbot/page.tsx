"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Paperclip,
  Send,
  History,
  X,
  Calendar,
  CheckCircle2,
  Clock,
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

  const [selectedSlots, setSelectedSlots] = useState<{
    [doctorId: string]: string;
  }>({});
  const [bookingStatus, setBookingStatus] = useState<{
    [doctorId: string]: string;
  }>({});

  // Fetch chat history sessions on initial page load
  useEffect(() => {
    fetchChatSessions();
  }, []);

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

  // Load messages when selecting a chat from the sidebar history
  const handleSelectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setShowHistory(false);
    setIsLoading(true);
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

  // Click "New Chat" to clear the screen and start fresh
  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setShowHistory(false);
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

      // Safely check if response has content before parsing JSON
      const textResponse = await response.text();
      const data = textResponse ? JSON.parse(textResponse) : {};

      if (!response.ok) {
        throw new Error(data.message || "AI request failed");
      }

      // If a brand new session was created on the backend, update activeSessionId and refresh sidebar list
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
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative">
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
            className="flex-1 bg-gradient-to-r from-[#2F80ED] to-[#14B8A6] text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-all cursor-pointer text-xs sm:text-sm"
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

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3 px-1">
            Chat History
          </p>
          {chatHistory.length === 0 ? (
            <p className="text-xs text-gray-400 px-1">
              No previous chats found.
            </p>
          ) : (
            chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectSession(chat.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer truncate ${
                  activeSessionId === chat.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {chat.title || "Respiratory Consultation"}
              </button>
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
        <div className="px-4 sm:px-8 py-3.5 sm:py-5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-xl font-bold text-gray-900 mb-0.5">
              AI Healthcare Chatbot
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm truncate">
              Ask questions, discuss symptoms, and upload scans
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xs border border-gray-100 text-gray-800 text-xs sm:text-sm leading-relaxed space-y-2">
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
                className={`rounded-2xl p-4 sm:p-5 shadow-xs border text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
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
                          className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3"
                        >
                          <div>
                            <p className="font-semibold text-gray-950">
                              {doc.fullName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {doc.specialization}{" "}
                              {doc.hospitalAffiliation
                                ? `• ${doc.hospitalAffiliation}`
                                : ""}
                            </p>
                          </div>

                          {status !== "success" && doc.availableSlots && (
                            <div className="space-y-1.5">
                              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3 h-3 text-blue-500" />{" "}
                                Select Preferred Time Slot:
                              </p>
                              <div className="flex flex-wrap gap-2">
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
                                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
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
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4" /> Slot Booked
                                Successfully
                              </span>
                            ) : (
                              <button
                                onClick={() => handleBookAppointment(doc.id)}
                                disabled={
                                  status === "booking" || !selectedSlots[doc.id]
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Calendar className="w-3.5 h-3.5" />
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
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 border border-gray-100 text-gray-500 text-sm shadow-xs">
                Analyzing symptoms and finding specialists...
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-xs sm:text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-5 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto space-y-2">
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-xs focus-within:border-blue-500 transition-all">
              <button
                type="button"
                className="pl-3 sm:pl-4 pr-1.5 sm:pr-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your symptoms or ask a question..."
                className="flex-1 py-2.5 sm:py-3.5 pr-2 sm:pr-4 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-hidden"
              />

              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="mr-1.5 sm:mr-2 bg-gradient-to-r from-[#2F80ED] to-[#14B8A6] text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-xs shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? "Sending..." : "Send"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
