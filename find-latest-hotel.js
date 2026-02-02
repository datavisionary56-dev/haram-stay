
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function findLatestHotel() {
  const hotelsRef = db.collection("hotels");
  // Order by createdAt desc to get the latest
  const snapshot = await hotelsRef.orderBy("createdAt", "desc").limit(1).get();

  if (snapshot.empty) {
    // If no createdAt, try to list all and maybe infer or just show the last few
    console.log("No documents found with createdAt. Listing all...");
    const allSnaps = await hotelsRef.get();
    allSnaps.forEach(doc => {
        console.log(`ID: ${doc.id} | Name: ${doc.data().name} | CreatedAt: ${doc.data().createdAt}`);
    });
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log("LATEST HOTEL FOUND:");
    console.log("ID:", doc.id);
    console.log("Name:", data.name);
    console.log("City/Location:", data.city || data.location);
    console.log("CreatedAt:", data.createdAt ? data.createdAt.toDate() : "N/A");
    console.log("Current Description:", data.description);
  });
}

findLatestHotel();
