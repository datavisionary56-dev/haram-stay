"use client";
import { useEffect, useState } from "react";

const images = ["/images/makkah.jpg", "/images/madinah.jpg"];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full">
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage: `url('${src}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-4 pt-32 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 max-w-3xl text-4xl font-extrabold tracking-wide text-white font-serif sm:text-5xl">
          Your Gateway to Spiritual Comfort
        </h1>
        <p className="max-w-xl text-base text-white/80">
          Book your stay near Al-Haram with confidence and elegance.
        </p>
      </div>
    </section>
  );
}
