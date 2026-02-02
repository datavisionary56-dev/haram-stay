
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function checkPackages() {
  const hotelId = "TRCM2UqLL30Y5c0Q7q6s"; // Swissotel
  const docRef = db.collection("hotels").doc(hotelId);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.log("Hotel not found");
    return;
  }

  const data = doc.data();
  if (data.pricingRules && data.pricingRules.ranges) {
    console.log("Pricing Ranges:");
    data.pricingRules.ranges.forEach((range, index) => {
      console.log(`[${index}] Note: '${range.notes}'`);
    });
  } else {
    console.log("No pricing rules found.");
  }
}

checkPackages();
