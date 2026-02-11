"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface Translations {
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  makkahHotels: string;
  medinaHotels: string;
  medinaCentral: string;
  medinaOuter: string;
  frontRow: string;
  ajyad: string;
  footerRights: string;
  live: string;
  crowd: string;
  weather: string;
  viewAll: string;
  bookNow: string;
  night: string;
  currency: string;
  breakfast: string;
  verified: string;
}

const translations: Record<Language, Translations> = {
  ar: {
    heroTitle: "إقامة تليق بضيوف الرحمن",
    heroSubtitle: "أسعار خاصة وحصرية لموسم رمضان والعمرة 1447هـ",
    searchPlaceholder: "ابحث عن فندق...",
    makkahHotels: "فنادق مكة المكرمة",
    medinaHotels: "فنادق المدينة المنورة",
    medinaCentral: "فنادق المدينة - المركزية",
    medinaOuter: "فنادق المدينة - خارج المركزية",
    frontRow: "فنادق الصف الأول",
    ajyad: "فنادق إبراهيم الخليل وأجياد",
    footerRights: "جميع الحقوق محفوظة لخدمة ضيوف الرحمن",
    live: "مباشر",
    crowd: "حالة الزحام",
    weather: "الطقس",
    viewAll: "عرض الكل",
    bookNow: "احجز الآن",
    night: "ليلة",
    currency: "ريال",
    breakfast: "شامل الإفطار",
    verified: "موثوق"
  },
  en: {
    heroTitle: "Makkah & Madinah Hotels - Season 1447 AH",
    heroSubtitle: "Exclusive prices for Ramadan & Umrah Season 1447 AH",
    searchPlaceholder: "Search for a hotel...",
    makkahHotels: "Makkah Hotels",
    medinaHotels: "Madinah Hotels",
    medinaCentral: "Madinah Hotels - Central",
    medinaOuter: "Madinah Hotels - Outer",
    frontRow: "Front Row Hotels",
    ajyad: "Ibrahim Al Khalil & Ajyad Hotels",
    footerRights: "All rights reserved for serving the guests of Rahman",
    live: "LIVE",
    crowd: "Crowd Status",
    weather: "Weather",
    viewAll: "View All",
    bookNow: "Book Now",
    night: "Night",
    currency: "SAR",
    breakfast: "Breakfast Included",
    verified: "Verified"
  }
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language], dir }}>
      <div dir={dir} className={language === 'en' ? 'font-sans' : 'font-cairo'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
