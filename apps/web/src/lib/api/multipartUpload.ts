import { apiClient } from './client';

const PART_SIZE=8*1024*1024;
type Part={partNumber:number;etag:string};
type Upload={uploadId:string;objectKey:string};
export async function uploadLessonVideo({lessonId,file,token,onProgress}:{lessonId:string;file:File;token:string;onProgress?:(percent:number)=>void}){
 const contentType=file.type||'video/mp4';
 const started=await apiClient.post<{upload:Upload}>(`/lessons/${lessonId}/upload`,{fileName:file.name,contentType,size:file.size},token);
 const {uploadId,objectKey}=started.upload;const parts:Part[]=[];const total=Math.ceil(file.size/PART_SIZE);
 try{for(let index=0;index<total;index++){const partNumber=index+1;const signed=await apiClient.post<{part:{uploadUrl:string}}>(`/lessons/${lessonId}/upload/part`,{objectKey,uploadId,partNumber},token);const start=index*PART_SIZE,end=Math.min(file.size,start+PART_SIZE);const response=await fetch(signed.part.uploadUrl,{method:'PUT',body:file.slice(start,end)});if(!response.ok)throw new Error(`Video upload failed while uploading part ${partNumber}.`);const etag=response.headers.get('etag');if(!etag)throw new Error('Video upload failed: S3 did not return an ETag.');parts.push({partNumber,etag});onProgress?.(Math.round((partNumber/total)*100));}
 await apiClient.post(`/lessons/${lessonId}/upload/complete`,{objectKey,uploadId,parts},token);
 await apiClient.post(`/lessons/${lessonId}/media`,{objectKey,contentType,size:file.size,fileName:file.name},token);
 return objectKey;
 }catch(error){try{await apiClient.post(`/lessons/${lessonId}/upload/abort`,{objectKey,uploadId},token)}catch{}throw error}
}
