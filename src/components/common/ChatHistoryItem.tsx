import React from 'react';
import { MessageSquare } from 'lucide-react';
import  ChatHistoryItemProps  from '@/types/common.types';

export default function ChatHistoryItem({
  title,
  date,
  isActive = false,
  onClick,
}: ChatHistoryItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
        isActive
          ? 'bg-blue-50 text-blue-600 border border-blue-100'
          : 'hover:bg-gray-50 text-gray-700'
      }`}
    >
      <MessageSquare className="w-4 h-4 mt-1 shrink-0 text-gray-400" />
      <div className="overflow-hidden">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{date}</p>
      </div>
    </button>
  );
}