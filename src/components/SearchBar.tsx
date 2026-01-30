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
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 mx-auto flex w-full max-w-5xl justify-center px-4 sm:px-6 lg:px-8">
      <form
        lang="en-US"
        dir="ltr"
        onSubmit={submitSearch}
        className="pointer-events-auto grid w-full grid-cols-1 gap-2 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-lg sm:grid-cols-[1.2fr,1fr,1fr,0.8fr,auto] dark:border-white/10 dark:bg-white/5"
      >
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <span className="text-gold">★</span>
          <label className="sr-only">Destination</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none font-sans"
          >
            <option value="Makkah" className="text-black">
              Makkah
            </option>
            <option value="Madinah" className="text-black">
              Madinah
            </option>
          </select>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <label className="sr-only">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            lang="en-US"
            dir="ltr"
            className="w-full appearance-none bg-transparent text-sm text-white outline-none placeholder:text-white/60 font-sans"
            placeholder="Add Dates"
          />
          {checkIn && (
            <span className="text-xs text-white/80">
              {new Date(checkIn).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <label className="sr-only">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            lang="en-US"
            dir="ltr"
            className="w-full appearance-none bg-transparent text-sm text-white outline-none placeholder:text-white/60 font-sans"
            placeholder="Add Dates"
          />
          {checkOut && (
            <span className="text-xs text-white/80">
              {new Date(checkOut).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <label className="sr-only">Guests</label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value || "1", 10))}
            inputMode="numeric"
            pattern="[0-9]*"
            lang="en-US"
            dir="ltr"
            className="w-full bg-transparent text-sm text-white outline-none font-sans"
            placeholder="Guests"
          />
          <span className="text-xs text-white/80">
            {guests.toLocaleString("en-US")} {guests === 1 ? "Guest" : "Guests"}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <label className="sr-only">Rooms</label>
          <input
            type="number"
            min={1}
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value || "1", 10))}
            inputMode="numeric"
            pattern="[0-9]*"
            lang="en-US"
            dir="ltr"
            className="w-full bg-transparent text-sm text-white outline-none font-sans"
            placeholder="Rooms"
          />
          <span className="text-xs text-white/80">
            {rooms.toLocaleString("en-US")} {rooms === 1 ? "Room" : "Rooms"}
          </span>
        </div>

        <button
          type="submit"
          className="col-span-1 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 hover:ring-2 hover:ring-gold sm:col-auto"
        >
          Search
        </button>
      </form>
    </div>
  );
}
