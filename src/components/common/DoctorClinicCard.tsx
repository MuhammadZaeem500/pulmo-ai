"use client";

import React from "react";
import { Star, LucideIcon } from "lucide-react";
import { DoctorClinicCardProps } from "@/types/common.types";

export default function DoctorClinicCard({
  icon,
  title,
  subtitle,
  metaText,
  rating,
  availability,
  actionText,
  onActionClick,
}: DoctorClinicCardProps) {

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "function") {
      return React.createElement(icon as LucideIcon, { className: "w-5 h-5" });
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between w-full space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              {renderIcon()}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-0.5">{title}</h3>
            <p className="text-sm text-gray-600 mb-1">{subtitle}</p>
            <p className="text-sm text-gray-500 mb-2">{metaText}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="flex items-center justify-end gap-1 font-bold text-gray-900 mb-0.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>
          {availability && (
            <p className="text-xs text-gray-500">{availability}</p>
          )}
        </div>
      </div>

      {actionText && (
        <button
          onClick={onActionClick}
          className="w-full bg-[#2F80ED] hover:bg-[#2668c7] text-white font-medium py-3 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}