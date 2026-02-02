const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function findHotel() {
  const hotelsRef = db.collection("hotels");
  const snapshot = await hotelsRef.get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    // Search for Sheraton or شيراتون
    if (data.name && (data.name.includes("Sheraton") || data.name.includes("شيراتون"))) {
      console.log("Found Hotel ID:", doc.id);
      console.log("Name:", data.name);
      console.log("Current Description:", data.description);
    }
  });
}

findHotel();
