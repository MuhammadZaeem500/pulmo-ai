"use client";

import { useState } from "react";
import ChatHistoryItem from "@/components/common/ChatHistoryItem";
import { Plus, Paperclip, Send } from "lucide-react";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState("1");

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
    <div className="flex h-full bg-white overflow-hidden">
     
      <div className="w-80 border-r border-gray-100 flex flex-col bg-white">
       
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => {}}
            className="w-full bg-gradient-to-r from-[#2F80ED] to-[#14B8A6] text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

       
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3 px-1">
            Chat History
          </p>
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <ChatHistoryItem
                key={chat.id}
                title={chat.title}
                date={chat.date}
                isActive={activeChat === chat.id}
                onClick={() => setActiveChat(chat.id)}
              />
            ))}
          </div>
        </div>
      </div>

     
      <div className="flex-1 flex flex-col bg-white">
       
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 mb-1">AI Healthcare Chatbot</h1>
          <p className="text-gray-500 text-sm">
            Ask questions, discuss symptoms, and upload scans for AI-powered insights
          </p>
        </div>

       
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
          <div className="flex items-start gap-3 max-w-2xl">
            <div className="bg-white rounded-2xl rounded-tl-sm p-5 shadow-xs border border-gray-100 text-gray-800 text-sm leading-relaxed space-y-2">
              <p>
                Hello! I'm your healthcare assistant. How can I help you today? You can describe your symptoms, upload medical scans, or ask health-related questions.
              </p>
              <span className="text-xs text-gray-400 block pt-1">18:21</span>
            </div>
          </div>
        </div>

       
        <div className="p-6 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto space-y-2">
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-xs focus-within:border-blue-500 transition-all">
              <button
                type="button"
                className="pl-4 pr-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title="Upload scan or file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your symptoms or ask a question..."
                className="flex-1 py-3.5 pr-4 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-hidden"
              />

              <button
                type="submit"
                className="mr-2 bg-gradient-to-r from-[#2F80ED] to-[#14B8A6] text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow-xs"
              >
                Send <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-center text-xs text-gray-400">
              You can upload X-rays, ultrasound scans, or other medical images for analysis
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}