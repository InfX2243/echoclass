import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({});
const bucket = () => process.env.MEDIA_BUCKET_NAME;

export const createLessonPlaybackAccess = async ({ objectKey, expiresIn = 900 }) => ({
  playbackUrl: await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket(), Key: objectKey }),
    { expiresIn },
  ),
  expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
});
