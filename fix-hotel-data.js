const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'service-account.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fixHotel() {
  const docId = 'MPuGJyHTHypJ7jJfs51e';
  const docRef = db.collection('hotels').doc(docId);

  console.log(`Updating document ${docId} with VALID image URL...`);
  
  await docRef.update({
    // Using a high-quality Unsplash image of Makkah/Hotel
    images: [
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1000&auto=format&fit=crop"
    ],
    updatedAt: new Date().toISOString()
  });

  console.log('Document updated successfully with Unsplash image!');
}

fixHotel().catch(console.error);
