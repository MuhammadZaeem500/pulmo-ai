"use client";

import { useState } from "react";
import MedicineShapeCard from "@/components/common/MedicineShapeCard";
import MedicineColorCard from "@/components/common/MedicineColorCard";
import { Circle, Pill, Tablet, Disc } from "lucide-react";

export default function KnowYourMedicinePage() {
  const [selectedShape, setSelectedShape] = useState("Round Tablet");
  const [selectedColor, setSelectedColor] = useState("White");
  const [imprint, setImprint] = useState("");

  const shapes = [
    { label: "Round Tablet", icon: Circle },
    { label: "Oval Tablet", icon: Pill },
    { label: "Capsule", icon: Tablet },
    { label: "Oblong Tablet", icon: Pill },
    { label: "Softgel", icon: Disc },
  ];

  const colors = [
    { label: "White", colorBg: "border border-gray-200 bg-white" },
    { label: "Yellow", colorBg: "bg-yellow-300" },
    { label: "Blue", colorBg: "bg-blue-400" },
    { label: "Red", colorBg: "bg-rose-400" },
    { label: "Green", colorBg: "bg-emerald-300" },
    { label: "Pink", colorBg: "bg-pink-300" },
  ];

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Know Your Medicine</h1>
        <p className="text-gray-500 text-sm">Identify medicines by their visual characteristics</p>
      </div>

      {/* Select Medicine Shape Section */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-gray-900">Select Medicine Shape</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {shapes.map((item) => (
            <MedicineShapeCard
              key={item.label}
              label={item.label}
              icon={item.icon}
              isSelected={selectedShape === item.label}
              onClick={() => setSelectedShape(item.label)}
            />
          ))}
        </div>
      </div>

      {/* Select Color Section */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-gray-900">Select Color</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {colors.map((item) => (
            <MedicineColorCard
              key={item.label}
              label={item.label}
              colorBg={item.colorBg}
              isSelected={selectedColor === item.label}
              onClick={() => setSelectedColor(item.label)}
            />
          ))}
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-1">Additional Details (Optional)</h2>
          <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Imprint/Text on Medicine</p>
        </div>
        <input
          type="text"
          value={imprint}
          onChange={(e) => setImprint(e.target.value)}
          placeholder="e.g., IBU 200, A12, etc."
          className="w-full bg-white px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-hidden focus:border-blue-500 transition-all shadow-xs"
        />
      </div>
    </div>
  );
}