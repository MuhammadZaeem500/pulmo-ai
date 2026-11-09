"use client";

import { useState } from "react";
import ChatHistoryItem from "@/components/common/ChatHistoryItem";
import { Plus, Paperclip, Send, History, X } from "lucide-react";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState("1");
  const [showHistory, setShowHistory] = useState(false);

  const chatHistory = [
    { id: "1", title: "Respiratory Symptoms...", date: "May 28, 2026" },
    { id: "2", title: "Chest Pain Consultation", date: "May 20, 2026" },
    { id: "3", title: "Breathing Difficulty Anal...", date: "May 15, 2026" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative">
     
      {/* Chat History Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 sm:w-80 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
        showHistory ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
      }`}>
       
        <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between gap-2">
          <button
            onClick={() => {}}
            className="flex-1 bg-linear-to-r from-[#2F80ED] to-[#14B8A6] text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-all cursor-pointer text-xs sm:text-sm"
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

        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3 px-1">
            Chat History
          </p>
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <ChatHistoryItem
                key={chat.id}
                title={chat.title}
                date={chat.date}
                isActive={activeChat === chat.id}
                onClick={() => {
                  setActiveChat(chat.id);
                  setShowHistory(false);
                }}
              />
            ))}
          </div>
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
            <h1 className="text-base sm:text-xl font-bold text-gray-900 mb-0.5">AI Healthcare Chatbot</h1>
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
          <div className="flex items-start gap-3 max-w-2xl">
            <div className="bg-white rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xs border border-gray-100 text-gray-800 text-xs sm:text-sm leading-relaxed space-y-2">
              <p>
                Hello! I&apos;m your healthcare assistant. How can I help you today? You can describe your symptoms, upload medical scans, or ask health-related questions.
              </p>
              <span className="text-[10px] sm:text-xs text-gray-400 block pt-1">18:21</span>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-5 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto space-y-2">
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-xs focus-within:border-blue-500 transition-all">
              <button
                type="button"
                className="pl-3 sm:pl-4 pr-1.5 sm:pr-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
                title="Upload scan or file"
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
                className="mr-1.5 sm:mr-2 bg-linear-to-r from-[#2F80ED] to-[#14B8A6] text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <span>Send</span> <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-center text-[10px] sm:text-xs text-gray-400">
              You can upload X-rays, ultrasound scans, or other medical images for analysis
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}