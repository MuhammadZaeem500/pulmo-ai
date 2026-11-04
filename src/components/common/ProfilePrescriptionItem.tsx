import ProfilePrescriptionItemProps from "@/types/common.types";

export default function ProfilePrescriptionItem({
  medicine,
  prescribedDate,
  status,
}: ProfilePrescriptionItemProps) {
  return (
    <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl flex items-center justify-between">
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-0.5">{medicine}</h4>
        <p className="text-xs text-gray-500">Prescribed: {prescribedDate}</p>
      </div>
      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
        {status}
      </span>
    </div>
  );
}