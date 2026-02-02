
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function updateHotel() {
  const hotelId = "TRCM2UqLL30Y5c0Q7q6s"; // Found in previous step
  const hotelRef = db.collection("hotels").doc(hotelId);

  const description = `يقع فندق سويس أوتيل المقام مكة في برج مرتفع في قلب العالم الإسلامي، ويتميز بإطلالات على المدينة المقدسة. والفندق جزء من مجمع أبراج البيت الرائع ويواجه الكعبة المشرفة ويتيح الوصول المباشر إلى المسجد الحرام من شارع إبراهيم الخليل ومدخل نفق أم القرى. كما تتوفر إمكانية أخرى للدخول المباشر إلى الفندق من مجمع أبراج البيت.

تتميز الغرف والأجنحة البالغ عددها 1,624 بأجواء دافئة، ويتميز العديد منها بإطلالات رائعة على الكعبة المشرفة.

يتميز مطعم Al Khairat وصالة Masharif للشاي بأجواء منعشة مع خدمة ذات جودة عالية، بالإضافة إلى تقديم مجموعة متنوعة من المأكولات الشهية الدولية والشرقية.

لضمان تجربة تسوق مريحة في مكة المكرمة، يوفر الفندق إمكانية الوصول المباشر إلى مركز التسوق الموجود في مجمع أبراج البيت. ويعد مطار الملك عبد العزيز الدولي أقرب المطارات من مكان الإقامة، حيث يقع على مسافة 75 كم.`;

  const logoUrl = "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Swissotel_Hotels_and_Resorts_logo.svg/1200px-Swissotel_Hotels_and_Resorts_logo.svg.png";

  try {
    await hotelRef.update({
      description: description,
      logo: logoUrl,
      nameEn: "Swissôtel Al Maqam Makkah"
    });
    console.log("Hotel updated successfully!");
  } catch (error) {
    console.error("Error updating hotel:", error);
  }
}

updateHotel();
