const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('ERROR: service-account.json not found!');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkHotels() {
  console.log('Checking "hotels" collection...');
  try {
    const snapshot = await db.collection('hotels').get();
    if (snapshot.empty) {
      console.log('No documents found in "hotels" collection.');
    } else {
      console.log(`Found ${snapshot.size} documents:`);
      snapshot.forEach(doc => {
        console.log(`\nDocument ID: ${doc.id}`);
        console.log('Data:', JSON.stringify(doc.data(), null, 2));
      });
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

checkHotels();
