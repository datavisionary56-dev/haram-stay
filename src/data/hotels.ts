export interface Hotel {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  latitude: number;
  longitude: number;
}

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "فندق فيرمونت مكة",
    image: "/images/fairmont/fairmont_1.png",
    price: 2500,
    description: "يقع فندق فيرمونت مكة داخل برج ساعة مكة الملكي، ويوفر إطلالات خلابة على الكعبة المشرفة والحرم المكي الشريف مع خدمات فاخرة وضيافة استثنائية.",
    latitude: 21.4187,
    longitude: 39.8257
  },
  {
    id: "2",
    name: "فندق رافلز مكة",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    price: 2200,
    description: "يتميز فندق رافلز مكة بجو من الهدوء والروحانية، ويوفر أجنحة فاخرة واسعة مع خدمة خادم شخصي متميزة وإطلالات مباشرة على المسجد الحرام.",
    latitude: 21.4192,
    longitude: 39.8265
  },
  {
    id: "3",
    name: "فندق قصر مكة رافلز",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    price: 1800,
    description: "تجربة إقامة لا تُنسى تمزج بين الفخامة العصرية والتصاميم الإسلامية التقليدية في قلب مكة المكرمة.",
    latitude: 21.4200,
    longitude: 39.8270
  }
];