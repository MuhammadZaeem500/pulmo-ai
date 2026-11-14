"use client";

import { useState, useEffect, useRef } from "react";
import type { FormEvent, MouseEvent } from "react";
import {
  Plus,
  Paperclip,
  Send,
  PanelLeftOpen,
  X,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Check,
  MoreVertical,
  Sparkles,
  Bookmark,
  FileText,
  Download,
  Eye,
  RefreshCw,
} from "lucide-react";

type Slot = {
  date: string;
  time: string;
  iso: string;
};

type Doctor = {
  id: string;
  doctorId?: string;
  fullName: string;
  specialization: string;
  hospitalAffiliation?: string | null;
  consultationHours?: string | null;
  bookedSlots?: string[];
  availableSlots?: Slot[];
};

type Attachment = {
  id: string;
  fileName: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  url?: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  specialization?: string;
  doctors?: Doctor[];
  attachment?: Attachment | null;
  localFile?: File;
};

type ChatSessionItem = {
  id: string;
  title: string;
  updatedAt: string;
};

const API_BASE_URL = "http://localhost:3000";

const AVAILABILITY_URL = (doctorId: string) =>
  `${API_BASE_URL}/patient/appointments/doctors/${doctorId}/available-slots`;

const APPOINTMENT_URL = `${API_BASE_URL}/patient/appointments`;

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSessionItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Selected date per doctor: Record<doctorId, "YYYY-MM-DD">
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>(
    {},
  );
  // Selected slot ISO per doctor
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>(
    {},
  );
  const [bookingStatus, setBookingStatus] = useState<Record<string, string>>(
    {},
  );
  const [slotLoading, setSlotLoading] = useState<Record<string, boolean>>({});
  const [slotErrors, setSlotErrors] = useState<Record<string, string>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestedDoctorsRef = useRef<Set<string>>(new Set());

  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    fetchChatSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const doctors = messages.flatMap((msg) => msg.doctors || []);

    doctors.forEach((doctor) => {
      const docId = doctor.id || doctor.doctorId;
      if (docId && !requestedDoctorsRef.current.has(docId)) {
        fetchDoctorSlots(docId);
      }
    });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchChatSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/patient/chatbot/sessions`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load chat history.");
      }

      const data = await response.json();
      setChatHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  const fetchDoctorSlots = async (doctorId: string) => {
    requestedDoctorsRef.current.add(doctorId);

    setSlotLoading((prev) => ({ ...prev, [doctorId]: true }));
    setSlotErrors((prev) => ({ ...prev, [doctorId]: "" }));

    try {
      const response = await fetch(AVAILABILITY_URL(doctorId), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const responseText = await response.text();
      let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Invalid availability response from server.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch consultation times.");
      }

      const result = data.data || data;
      const consultationHours = result.consultationHours || "";
      const bookedSlots = Array.isArray(result.bookedSlots)
        ? result.bookedSlots
        : [];

      setMessages((prev) =>
        prev.map((msg) => {
          if (!msg.doctors) return msg;

          return {
            ...msg,
            doctors: msg.doctors.map((doctor) =>
              (doctor.id || doctor.doctorId) === doctorId
                ? {
                    ...doctor,
                    consultationHours,
                    bookedSlots,
                  }
                : doctor,
            ),
          };
        }),
      );
    } catch (err) {
      console.error("Availability fetch failed:", err);
      setSlotErrors((prev) => ({
        ...prev,
        [doctorId]:
          err instanceof Error
            ? err.message
            : "Unable to load consultation hours.",
      }));
    } finally {
      setSlotLoading((prev) => ({ ...prev, [doctorId]: false }));
    }
  };

  const handleRefreshSlots = async (doctorId: string) => {
    requestedDoctorsRef.current.delete(doctorId);
    await fetchDoctorSlots(doctorId);
  };

  // Helper to generate time slots for a given date and doctor
  const generateSlotsForDate = (
    dateStr: string,
    bookedSlots: string[] = [],
  ): Slot[] => {
    if (!dateStr) return [];
    const slots: Slot[] = [];
    const bookedSet = new Set(bookedSlots);

    // Standard hourly blocks between 09:00 and 17:00
    const hours = [9, 10, 11, 12, 13, 14, 15, 16];

    for (const hour of hours) {
      const slotDate = new Date(
        `${dateStr}T${hour.toString().padStart(2, "0")}:00:00`,
      );
      const isoString = slotDate.toISOString();

      if (!bookedSet.has(isoString)) {
        slots.push({
          date: slotDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: slotDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          iso: isoString,
        });
      }
    }

    return slots;
  };

  const handleSelectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setShowHistory(false);
    setIsLoading(true);
    setOpenMenuId(null);
    setError("");

    setSelectedSlots({});
    setSelectedDates({});
    setBookingStatus({});
    setSlotErrors({});
    requestedDoctorsRef.current.clear();

    try {
      const response = await fetch(
        `${API_BASE_URL}/patient/chatbot/sessions/${sessionId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to load this conversation.");
      }

      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load session messages:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load conversation.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setShowHistory(false);
    setAttachedFile(null);
    setError("");
    setSelectedSlots({});
    setSelectedDates({});
    setBookingStatus({});
    setSlotErrors({});
    requestedDoctorsRef.current.clear();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFilePreview = async (file: File) => {
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewText("");
    setPreviewLoading(false);

    const fileName = file.name.toLowerCase();
    const isText =
      file.type.startsWith("text/") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".csv");

    if (isText) {
      setPreviewLoading(true);
      try {
        setPreviewText(await file.text());
      } catch (err) {
        console.error("Failed to read file:", err);
        setPreviewText("Unable to read this file.");
      } finally {
        setPreviewLoading(false);
      }
    }
  };

  const closeFilePreview = () => {
    setPreviewFile(null);
    setPreviewUrl("");
    setPreviewText("");
    setPreviewLoading(false);
  };

  const handleOpenSavedAttachment = async (attachment: Attachment) => {
    try {
      setError("");
      if (!attachment.url) throw new Error("Attachment URL is missing.");

      const response = await fetch(`${API_BASE_URL}${attachment.url}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) throw new Error(`Unable to load attachment.`);

      const blob = await response.blob();
      const file = new File([blob], attachment.fileName, {
        type: attachment.mimeType || blob.type || "application/octet-stream",
      });

      await openFilePreview(file);
    } catch (err) {
      console.error("Attachment preview error:", err);
      setError(
        err instanceof Error ? err.message : "Unable to open this attachment.",
      );
    }
  };

  const isPdfFile = (file: File) =>
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImageFile = (file: File) =>
    file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(file.name);
  const isTextFile = (file: File) =>
    file.type.startsWith("text/") || /\.(txt|csv)$/i.test(file.name);

  const handleRenameChat = async (sessionId: string, e?: FormEvent) => {
    e?.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/patient/chatbot/sessions/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ title: newTitle.trim() }),
        },
      );

      if (!response.ok) throw new Error("Unable to rename conversation.");

      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === sessionId ? { ...chat, title: newTitle.trim() } : chat,
        ),
      );

      setEditingSessionId(null);
      setNewTitle("");
      setOpenMenuId(null);
    } catch (err) {
      console.error("Rename failed:", err);
      setError(err instanceof Error ? err.message : "Unable to rename chat.");
    }
  };

  const handleDeleteChat = async (
    sessionId: string,
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/patient/chatbot/sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );

      if (!response.ok) throw new Error("Unable to delete conversation.");

      setChatHistory((prev) => prev.filter((chat) => chat.id !== sessionId));
      if (activeSessionId === sessionId) handleNewChat();
      setOpenMenuId(null);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err instanceof Error ? err.message : "Unable to delete chat.");
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !attachedFile) || isLoading) return;

    const userMessage = message.trim();
    const fileToSend = attachedFile;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage || "Uploaded medical report",
        localFile: fileToSend || undefined,
      },
    ]);

    setMessage("");
    setAttachedFile(null);
    setIsLoading(true);
    setError("");

    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      const formData = new FormData();
      formData.append("symptomText", userMessage);
      if (activeSessionId) formData.append("sessionId", activeSessionId);
      if (fileToSend) formData.append("file", fileToSend);

      const response = await fetch(
        `${API_BASE_URL}/patient/chatbot/analyze-and-recommend`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        },
      );

      const responseText = await response.text();
      let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) throw new Error(data.message || "AI request failed.");

      if (data.sessionId && activeSessionId !== data.sessionId) {
        setActiveSessionId(data.sessionId);
        fetchChatSessions();
      }

      setMessages((prev) => {
        const updated = [...prev];
        let userMessageIndex = -1;

        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].role === "user" && updated[i].localFile) {
            userMessageIndex = i;
            break;
          }
        }

        if (userMessageIndex !== -1) {
          updated[userMessageIndex] = {
            ...updated[userMessageIndex],
            attachment: data.attachment || null,
            localFile: undefined,
          };
        }

        return [
          ...updated,
          {
            role: "assistant",
            content: data.content || "I could not generate a response.",
            specialization: data.specialization,
            doctors: Array.isArray(data.doctors)
              ? data.doctors.map((doctor: any) => ({
                  ...doctor,
                  id: doctor.id || doctor.doctorId,
                }))
              : [],
          },
        ];
      });
    } catch (err) {
      console.error("Chatbot request failed:", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to process your request. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = async (doctorId: string) => {
    const chosenSlotIso = selectedSlots[doctorId];

    if (!chosenSlotIso) {
      setBookingStatus((prev) => ({
        ...prev,
        [doctorId]: "Please select a consultation time first.",
      }));
      return;
    }

    try {
      setBookingStatus((prev) => ({ ...prev, [doctorId]: "booking" }));

      const response = await fetch(APPOINTMENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          doctorId,
          scheduledAt: chosenSlotIso,
          reason: "Referred via PulmoAI Symptom Chatbot",
        }),
      });

      const responseText = await response.text();
      let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok)
        throw new Error(data.message || "Failed to book appointment.");

      setBookingStatus((prev) => ({ ...prev, [doctorId]: "success" }));
      setSelectedSlots((prev) => ({ ...prev, [doctorId]: "" }));

      requestedDoctorsRef.current.delete(doctorId);
      await fetchDoctorSlots(doctorId);
    } catch (err) {
      setBookingStatus((prev) => ({ ...prev, [doctorId]: "error" }));
      alert(err instanceof Error ? err.message : "Unable to book appointment.");
    }
  };

  return (
    <>
      <div className="relative flex h-[calc(100vh-7rem)] overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs sm:h-[calc(100vh-8rem)] sm:rounded-2xl">
        {/* Chat History Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-gray-100 bg-white transition-transform duration-200 sm:w-80 lg:static lg:translate-x-0 ${
            showHistory
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 p-3 sm:p-4">
            <button
              onClick={handleNewChat}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#2F80ED] to-[#14B8A6] px-3 py-2.5 text-xs font-medium text-white shadow-xs transition-all hover:opacity-95 sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>

            <button
              onClick={() => setShowHistory(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto p-2 sm:p-4">
            <p className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs">
              <Bookmark className="h-3.5 w-3.5 text-blue-500" />
              Tracked Chats
            </p>

            {chatHistory.length === 0 ? (
              <p className="px-1 text-xs text-gray-400">
                No previous chats found.
              </p>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-colors sm:text-sm ${
                    activeSessionId === chat.id
                      ? "border-l-4 border-blue-600 bg-blue-50/80 font-semibold text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {editingSessionId === chat.id ? (
                    <form
                      onSubmit={(e) => handleRenameChat(chat.id, e)}
                      className="flex w-full items-center gap-1"
                    >
                      <input
                        type="text"
                        value={newTitle}
                        autoFocus
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full rounded border border-blue-300 bg-white px-2 py-1 text-xs text-gray-900 outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSessionId(null)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSelectSession(chat.id)}
                        className="flex flex-1 cursor-pointer items-center gap-2 truncate pr-6 text-left"
                      >
                        <Bookmark
                          className={`h-3.5 w-3.5 shrink-0 ${
                            activeSessionId === chat.id
                              ? "text-blue-600"
                              : "text-gray-300"
                          }`}
                        />
                        <span className="truncate">
                          {chat.title || "Respiratory Consultation"}
                        </span>
                      </button>

                      <div className="absolute right-2 flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === chat.id ? null : chat.id,
                            );
                          }}
                          className="cursor-pointer rounded p-1 text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>

                        {openMenuId === chat.id && (
                          <div className="absolute right-0 top-6 z-10 w-28 rounded-lg border border-gray-200 bg-white py-1 text-xs shadow-lg">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSessionId(chat.id);
                                setNewTitle(chat.title);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50"
                            >
                              <Edit2 className="h-3 w-3" />
                              Rename
                            </button>

                            <button
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                              className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
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
            className="fixed inset-0 z-20 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Chat Interface */}
        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                onClick={() => setShowHistory(true)}
                className="flex shrink-0 items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 lg:hidden"
                title="Toggle Sidebar"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                  AI Healthcare Chatbot
                </h1>
                <p className="truncate text-[11px] text-gray-500 sm:text-xs">
                  Ask questions & discuss symptoms
                </p>
              </div>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50/50 p-3 sm:p-6">
            {messages.length === 0 && (
              <div className="flex max-w-2xl items-start gap-3">
                <div className="space-y-2 rounded-2xl rounded-tl-sm border border-gray-100 bg-white p-3.5 text-xs leading-relaxed text-gray-800 shadow-xs sm:p-4 sm:text-sm">
                  <p>
                    Hello! I&apos;m your healthcare assistant. How can I help
                    you today? You can describe your symptoms or ask
                    health-related questions. You can also attach a medical
                    image or report.
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex max-w-2xl flex-col gap-2 ${msg.role === "user" ? "ml-auto items-end" : "items-start"}`}
              >
                <div
                  className={`w-full rounded-2xl border p-3.5 text-xs leading-relaxed shadow-xs sm:p-4 sm:text-sm ${
                    msg.role === "user"
                      ? "rounded-tr-sm border-blue-500 bg-blue-500 text-white"
                      : "rounded-tl-sm border-gray-100 bg-white text-gray-800"
                  }`}
                >
                  {msg.content && (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}

                  {msg.localFile && (
                    <button
                      type="button"
                      onClick={() => openFilePreview(msg.localFile!)}
                      className="mt-3 flex w-full items-center gap-3 rounded-xl border border-white/30 bg-white/10 p-3 text-left"
                    >
                      <FileText className="h-5 w-5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {msg.localFile.name}
                        </p>
                        <p className="text-[10px] opacity-75">
                          Preview attachment
                        </p>
                      </div>
                      <Eye className="h-4 w-4 shrink-0" />
                    </button>
                  )}

                  {msg.attachment && (
                    <button
                      type="button"
                      onClick={() => handleOpenSavedAttachment(msg.attachment!)}
                      className="mt-3 flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100"
                    >
                      <FileText className="h-5 w-5 shrink-0 text-blue-600" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800">
                          {msg.attachment.fileName}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          View attachment
                        </p>
                      </div>
                      <Eye className="h-4 w-4 shrink-0 text-gray-500" />
                    </button>
                  )}

                  {/* Doctor Cards */}
                  {msg.doctors && msg.doctors.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {msg.doctors.map((doc) => {
                        const docId = doc.id || doc.doctorId;
                        if (!docId) return null;

                        const status = bookingStatus[docId];
                        const selectedDate = selectedDates[docId] || "";
                        const slots = generateSlotsForDate(
                          selectedDate,
                          doc.bookedSlots,
                        );

                        return (
                          <div
                            key={docId}
                            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                          >
                            <div>
                              <p className="text-xs font-semibold text-gray-950 sm:text-sm">
                                {doc.fullName}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {doc.specialization}
                                {doc.hospitalAffiliation
                                  ? ` • ${doc.hospitalAffiliation}`
                                  : ""}
                              </p>
                              {doc.consultationHours && (
                                <div className="mt-2 space-y-1">
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Consultation Hours:
                                  </p>
                                  <ul className="grid grid-cols-1 gap-1 text-[11px] text-slate-700 sm:grid-cols-2">
                                    {doc.consultationHours
                                      .split(";")
                                      .map((daySchedule, idx) => {
                                        const [day, time] =
                                          daySchedule.split(":");
                                        if (!day || !time) return null;
                                        const isClosed = time
                                          .trim()
                                          .toLowerCase()
                                          .includes("closed");

                                        return (
                                          <li
                                            key={idx}
                                            className="flex items-center justify-between rounded-md bg-white px-2.5 py-1 border border-slate-200/60 shadow-2xs"
                                          >
                                            <span className="font-medium text-slate-900">
                                              {day.trim()}
                                            </span>
                                            <span
                                              className={
                                                isClosed
                                                  ? "text-rose-500 font-medium"
                                                  : "text-slate-600"
                                              }
                                            >
                                              {time.trim()}
                                            </span>
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                  Step 1: Select Consultation Date
                                </p>

                                <button
                                  type="button"
                                  onClick={() => handleRefreshSlots(docId)}
                                  disabled={slotLoading[docId]}
                                  className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                >
                                  <RefreshCw
                                    className={`h-3 w-3 ${slotLoading[docId] ? "animate-spin" : ""}`}
                                  />
                                  Refresh
                                </button>
                              </div>

                              <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                  setSelectedDates((prev) => ({
                                    ...prev,
                                    [docId]: e.target.value,
                                  }));
                                  setSelectedSlots((prev) => ({
                                    ...prev,
                                    [docId]: "",
                                  }));
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                              />
                            </div>

                            {selectedDate && (
                              <div className="space-y-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                  Step 2: Select Available Time
                                </p>

                                {slotLoading[docId] ? (
                                  <p className="flex items-center gap-2 text-xs text-slate-500">
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                    Checking consultation slots...
                                  </p>
                                ) : slots.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {slots.map((slot) => {
                                      const isSelected =
                                        selectedSlots[docId] === slot.iso;

                                      return (
                                        <button
                                          key={slot.iso}
                                          type="button"
                                          onClick={() => {
                                            setSelectedSlots((prev) => ({
                                              ...prev,
                                              [docId]: slot.iso,
                                            }));
                                            setBookingStatus((prev) => ({
                                              ...prev,
                                              [docId]: "",
                                            }));
                                          }}
                                          className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-[11px] transition-all ${
                                            isSelected
                                              ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                                              : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                                          }`}
                                        >
                                          {slot.time}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-slate-500">
                                    No available slots found for this date. All
                                    hours may be booked.
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2">
                              {status === "success" ? (
                                <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Appointment booked successfully
                                </span>
                              ) : status === "booking" ? (
                                <span className="text-[11px] text-blue-600">
                                  Booking your appointment...
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500">
                                  Select a date and time slot to book.
                                </span>
                              )}

                              {status !== "success" && (
                                <button
                                  type="button"
                                  onClick={() => handleBookAppointment(docId)}
                                  disabled={
                                    !selectedSlots[docId] ||
                                    slotLoading[docId] ||
                                    status === "booking"
                                  }
                                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Calendar className="h-3 w-3" />
                                  {status === "booking"
                                    ? "Confirming..."
                                    : "Confirm & Book"}
                                </button>
                              )}
                            </div>

                            {status === "error" && (
                              <p className="text-[11px] text-red-600">
                                Booking failed. Please select another time.
                              </p>
                            )}
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
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-gray-100 bg-white p-3 text-xs text-gray-500 shadow-xs">
                  <Sparkles className="h-4 w-4 animate-spin text-blue-500" />
                  <span>Analyzing your symptoms and attachment...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center text-xs text-red-500">{error}</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar & Attachment Preview */}
          <div className="border-t border-gray-100 bg-white p-2.5 sm:p-4">
            {attachedFile && (
              <div className="mx-auto mb-2 flex w-fit max-w-full items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-700">
                <button
                  type="button"
                  onClick={() => openFilePreview(attachedFile)}
                  className="flex min-w-0 cursor-pointer items-center gap-2"
                >
                  <Paperclip className="h-3.5 w-3.5 shrink-0" />
                  <span className="max-w-xs truncate">{attachedFile.name}</span>
                  <span className="shrink-0 text-blue-500 underline">
                    Preview
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAttachedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="ml-1 cursor-pointer font-bold text-slate-400 hover:text-rose-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="mx-auto max-w-4xl">
              <div className="relative flex items-center rounded-xl border border-gray-200 bg-white shadow-xs transition-all focus-within:border-blue-500">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (!selectedFile) return;

                    const allowedExtensions = [
                      ".pdf",
                      ".jpg",
                      ".jpeg",
                      ".png",
                      ".webp",
                      ".docx",
                      ".txt",
                      ".csv",
                    ];
                    const extension = selectedFile.name
                      .slice(selectedFile.name.lastIndexOf("."))
                      .toLowerCase();

                    if (!allowedExtensions.includes(extension)) {
                      setError(
                        "Supported files: PDF, JPG, PNG, WEBP, DOCX, TXT and CSV.",
                      );
                      e.target.value = "";
                      return;
                    }

                    if (selectedFile.size > 10 * 1024 * 1024) {
                      setError("File size must be 10 MB or less.");
                      e.target.value = "";
                      return;
                    }

                    setError("");
                    setAttachedFile(selectedFile);
                  }}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.txt,.csv,image/jpeg,image/png,image/webp,application/pdf"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 cursor-pointer pl-3 pr-1 text-gray-400 transition-colors hover:text-blue-600"
                  title="Attach a medical report"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your symptoms or attach a medical file..."
                  className="flex-1 bg-transparent px-2 py-2 text-xs text-gray-900 outline-hidden placeholder:text-gray-400 sm:py-3 sm:text-sm"
                />

                <button
                  type="submit"
                  disabled={isLoading || (!message.trim() && !attachedFile)}
                  className="mr-1.5 flex shrink-0 cursor-pointer items-center gap-1 rounded-lg bg-linear-to-r from-[#2F80ED] to-[#14B8A6] px-3 py-2 text-xs font-medium text-white shadow-xs transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                >
                  <span>Send</span>
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-6"
          onClick={closeFilePreview}
        >
          <div
            className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-gray-900">
                    {previewFile.name}
                  </h2>
                  <p className="text-xs text-gray-400">File Preview</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeFilePreview}
                className="shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-500"
                title="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 min-h-0 items-center justify-center overflow-auto bg-gray-100 p-2 sm:p-4">
              {isPdfFile(previewFile) ? (
                <iframe
                  src={previewUrl}
                  title={`Preview of ${previewFile.name}`}
                  className="h-full w-full rounded-lg bg-white"
                />
              ) : isImageFile(previewFile) ? (
                <img
                  src={previewUrl}
                  alt={previewFile.name}
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              ) : isTextFile(previewFile) ? (
                <div className="h-full w-full overflow-auto rounded-lg bg-white">
                  {previewLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      Loading file content...
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap break-words p-4 font-mono text-xs text-gray-800 sm:p-6 sm:text-sm">
                      {previewText || "This file is empty."}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <FileText className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                  <h3 className="font-semibold text-gray-800">
                    Preview is not available for this format yet.
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    You can download this file to view it.
                  </p>
                  <a
                    href={previewUrl}
                    download={previewFile.name}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </a>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="hidden text-xs text-gray-400 sm:block">
                {previewFile.name}
              </p>
              <button
                type="button"
                onClick={closeFilePreview}
                className="ml-auto rounded-lg bg-gray-900 px-5 py-2 text-sm text-white transition-colors hover:bg-gray-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
