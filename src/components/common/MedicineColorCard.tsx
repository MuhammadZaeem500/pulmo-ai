import { MedicineColorCardProps } from '@/types/common.types';

export default function MedicineColorCard({ 
  label,
  colorBg,
  isSelected = false,
  onClick,
}: MedicineColorCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border transition-all flex flex-col items-center justify-center gap-4 cursor-pointer h-32 ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 shadow-xs'
      }`}
    >
      <div className={`w-8 h-8 rounded-full shadow-xs ${colorBg}`} />
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </button>
  );
}