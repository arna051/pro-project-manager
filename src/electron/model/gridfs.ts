import "./index"
import mongoose from 'mongoose';
import { GridFSBucket, GridFSFile, ObjectId } from 'mongodb';
import { createReadStream } from 'fs';
import path from 'path';

let bucket: GridFSBucket | null = null;

export function getBucket() {
    const db = mongoose.connection.db;
    if (!db) throw new Error('DB not connected');
    if (!bucket) bucket = new GridFSBucket(db, { bucketName: 'media' });
    return bucket;
}

const guessContentType = (fileName: string, fallback = 'application/octet-stream') => {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        case '.webp':
            return 'image/webp';
        case '.svg':
            return 'image/svg+xml';
        case '.bmp':
            return 'image/bmp';
        default:
            return fallback;
    }
};

const saveBuffer = async (name: string, fileData: string | Buffer | Uint8Array, contentType: string, meta: Record<string, any> = {}) => {
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(name, { contentType, metadata: meta });

    await new Promise<void>((resolve, reject) => {
        let fileStream: ReturnType<typeof createReadStream> | null = null;

        const cleanup = () => {
            uploadStream.removeListener('error', onError);
            uploadStream.removeListener('finish', onFinish);
            uploadStream.removeListener('close', onFinish);
            if (fileStream) {
                fileStream.removeListener('error', onError);
            }
        };

        const onError = (err: Error) => {
            console.error('gridfs upload error', err);
            cleanup();
            reject(err);
        };

        const onFinish = () => {
            console.log('gridfs upload finished');
            cleanup();
            resolve();
        };

        uploadStream.once('error', onError);
        uploadStream.once('finish', onFinish);
        uploadStream.once('close', onFinish);

        if (typeof fileData === 'string') {
            fileStream = createReadStream(fileData);
            fileStream.once('error', onError);
            fileStream.pipe(uploadStream);
        } else {
            const buffer = Buffer.isBuffer(fileData) ? fileData : Buffer.from(fileData);
            uploadStream.end(buffer);
        }
    });

    const stored = await bucket.find({ _id: uploadStream.id }).limit(1).next();
    if (!stored) {
        throw new Error('Uploaded file metadata not found');
    }

    return stored;
};

export async function saveBase64File(name: string, contentType: string, base64: string, meta: Record<string, any> = {}) {
    const data = Buffer.from(base64, 'base64');
    return saveBuffer(name, data, contentType, meta);
}

export async function saveFileFromPath(filePath: string, meta: Record<string, any> = {}) {
    const fileName = path.basename(filePath);
    const contentType = meta.contentType ?? guessContentType(fileName);
    return saveBuffer(fileName, filePath, contentType, { ...meta, originalPath: filePath, originalName: fileName });
}

export async function listFiles(limit?: number, skip?: number) {
    const files = await getBucket().find({}, { limit, skip, sort: { uploadDate: -1 } }).toArray();
    return JSON.parse(JSON.stringify(files));
}

export async function deleteFile(id: string) {
    await getBucket().delete(new ObjectId(id));
}

export async function getFile(id: string) {
    const bucket = getBucket();
    const objectId = new ObjectId(id);
    const file = await bucket.find({ _id: objectId }).limit(1).next();
    if (!file) throw new Error('File not found');

    const buffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        const downloadStream = bucket.openDownloadStream(objectId);
        downloadStream.on('data', (chunk) => chunks.push(chunk as Buffer));
        downloadStream.once('error', reject);
        downloadStream.once('end', () => resolve(Buffer.concat(chunks)));
    });

    return { file: file as GridFSFile, base64: buffer.toString('base64') };
}
