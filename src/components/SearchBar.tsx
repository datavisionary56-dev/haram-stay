"use client";
import { useState } from "react";

export default function SearchBar() {
  const [destination, setDestination] = useState("Makkah");
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);
  const [rooms, setRooms] = useState<number>(1);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <form
        dir="rtl"
        onSubmit={submitSearch}
        className="grid w-full grid-cols-1 gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg sm:grid-cols-[1.2fr,1fr,1fr,0.8fr,0.8fr,auto] dark:border-white/10 dark:bg-white/5 font-cairo shadow-2xl"
      >
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5 focus-within:border-[#D4AF37]/50 transition-colors">
          <span className="text-[#D4AF37]">📍</span>
          <label className="sr-only">الوجهة</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none font-sans cursor-pointer"
          >
            <option value="Makkah" className="text-black">
              مكة المكرمة
            </option>
            <option value="Madinah" className="text-black">
              المدينة المنورة
            </option>
          </select>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5 focus-within:border-[#D4AF37]/50 transition-colors">
          <label className="sr-only">تاريخ الوصول</label>
          <input
            type="text"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full appearance-none bg-transparent text-sm text-white outline-none placeholder:text-white/60 font-sans text-right"
            placeholder="تاريخ الوصول"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5 focus-within:border-[#D4AF37]/50 transition-colors">
          <label className="sr-only">تاريخ المغادرة</label>
          <input
            type="text"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full appearance-none bg-transparent text-sm text-white outline-none placeholder:text-white/60 font-sans text-right"
            placeholder="تاريخ المغادرة"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5 focus-within:border-[#D4AF37]/50 transition-colors">
          <label className="sr-only">الضيوف</label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value || "1", 10))}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full bg-transparent text-sm text-white outline-none font-sans"
            placeholder="الضيوف"
          />
          <span className="text-xs text-white/80 whitespace-nowrap">
            {guests === 1 ? "ضيف" : "ضيوف"}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5 focus-within:border-[#D4AF37]/50 transition-colors">
          <label className="sr-only">الغرف</label>
          <input
            type="number"
            min={1}
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value || "1", 10))}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full bg-transparent text-sm text-white outline-none font-sans"
            placeholder="الغرف"
          />
          <span className="text-xs text-white/80 whitespace-nowrap">
            {rooms === 1 ? "غرفة" : "غرف"}
          </span>
        </div>

        <button
          type="submit"
          className="col-span-1 rounded-xl bg-[#D4AF37] px-8 py-2 text-sm font-bold text-black hover:bg-[#b5952f] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] sm:col-auto"
        >
          بحث
        </button>
      </form>
    </div>
  );
}
