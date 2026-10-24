// src/components/common/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  valueColor?: string;
}

export default function MetricCard({
  title,
  value,
  valueColor = 'text-gray-900',
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}