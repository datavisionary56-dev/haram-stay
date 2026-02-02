import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import path from 'path';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Storage with the service account (Only works if file exists and billing is enabled)
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
let storage: Storage | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bucket: any = null;
const bucketName = 'haram-stay-free.firebasestorage.app';

if (fs.existsSync(serviceAccountPath)) {
    try {
        storage = new Storage({
            keyFilename: serviceAccountPath,
            projectId: 'haram-stay-free',
        });
        bucket = storage.bucket(bucketName);
    } catch (e) {
        console.warn("Failed to initialize Google Cloud Storage:", e);
    }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    // 1. Try Cloudinary (Best for Vercel/Production)
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        console.log(`Attempting Cloudinary upload for: ${fileName}`);
        try {
            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'haram-stay-hotels', public_id: fileName.replace(/\.[^/.]+$/, "") },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result!);
                    }
                );
                uploadStream.end(buffer);
            });
            
            const publicUrl = result.secure_url;
            console.log(`Cloudinary upload successful: ${publicUrl}`);
            return NextResponse.json({ url: publicUrl });
        } catch (cloudinaryError: unknown) {
             console.error('Cloudinary upload failed:', cloudinaryError);
             // Fall through to next method
        }
    }

    // 2. Try Firebase Storage (If Configured & Billing Enabled)
    if (bucket) {
        try {
            console.log(`Starting Firebase server-side upload for: ${fileName}`);
            const fileRef = bucket.file(fileName);
    
            await fileRef.save(buffer, {
              metadata: { contentType: file.type },
            });
    
            await fileRef.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
            console.log(`Firebase upload successful: ${publicUrl}`);
            return NextResponse.json({ url: publicUrl });
    
        } catch (firebaseError: unknown) {
            const message = firebaseError instanceof Error ? firebaseError.message : String(firebaseError);
            console.error('Firebase upload failed:', message);
            // Fall through to next method
        }
    }

    // 3. Local Storage Fallback (Only works on Localhost, NOT on Vercel)
    console.log('Switching to Local Storage fallback (Note: Images will vanish on Vercel deployments)');
    const localFolder = path.join(process.cwd(), 'public', 'uploads', 'hotels');
    
    if (!fs.existsSync(localFolder)) {
        fs.mkdirSync(localFolder, { recursive: true });
    }

    const localFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const localFilePath = path.join(localFolder, localFileName);
    
    fs.writeFileSync(localFilePath, buffer);
    
    // In production (Vercel), we can't really serve these reliably if they were uploaded at runtime.
    // But for now, return the path.
    const localUrl = `/uploads/hotels/${localFileName}`;
    console.log(`Local fallback upload successful: ${localUrl}`);
    
    return NextResponse.json({ url: localUrl });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Upload processing error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
