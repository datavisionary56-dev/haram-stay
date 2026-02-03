"use client";
import { useState, useEffect } from "react";
import { FaFilter, FaStar, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  maxDistance: number;
  stars: number[];
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [maxDistance, setMaxDistance] = useState(20000); // Default to max range (20km)
  const [selectedStars, setSelectedStars] = useState<number[]>([]);

  // Apply filters when any state changes
  useEffect(() => {
    onFilterChange({
      minPrice: minPrice === "" ? 0 : Number(minPrice),
      maxPrice: maxPrice === "" ? Infinity : Number(maxPrice),
      maxDistance,
      stars: selectedStars
    });
  }, [minPrice, maxPrice, maxDistance, selectedStars, onFilterChange]);

  const toggleStar = (star: number) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter(s => s !== star));
    } else {
      setSelectedStars([...selectedStars, star]);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-[#D4AF37] border-b border-white/10 pb-4">
        <FaFilter />
        <h3 className="text-xl font-bold">تصفية النتائج</h3>
      </div>

      <div className="space-y-8">
        {/* Price Range */}
        <div>
          <label className="flex items-center gap-2 text-white font-medium mb-4">
            <FaMoneyBillWave className="text-[#D4AF37]" />
            <span>السعر (ريال)</span>
          </label>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#D4AF37] outline-none min-w-0"
              placeholder="من"
            />
            <span className="text-white">-</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-[#D4AF37] outline-none min-w-0"
              placeholder="إلى"
            />
          </div>
        </div>

        {/* Distance to Haram */}
        <div>
          <label className="flex items-center gap-2 text-white font-medium mb-4">
            <FaMapMarkerAlt className="text-[#D4AF37]" />
            <span>البعد عن الحرم (متر)</span>
          </label>
          <input
            type="range"
            min="0"
            max="20000"
            step="100"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full accent-[#D4AF37] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer relative z-10"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0 متر</span>
            <span className="text-[#D4AF37] font-bold">{maxDistance} متر</span>
            <span>20 كم</span>
          </div>
        </div>

        {/* Stars */}
        <div>
          <label className="flex items-center gap-2 text-white font-medium mb-4">
            <FaStar className="text-[#D4AF37]" />
            <span>عدد النجوم</span>
          </label>
          <div className="flex flex-col gap-2">
            {[5, 4, 3].map((star) => (
              <label key={star} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedStars.includes(star)}
                  onChange={() => toggleStar(star)}
                  className="w-4 h-4 rounded border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37] bg-gray-800"
                />
                <div className="flex text-[#D4AF37]">
                  {[...Array(star)].map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
