"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, MessageSquare, Send, Search } from "lucide-react";
import {
  doctorChatService,
  ChatThread,
  DirectMessage,
} from "@/services/doctor-chat.service";

interface ChatWorkspaceProps {
  role: "PATIENT" | "DOCTOR";
  title: string;
  peerLabel: string;
}

export default function ChatWorkspace({
  role,
  title,
  peerLabel,
}: ChatWorkspaceProps) {
  const searchParams = useSearchParams();
  const initialPeerId =
    searchParams.get("peerId") || searchParams.get("doctorId");

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(
    initialPeerId,
  );
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingThreads(true);

    doctorChatService
      .getThreads()
      .then((list) => {
        if (!active) return;
        setThreads(list);
        if (initialPeerId && list.some((t) => t.peerId === initialPeerId)) {
          setSelectedPeerId(initialPeerId);
        } else if (initialPeerId) {
          const placeholder: ChatThread = {
            peerId: initialPeerId,
            name: peerLabel === "Doctor" ? "Doctor" : "Patient",
            subtitle: "Direct Consultation",
            lastMessage: "Start a conversation",
            lastMessageAt: null,
            hasRelation: true,
          };
          setThreads([placeholder, ...list]);
          setSelectedPeerId(initialPeerId);
        } else if (!selectedPeerId && list.length > 0) {
          setSelectedPeerId(list[0].peerId);
        }
      })
      .catch((err) => console.error("Failed to load chat threads:", err))
      .finally(() => {
        if (active) setLoadingThreads(false);
      });

    return () => {
      active = false;
    };
  }, [initialPeerId]);

  useEffect(() => {
    if (!selectedPeerId) return;

    let active = true;
    setLoadingMessages(true);

    const fetchMsgs = async (initial = false) => {
      try {
        const list = await doctorChatService.getMessages(selectedPeerId);
        if (active) setMessages(list);
      } catch (err) {
        if (initial) console.error("Failed to load messages:", err);
      } finally {
        if (initial && active) setLoadingMessages(false);
      }
    };

    fetchMsgs(true);
    const timer = setInterval(() => fetchMsgs(false), 4000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [selectedPeerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !selectedPeerId || sending) return;

    setSending(true);
    try {
      const saved = await doctorChatService.sendMessage({
        recipientId: selectedPeerId,
        content: trimmed,
      });
      setMessages((prev) => [...prev, saved]);
      setThreads((prev) =>
        prev.map((t) =>
          t.peerId === selectedPeerId
            ? {
                ...t,
                lastMessage: trimmed,
                lastMessageAt: saved.createdAt || new Date().toISOString(),
              }
            : t,
        ),
      );
      setText("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(search.toLowerCase()),
  );

  const activeThread = threads.find((t) => t.peerId === selectedPeerId) || null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Direct messages with your {peerLabel.toLowerCase()}s
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
        {/* Left: Conversations List */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col">
          <div className="p-3.5 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${peerLabel.toLowerCase()}s...`}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {loadingThreads ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-slate-400">
                No {peerLabel.toLowerCase()}s found.
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = thread.peerId === selectedPeerId;
                const initials = thread.name
                  .replace(/^Dr\.\s*/i, "")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <button
                    key={thread.peerId}
                    type="button"
                    onClick={() => setSelectedPeerId(thread.peerId)}
                    className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {initials || "CH"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {thread.name}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {thread.subtitle}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Conversation */}
        <div className="md:col-span-8 flex flex-col">
          {!activeThread ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs font-medium">
                Select a {peerLabel.toLowerCase()} to start messaging.
              </p>
            </div>
          ) : (
            <>
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {activeThread.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {activeThread.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {loadingMessages ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    No messages yet. Say hello to {activeThread.name}.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderRole === role;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                            isMine
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-2xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <span
                            className={`block text-[10px] mt-1 ${
                              isMine ? "text-blue-100" : "text-slate-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="p-3.5 border-t border-slate-100 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Message ${activeThread.name}...`}
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={sending || !text.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {sending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}