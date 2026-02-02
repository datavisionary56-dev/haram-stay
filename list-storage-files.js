const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'service-account.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'haram-stay-free.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function listFiles() {
  try {
    console.log('Listing files in bucket:', bucket.name);
    const [files] = await bucket.getFiles({ prefix: 'hotels/' });
    
    if (files.length === 0) {
      console.log('No files found in "hotels/" directory.');
      return;
    }

    console.log('Found files:');
    files.forEach(file => {
      console.log(file.name);
    });
  } catch (error) {
    console.error('Error listing files:', error);
  }
}

listFiles();
