const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// 1. Setup Credentials (Auto-detect 'service-account.json' in root)
const keyFilePath = path.join(__dirname, 'service-account.json');
if (fs.existsSync(keyFilePath)) {
    console.log('🔑 Found service-account.json, using it for authentication.');
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
} else {
    console.log('⚠️ No service-account.json found in root directory.');
    console.log('   Make sure you have authenticated using "gcloud auth application-default login" OR placed your key file here.');
}

// 2. Bucket Name (Must match exactly what's in Firebase Console -> Storage)
// REMOVE "gs://" prefix if present.
const bucketName = 'haram-stay-free.firebasestorage.app';

async function configureCors() {
  console.log(`\n🚀 Configuring CORS for bucket: [${bucketName}]...`);

  try {
    // Explicitly pass projectId if needed, but usually inferred from key file
    const storage = new Storage();
    
    // Check if bucket exists (basic check)
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();
        if (!exists) {
            console.log(`⚠️ Bucket "${bucketName}" not found. Attempting to create it...`);
            try {
                await storage.createBucket(bucketName, {
                    location: 'US-CENTRAL1',
                });
                console.log(`✅ Bucket "${bucketName}" created successfully!`);
            } catch (createError) {
                console.error(`❌ Failed to create bucket automatically: ${createError.message}`);
                console.log('Checking for other available buckets in this project...');
                const [buckets] = await storage.getBuckets();
                if (buckets.length === 0) {
                    console.log('⚠️ NO BUCKETS FOUND in this project.');
                    console.log('👉 ACTION REQUIRED: Go to Firebase Console -> Storage -> "Get Started" to create your storage bucket manually.');
                    return;
                } else {
                    console.log('⚠️ Available buckets:');
                    buckets.forEach(b => console.log(`   - ${b.name}`));
                    console.log(`\n👉 Please update "bucketName" in this script to one of the above.`);
                    return;
                }
            }
        } else {
            console.log(`✅ Bucket "${bucketName}" found.`);
        }

    const corsConfiguration = [
      {
        origin: [
            'https://haram-stay.vercel.app', 
            'http://localhost:3000',
            'https://sacreddeals.firebaseapp.com'
        ],
        method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
        maxAgeSeconds: 3600,
        responseHeader: [
            'Content-Type', 
            'Authorization', 
            'Content-Length', 
            'User-Agent', 
            'x-goog-resumable',
            'x-firebase-storage-version'
        ],
      },
    ];

    await bucket.setCorsConfiguration(corsConfiguration);

    console.log('✅ CORS configuration updated successfully!');
    console.log('   - Allowed Origins:', corsConfiguration[0].origin);
    console.log('   - Target Bucket:', bucketName);
    console.log('\nNOTE: It may take a few minutes for changes to propagate globally.');
    
  } catch (error) {
    console.error('\n❌ Error configuring CORS:', error.message);
    
    if (error.code === 404 || error.message.includes('not exist')) {
         console.log('\n🔎 Troubleshooting "Bucket not found":');
         console.log('1. Check if the bucket name is correct in fix-cors.js (currently: ' + bucketName + ')');
         console.log('2. Verify that your Service Account/User has "Storage Admin" role.');
         console.log('3. Ensure you are authenticated with the correct Project ID.');
    } else if (error.message.includes('Could not load the default credentials')) {
        console.log('\n💡 Tip: You need to authenticate.');
        console.log('   Download your Service Account Key from Firebase Console -> Project Settings -> Service accounts');
        console.log('   Rename it to "service-account.json" and place it in this folder.');
    }
  }
}

configureCors();
