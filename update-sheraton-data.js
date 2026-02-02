const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function updateSheraton() {
  const hotelId = "Z3G4Km8M5Tq7hquhtFau"; // Found in previous step
  const hotelRef = db.collection("hotels").doc(hotelId);

  const description = `
استمتع بروحانية الجوار في فندق شيراتون مكة جبل الكعبة 🕋✨.

يتميز الفندق بموقعه الاستراتيجي الذي يجمع بين الفخامة والسكينة، حيث يوفر إطلالات خلابة على المسجد الحرام 🕌.
يتمتع ضيوفنا بميزة استثنائية عبر جسر مشاة خاص يوصلك مباشرة إلى توسعة الملك عبدالله بالحرم المكي، لتسهيل أداء مناسكك بكل يسر وسهولة 🚶‍♂️💫.

✨ **مميزات الفندق:**
• 🛏️ غرف عصرية بتصاميم إسلامية راقية تضمن لك الراحة التامة بعد عناء العمرة.
• 🍽️ خيارات طعام متنوعة في مطاعمنا الفاخرة التي تقدم أشهى المأكولات العالمية والشرقية.
• 🕌 إطلالات روحانية مباشرة تأسر القلوب.
• 🤝 خدمة ضيافة عربية أصيلة تليق بضيوف الرحمن.

شيراتون مكة.. حيث تجتمع الرفاهية مع قدسية المكان. 🤲💎
  `.trim();

  const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sheraton_Hotels_and_Resorts_Logo.svg/1200px-Sheraton_Hotels_and_Resorts_Logo.svg.png";

  try {
    await hotelRef.update({
      description: description,
      logo: logoUrl,
      nameEn: "Sheraton Makkah Jabal Al Kaaba Hotel",
      stars: 5 // Ensure stars are set correctly as it's a 5-star hotel
    });
    console.log("Sheraton Hotel updated successfully!");
  } catch (error) {
    console.error("Error updating hotel:", error);
  }
}

updateSheraton();
