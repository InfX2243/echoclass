import { randomUUID } from 'node:crypto';
import { S3Client, AbortMultipartUploadCommand, CompleteMultipartUploadCommand, CreateMultipartUploadCommand, HeadObjectCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3=new S3Client({});
const bucket=()=>process.env.MEDIA_BUCKET_NAME;
const safeName=name=>String(name).replace(/[^a-zA-Z0-9._-]/g,'-').replace(/-+/g,'-').slice(-120)||'video';
export const createLessonUpload=async({lessonId,fileName,contentType})=>{const objectKey=`lessons/${lessonId}/${randomUUID()}-${safeName(fileName)}`;const r=await s3.send(new CreateMultipartUploadCommand({Bucket:bucket(),Key:objectKey,ContentType:contentType}));if(!r.UploadId)throw new Error('Unable to start multipart upload');return{uploadId:r.UploadId,objectKey,expiresIn:900}};
export const createLessonUploadPart=async({objectKey,uploadId,partNumber})=>{const command=new UploadPartCommand({Bucket:bucket(),Key:objectKey,UploadId:uploadId,PartNumber:partNumber});return{uploadUrl:await getSignedUrl(s3,command,{expiresIn:900}),expiresIn:900}};
export const completeLessonUpload=async({objectKey,uploadId,parts})=>{const r=await s3.send(new CompleteMultipartUploadCommand({Bucket:bucket(),Key:objectKey,UploadId:uploadId,MultipartUpload:{Parts:parts.map(p=>({ETag:p.etag,PartNumber:p.partNumber}))}}));return{objectKey,etag:r.ETag??null}};
export const abortLessonUpload=async({objectKey,uploadId})=>{await s3.send(new AbortMultipartUploadCommand({Bucket:bucket(),Key:objectKey,UploadId:uploadId}));};
export const verifyLessonUpload=async({objectKey,contentType,size})=>{const r=await s3.send(new HeadObjectCommand({Bucket:bucket(),Key:objectKey}));if(size!==undefined&&r.ContentLength!==size)throw new Error('Uploaded file size does not match the expected size');return{objectKey,contentType:r.ContentType??contentType,size:r.ContentLength??size,uploadedAt:new Date().toISOString()}};