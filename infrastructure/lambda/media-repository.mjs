import { randomUUID } from 'node:crypto';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo } from './dynamo.mjs';

const tableName = process.env.TABLE_NAME;
const now = () => new Date().toISOString();
const lessonKey = (lessonId) => `LESSON#${lessonId}`;

export const createPendingMedia = async ({ lessonId, teacherId, objectKey, contentType, sizeBytes }) => {
  const timestamp = now();
  const mediaId = randomUUID();
  const item = { PK: lessonKey(lessonId), SK: `MEDIA#${mediaId}`, entityType: 'MEDIA', mediaId, lessonId, teacherId, objectKey, contentType, sizeBytes, status: 'PENDING_UPLOAD', createdAt: timestamp, updatedAt: timestamp };
  await dynamo.send(new PutCommand({ TableName: tableName, Item: item, ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)' }));
  return item;
};

export const getMediaForLesson = async (lessonId, mediaId) => {
  const result = await dynamo.send(new GetCommand({ TableName: tableName, Key: { PK: lessonKey(lessonId), SK: `MEDIA#${mediaId}` } }));
  return result.Item ?? null;
};
