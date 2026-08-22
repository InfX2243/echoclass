import { randomUUID } from 'node:crypto';
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({});
const bucket = () => process.env.MEDIA_BUCKET_NAME;
const safeName = (name) => String(name).replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').slice(-120) || 'video';
export const createLessonUpload = async ({ lessonId, fileName, contentType, size }) => {
  const objectKey = `lessons/${lessonId}/${randomUUID()}-${safeName(fileName)}`;
  const command = new PutObjectCommand({ Bucket: bucket(), Key: objectKey, ContentType: contentType, ContentLength: size });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
  return { uploadUrl, objectKey, expiresIn: 900 };
};
export const verifyLessonUpload = async ({ objectKey, contentType, size }) => {
  const result = await s3.send(new HeadObjectCommand({ Bucket: bucket(), Key: objectKey }));
  if (size !== undefined && result.ContentLength !== size) throw new Error('Uploaded file size does not match the expected size');
  return { objectKey, contentType: result.ContentType ?? contentType, size: result.ContentLength ?? size, uploadedAt: new Date().toISOString() };
};