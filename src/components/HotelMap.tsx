"use client";
import React from "react";

interface Props {
  latitude?: number;
  longitude?: number;
  hotelName?: string;
}

export default function HotelMap({ latitude, longitude, hotelName }: Props) {
  // إحداثيات الفندق (أو إحداثيات مكة الافتراضية)
  const lat = latitude || 21.4187;
  const lng = longitude || 39.8257;

  /**
   * شرح الرموز في الرابط:
   * t=k : تفعيل وضع القمر الصناعي (Satellite) لتظهر المباني 3D
   * z=18: مستوى زووم قريب جداً لتفاصيل المباني
   */
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=18&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
      <iframe
        width="100%"
        height="100%"
        title={hotelName}
        style={{ border: 0 }} 
        src={mapSrc}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}