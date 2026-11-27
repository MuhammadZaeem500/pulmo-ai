"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  title: string;
  description: string;
  details?: string[];
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  description,
  details,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`${
          isDangerous
            ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
            : "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
        } rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full border`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div
              className={`${
                isDangerous ? "bg-red-100 dark:bg-red-900" : "bg-blue-100 dark:bg-blue-900"
              } p-3 rounded-lg flex-shrink-0`}
            >
              <AlertTriangle
                className={`w-6 h-6 ${
                  isDangerous
                    ? "text-red-600 dark:text-red-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              />
            </div>
            <div className="flex-1">
              <h2
                className={`text-lg font-bold ${
                  isDangerous
                    ? "text-red-900 dark:text-red-100"
                    : "text-blue-900 dark:text-blue-100"
                }`}
              >
                {title}
              </h2>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p
          className={`text-sm mb-4 ${
            isDangerous
              ? "text-red-700 dark:text-red-200"
              : "text-blue-700 dark:text-blue-200"
          }`}
        >
          {description}
        </p>

        {/* Details List */}
        {details && details.length > 0 && (
          <div className="bg-black/10 dark:bg-black/20 rounded-lg p-4 mb-4">
            <p
              className={`text-xs font-semibold mb-2 ${
                isDangerous
                  ? "text-red-800 dark:text-red-300"
                  : "text-blue-800 dark:text-blue-300"
              }`}
            >
              You will lose:
            </p>
            <ul className="space-y-1">
              {details.map((detail, index) => (
                <li
                  key={index}
                  className={`text-xs flex items-center gap-2 ${
                    isDangerous
                      ? "text-red-700 dark:text-red-200"
                      : "text-blue-700 dark:text-blue-200"
                  }`}
                >
                  <span className="w-1 h-1 rounded-full bg-current" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
