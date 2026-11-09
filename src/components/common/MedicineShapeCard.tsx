import { MedicineShapeCardProps } from '@/types/common.types';
import { isValidElement } from 'react';

export default function MedicineShapeCard({
  label,
  icon: Icon,
  isSelected = false,
  onClick,
}: MedicineShapeCardProps) {
  const renderIcon = () => {
    if (!Icon) return null;
    if (isValidElement(Icon)) return Icon;

    const Component = Icon as React.ElementType;
    return <Component className="w-6 h-6" />;
  };

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 border transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 lg:gap-4 cursor-pointer h-24 sm:h-28 lg:h-32 w-full ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 shadow-xs'
      }`}
    >
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-xs flex items-center justify-center text-blue-600 shrink-0">
        {renderIcon()}
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-900 text-center truncate max-w-full">{label}</span>
    </button>
  );
}