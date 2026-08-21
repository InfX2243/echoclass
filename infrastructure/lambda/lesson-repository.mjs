import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName = () => process.env.TABLE_NAME;
const now = () => new Date().toISOString();
const classPk = (classId) => `CLASS#${classId}`;
const lessonPk = (lessonId) => `LESSON#${lessonId}`;

const cleanLesson = (item) => ({
  id: item.lessonId,
  classId: item.classId,
  title: item.title,
  description: item.description ?? null,
  status: item.status,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  publishedAt: item.publishedAt ?? null,
});

export const createLesson = async ({ classId, teacherId, title, description }) => {
  const createdAt = now();
  const lessonId = randomUUID();
  const item = { PK: classPk(classId), SK: `LESSON#${createdAt}#${lessonId}`, entityType: 'LESSON', lessonId, classId, teacherId, title, description: description || undefined, status: 'DRAFT', createdAt, updatedAt: createdAt };
  await client.send(new PutCommand({ TableName: tableName(), Item: item, ConditionExpression: 'attribute_not_exists(PK)' }));
  await client.send(new PutCommand({ TableName: tableName(), Item: { PK: lessonPk(lessonId), SK: 'PROFILE', entityType: 'LESSON', ...item }, ConditionExpression: 'attribute_not_exists(PK)' }));
  return cleanLesson(item);
};

export const getLessonById = async (lessonId) => {
  const result = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: lessonPk(lessonId), SK: 'PROFILE' } }));
  return result.Item ? cleanLesson(result.Item) : null;
};

export const getLessonForTeacher = async (lessonId, teacherId) => {
  const lesson = await getLessonById(lessonId);
  return lesson && (await ownsLesson(lessonId, teacherId)) ? lesson : null;
};

export const ownsLesson = async (lessonId, teacherId) => {
  const result = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: lessonPk(lessonId), SK: 'PROFILE' } }));
  return result.Item?.teacherId === teacherId;
};

export const listLessonsForClass = async ({ classId, publishedOnly = false }) => {
  const result = await client.send(new QueryCommand({ TableName: tableName(), KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)', ExpressionAttributeValues: { ':pk': classPk(classId), ':prefix': 'LESSON#' }, ScanIndexForward: false }));
  return (result.Items ?? []).filter((item) => item.entityType === 'LESSON' && (!publishedOnly || item.status === 'PUBLISHED')).map(cleanLesson);
};

export const updateLesson = async ({ lessonId, teacherId, title, description }) => {
  const lesson = await getLessonForTeacher(lessonId, teacherId);
  if (!lesson || lesson.status === 'ARCHIVED') return null;
  const values = { ':updatedAt': now() };
  const updates = ['updatedAt = :updatedAt'];
  const names = {};
  if (title !== undefined) { names['#title'] = 'title'; values[':title'] = title; updates.push('#title = :title'); }
  if (description !== undefined) { names['#description'] = 'description'; values[':description'] = description || null; updates.push('#description = :description'); }
  const key = { PK: lessonPk(lessonId), SK: 'PROFILE' };
  const result = await client.send(new UpdateCommand({ TableName: tableName(), Key: key, UpdateExpression: `SET ${updates.join(', ')}`, ExpressionAttributeNames: Object.keys(names).length ? names : undefined, ExpressionAttributeValues: values, ReturnValues: 'ALL_NEW' }));
  const updated = result.Attributes;
  await syncClassLesson(updated);
  return cleanLesson(updated);
};

const syncClassLesson = async (item) => {
  const result = await client.send(new QueryCommand({ TableName: tableName(), KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)', ExpressionAttributeValues: { ':pk': classPk(item.classId), ':prefix': `LESSON#` } }));
  const existing = (result.Items ?? []).find((candidate) => candidate.lessonId === item.lessonId);
  if (!existing) return;
  await client.send(new UpdateCommand({ TableName: tableName(), Key: { PK: existing.PK, SK: existing.SK }, UpdateExpression: 'SET #title = :title, #description = :description, #status = :status, updatedAt = :updatedAt, publishedAt = :publishedAt', ExpressionAttributeNames: { '#title': 'title', '#description': 'description', '#status': 'status' }, ExpressionAttributeValues: { ':title': item.title, ':description': item.description ?? null, ':status': item.status, ':updatedAt': item.updatedAt, ':publishedAt': item.publishedAt ?? null } }));
};

export const setLessonStatus = async ({ lessonId, teacherId, status }) => {
  const lesson = await getLessonForTeacher(lessonId, teacherId);
  if (!lesson || (lesson.status === 'ARCHIVED' && status !== 'ARCHIVED')) return null;
  const updatedAt = now();
  const publishedAt = status === 'PUBLISHED' ? (lesson.publishedAt ?? updatedAt) : null;
  const result = await client.send(new UpdateCommand({ TableName: tableName(), Key: { PK: lessonPk(lessonId), SK: 'PROFILE' }, UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt, publishedAt = :publishedAt', ExpressionAttributeNames: { '#status': 'status' }, ExpressionAttributeValues: { ':status': status, ':updatedAt': updatedAt, ':publishedAt': publishedAt }, ReturnValues: 'ALL_NEW' }));
  await syncClassLesson(result.Attributes);
  return cleanLesson(result.Attributes);
};
