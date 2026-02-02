const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'service-account.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const storage = admin.storage();

async function createBucket() {
  const bucketName = 'haram-stay-free.firebasestorage.app';
  try {
    console.log(`Creating bucket: ${bucketName}...`);
    await storage.bucket(bucketName).create({
        location: 'asia-south1', // Choosing a region close to Saudi Arabia/ME
    });
    console.log('Bucket created successfully!');
  } catch (error) {
    console.error('Error creating bucket:', error);
    // If it fails, maybe try to list existing buckets to see what we have
    try {
        const [buckets] = await storage.getBuckets();
        console.log('Available buckets:');
        buckets.forEach(b => console.log(b.name));
    } catch (listError) {
        console.error('Error listing buckets:', listError);
    }
  }
}

createBucket();
