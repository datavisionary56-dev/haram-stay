const { Storage } = require('@google-cloud/storage');
const path = require('path');

async function listBuckets() {
  try {
    const keyFilePath = path.join(__dirname, 'service-account.json');
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;

    const storage = new Storage();
    
    console.log('Attempting to list buckets for the project associated with service-account.json...');
    const [buckets] = await storage.getBuckets();

    if (buckets.length === 0) {
        console.log('No buckets found in this project.');
    } else {
        console.log('Buckets found:');
        buckets.forEach(bucket => {
            console.log(`- ${bucket.name}`);
        });
    }

  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

listBuckets();
