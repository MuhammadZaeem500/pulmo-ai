"use client";

import { useState, useEffect, useRef } from "react";
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

  // Saved attachment returned by the backend
  attachment?: Attachment | null;

  // Temporary file used before uploading
  localFile?: File;
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
  const API_BASE_URL = "http://localhost:3000";


  // Attachment state
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File preview state
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

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

  // Load chat history
  useEffect(() => {
    fetchChatSessions();
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Clean up preview URLs when they change or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);



const handleOpenSavedAttachment = async (
  attachment: Attachment,
) => {
  try {
    setError("");

    if (!attachment.url) {
      throw new Error("Attachment URL is missing.");
    }

    const token = localStorage.getItem("token") || "";

    const response = await fetch(
      `${API_BASE_URL}${attachment.url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Unable to load attachment. Status: ${response.status}`,
      );
    }

    const blob = await response.blob();

    const file = new File(
      [blob],
      attachment.fileName,
      {
        type:
          attachment.mimeType ||
          blob.type ||
          "application/octet-stream",
      },
    );

    await openFilePreview(file);
  } catch (error) {
    console.error("Attachment preview error:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Unable to open this attachment.",
    );
  }
};



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
    setAttachedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Open file preview
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
        const content = await file.text();
        setPreviewText(content);
      } catch (err) {
        console.error("Failed to read file", err);
        setPreviewText("Unable to read this file.");
      } finally {
        setPreviewLoading(false);
      }
    }
  };

  // Close file preview
  const closeFilePreview = () => {
    setPreviewFile(null);
    setPreviewUrl("");
    setPreviewText("");
    setPreviewLoading(false);
  };

  // Check file format
  const isPdfFile = (file: File) => {
    return (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    );
  };

  const isImageFile = (file: File) => {
    return (
      file.type.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    );
  };

  const isTextFile = (file: File) => {
    return file.type.startsWith("text/") || /\.(txt|csv)$/i.test(file.name);
  };

  // Rename chat API handler
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
            chat.id === sessionId ? { ...chat, title: newTitle.trim() } : chat,
          ),
        );

        setEditingSessionId(null);
        setNewTitle("");
        setOpenMenuId(null);
      }
    } catch (err) {
      console.error("Failed to rename chat session", err);
    }
  };

  // Delete chat API handler
  const handleDeleteChat = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

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

  // Send message and attachment
 
const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();

  if ((!message.trim() && !attachedFile) || isLoading) return;

  const userMessage = message.trim();
  const fileToSend = attachedFile;

  // Add the user's message immediately
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

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

  try {
    const token = localStorage.getItem("token") || "";

    const formData = new FormData();
    formData.append("symptomText", userMessage);

    if (activeSessionId) {
      formData.append("sessionId", activeSessionId);
    }

    if (fileToSend) {
      formData.append("file", fileToSend);
    }

    const response = await fetch(
      `${API_BASE_URL}/patient/chatbot/analyze-and-recommend`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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

    // Update the user's message with the saved attachment information.
    // Then add the assistant's response.
    setMessages((prev) => {
      const updatedMessages = [...prev];

      if (data.attachment) {
        const userMessageIndex = updatedMessages.findLastIndex(
          (msg) => msg.role === "user" && msg.localFile,
        );

        if (userMessageIndex !== -1) {
          updatedMessages[userMessageIndex] = {
            ...updatedMessages[userMessageIndex],
            attachment: data.attachment,
            localFile: undefined,
          };
        }
      }

      return [
        ...updatedMessages,
        {
          role: "assistant",
          content: data.content,
          specialization: data.specialization,
          doctors: data.doctors,
        },
      ];
    });
  } catch (err) {
    console.error("Chatbot request failed:", err);

    setError(
      err instanceof Error ? err.message : "Something went wrong.",
    );

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


  // Book appointment
  const handleBookAppointment = async (doctorId: string) => {
    const chosenSlotIso = selectedSlots[doctorId];

    if (!chosenSlotIso) {
      alert("Please select an available time slot first!");
      return;
    }

    try {
      setBookingStatus((prev) => ({
        ...prev,
        [doctorId]: "booking",
      }));

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

      if (!response.ok) {
        throw new Error(data.message || "Failed to book appointment");
      }

      setBookingStatus((prev) => ({
        ...prev,
        [doctorId]: "success",
      }));
    } catch (err) {
      setBookingStatus((prev) => ({
        ...prev,
        [doctorId]: "error",
      }));

      alert(err instanceof Error ? err.message : "Booking failed");
    }
  };

  return (
    <>
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
              className="flex-1 bg-linear-to-r from-[#2F80ED] to-[#14B8A6] text-white font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-all cursor-pointer text-xs sm:text-sm"
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

          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1.5">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2 px-1 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-blue-500" />
              Tracked Chats
            </p>

            {chatHistory.length === 0 ? (
              <p className="text-xs text-gray-400 px-1">
                No previous chats found.
              </p>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-colors ${
                    activeSessionId === chat.id
                      ? "bg-blue-50/80 text-blue-600 font-semibold border-l-4 border-blue-600"
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
                        className="text-left truncate flex-1 cursor-pointer pr-6 flex items-center gap-2"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 shrink-0 ${
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
                              <Edit2 className="w-3 h-3" />
                              Rename
                            </button>

                            <button
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                              className="w-full text-left px-3 py-1.5 hover:bg-rose-50 flex items-center gap-1.5 text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
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
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          <div className="px-3 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2.5">
              <button
                onClick={() => setShowHistory(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 flex items-center justify-center shadow-2xs"
                title="Toggle Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4 text-slate-700" />
              </button>

              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                  AI Healthcare Chatbot
                </h1>

                <p className="text-gray-500 text-[11px] sm:text-xs truncate">
                  Ask questions & discuss symptoms
                </p>
              </div>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="flex items-start gap-3 max-w-2xl">
                <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 sm:p-4 shadow-xs border border-gray-100 text-gray-800 text-xs sm:text-sm leading-relaxed space-y-2">
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
                  {msg.content && <p>{msg.content}</p>}

                  {msg.localFile && (
                    <button
                      type="button"
                      onClick={() => openFilePreview(msg.localFile!)}
                      className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-white/30 bg-white/10 text-left w-full"
                    >
                      <FileText className="w-5 h-5 shrink-0" />

                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {msg.localFile.name}
                        </p>
                        <p className="text-[10px] opacity-75">
                          Preview attachment
                        </p>
                      </div>

                      <Eye className="w-4 h-4 shrink-0" />
                    </button>
                  )}

                 
{msg.attachment && (
  <button
    type="button"
    onClick={() =>
      handleOpenSavedAttachment(msg.attachment!)
    }
    className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 text-left w-full hover:bg-gray-100 transition-colors"
  >
    <FileText className="w-5 h-5 shrink-0 text-blue-600" />

    <div className="min-w-0 flex-1">
      <p className="font-medium truncate text-gray-800">
        {msg.attachment.fileName}
      </p>

      <p className="text-[10px] text-gray-500">
        View attachment
      </p>
    </div>

    <Eye className="w-4 h-4 shrink-0 text-gray-500" />
  </button>
)}


                  {/* Doctor Cards */}
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

                            {status !== "success" &&
                              doc.availableSlots &&
                              doc.availableSlots.length > 0 && (
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
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Booked
                                </span>
                              ) : doc.availableSlots &&
                                doc.availableSlots.length > 0 ? (
                                <button
                                  onClick={() => handleBookAppointment(doc.id)}
                                  disabled={
                                    status === "booking" ||
                                    !selectedSlots[doc.id]
                                  }
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Calendar className="w-3 h-3" />

                                  {status === "booking"
                                    ? "Confirming..."
                                    : "Confirm & Book Slot"}
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-500">
                                  Appointment times are not available here yet.
                                </span>
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
                  <span>Analyzing your symptoms and attachment...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-xs text-center">{error}</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar & Attachment Preview */}
          <div className="p-2.5 sm:p-4 bg-white border-t border-gray-100">
            {attachedFile && (
              <div className="max-w-4xl mx-auto mb-2 flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs text-blue-700 w-fit">
                <button
                  type="button"
                  onClick={() => openFilePreview(attachedFile)}
                  className="flex items-center gap-2 cursor-pointer min-w-0"
                >
                  <Paperclip className="w-3.5 h-3.5 shrink-0" />

                  <span className="truncate max-w-xs">{attachedFile.name}</span>

                  <span className="text-blue-500 underline shrink-0">
                    Preview
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAttachedFile(null);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="ml-1 text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="max-w-4xl mx-auto">
              <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-xs focus-within:border-blue-500 transition-all">
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
                        "Supported files: PDF, JPG, PNG, WEBP, DOCX, TXT and CSV. Export DICOM scans as JPG or PNG first.",
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
                  className="pl-3 pr-1 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
                  title="Attach a medical image, X-ray, scan, PDF or report"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your symptoms or attach a medical file..."
                  className="flex-1 py-2 sm:py-3 px-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-hidden"
                />

                <button
                  type="submit"
                  disabled={isLoading || (!message.trim() && !attachedFile)}
                  className="mr-1.5 bg-linear-to-r from-[#2F80ED] to-[#14B8A6] text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-1 hover:opacity-95 transition-all cursor-pointer shadow-xs shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
          onClick={closeFilePreview}
        >
          <div
            className="bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 text-sm truncate">
                    {previewFile.name}
                  </h2>

                  <p className="text-xs text-gray-400">File Preview</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeFilePreview}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors shrink-0"
                title="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 min-h-0 bg-gray-100 overflow-auto flex items-center justify-center p-2 sm:p-4">
              {isPdfFile(previewFile) ? (
                <iframe
                  src={previewUrl}
                  title={`Preview of ${previewFile.name}`}
                  className="w-full h-full rounded-lg bg-white"
                />
              ) : isImageFile(previewFile) ? (
                <img
                  src={previewUrl}
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : isTextFile(previewFile) ? (
                <div className="w-full h-full bg-white rounded-lg overflow-auto">
                  {previewLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                      Loading file content...
                    </div>
                  ) : (
                    <pre className="p-4 sm:p-6 text-xs sm:text-sm text-gray-800 whitespace-pre-wrap wrap-break-word font-mono">
                      {previewText || "This file is empty."}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-14 h-14 text-gray-400 mx-auto mb-4" />

                  <h3 className="font-semibold text-gray-800">
                    Preview is not available for this format yet.
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    You can download this file to view it.
                  </p>

                  <a
                    href={previewUrl}
                    download={previewFile.name}
                    className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </a>
                </div>
              )}
            </div>

            {/* Preview Footer */}
            <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center shrink-0">
              <p className="text-xs text-gray-400 hidden sm:block">
                {previewFile.name}
              </p>

              <button
                type="button"
                onClick={closeFilePreview}
                className="ml-auto px-5 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
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
