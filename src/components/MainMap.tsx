"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapHotel {
  lat?: number;
  lng?: number;
  name?: string;
}

interface MainMapProps {
  liveHotels?: MapHotel[];
}

export default function MainMap({ liveHotels = [] }: MainMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // 1. التأكد من أننا في المتصفح وأن الحاوية موجودة
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // 2. تنظيف الخريطة القديمة إذا كانت موجودة لمنع خطأ appendChild
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // 3. إنشاء أيقونة مخصصة (نقطة ذهبية مشعة) باستخدام CSS فقط لضمان الظهور
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="
        background-color: #D4AF37;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 15px #D4AF37;
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    try {
      console.log("Initializing Map with hotels:", liveHotels);
      const map = L.map(mapContainerRef.current, {
        center: [21.4225, 39.8262], // إحداثيات الكعبة المشرفة
        zoom: 15,
        zoomControl: false,
        layers: [
          L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: "Haram Stay"
          })
        ]
      });

      // 5. إضافة زر التحكم بالزوم في مكان أنيق
      L.control.zoom({ position: "bottomright" }).addTo(map);

        // 6. إضافة علامات الفنادق إذا وجدت
      if (liveHotels.length > 0) {
        const markers: L.Marker[] = [];
        liveHotels.forEach((hotel) => {
          // تحويل صارم للأرقام لضمان عدم حدوث أخطاء إذا وصلت كنصوص
          // ندعم أيضاً latitude/longitude كاحتياط
          const lat = Number(hotel.lat);
          const lng = Number(hotel.lng);

          if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            console.log(`Adding marker at: ${lat}, ${lng}`);
            const marker = L.marker([lat, lng], { icon: customIcon })
              .addTo(map)
              .bindPopup(`<b style="color:black; font-size:14px;">${hotel.name}</b>`)
              .bindTooltip(hotel.name || "فندق", { 
                permanent: true, 
                direction: "top",
                className: "bg-white text-black px-2 py-1 rounded shadow-lg font-bold text-xs"
              });
            markers.push(marker);
          }
        });

        // تحسين: توجيه الكاميرا لتشمل جميع الفنادق
        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
      } else {
        console.log("Waiting for hotels data...");
      }

      mapInstanceRef.current = map;
    } catch (error) {
      console.error("Leaflet initialization error:", error);
    }

    // 7. التنظيف النهائي عند إغلاق الصفحة
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [liveHotels]);

  return (
    <div className="relative w-full h-full min-h-[450px]">
      {/* الحاوية الفعلية للخريطة */}
      <div 
        ref={mapContainerRef} 
        id="map-container"
        className="w-full h-full z-10"
        style={{ background: "#09090b" }}
      />
      
      {/* طبقة فنية فوق الخريطة لتعزيز المظهر الليلي */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] z-20"></div>
    </div>
  );
}