import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const now = () => new Date().toISOString();
const tableName = () => process.env.TABLE_NAME;
const classPk = (classId) => `CLASS#${classId}`;
const teacherPk = (userId) => `TEACHER#${userId}`;
const membershipPk = (userId) => `STUDENT#${userId}`;

const cleanClass = (item) => ({
  id: item.classId,
  name: item.name,
  description: item.description ?? null,
  teacherId: item.teacherId,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const createClass = async ({ teacherId, name, description }) => {
  const createdAt = now();
  const classId = randomUUID();
  const item = {
    PK: classPk(classId), SK: 'PROFILE', entityType: 'CLASS', classId,
    name, description: description || undefined, teacherId, createdAt, updatedAt: createdAt,
    GSI1PK: teacherPk(teacherId), GSI1SK: `CLASS#${createdAt}#${classId}`,
  };
  await client.send(new PutCommand({ TableName: tableName(), Item: item, ConditionExpression: 'attribute_not_exists(PK)' }));
  return cleanClass(item);
};

export const listClassesOwnedByTeacher = async (teacherId) => {
  const result = await client.send(new QueryCommand({
    TableName: tableName(), IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :pk', ExpressionAttributeValues: { ':pk': teacherPk(teacherId) },
    ScanIndexForward: false,
  }));
  return (result.Items ?? []).filter((item) => item.entityType === 'CLASS').map(cleanClass);
};

export const getClassById = async (classId) => {
  const result = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: classPk(classId), SK: 'PROFILE' } }));
  return result.Item ? cleanClass(result.Item) : null;
};

export const getClassForTeacher = async (classId, teacherId) => {
  const item = await getClassById(classId);
  return item?.teacherId === teacherId ? item : null;
};

export const updateClass = async ({ classId, teacherId, name, description }) => {
  const existing = await getClassForTeacher(classId, teacherId);
  if (!existing) return null;
  const updatedAt = now();
  const updates = ['updatedAt = :updatedAt'];
  const names = {};
  const values = { ':updatedAt': updatedAt };
  if (name !== undefined) { names['#name'] = 'name'; values[':name'] = name; updates.push('#name = :name'); }
  if (description !== undefined) { names['#description'] = 'description'; values[':description'] = description || null; updates.push('#description = :description'); }
  const result = await client.send(new UpdateCommand({
    TableName: tableName(), Key: { PK: classPk(classId), SK: 'PROFILE' },
    UpdateExpression: `SET ${updates.join(', ')}`, ExpressionAttributeNames: Object.keys(names).length ? names : undefined,
    ExpressionAttributeValues: values, ReturnValues: 'ALL_NEW',
  }));
  return cleanClass(result.Attributes);
};

export const listClassesForStudent = async (studentId) => {
  const memberships = await client.send(new QueryCommand({
    TableName: tableName(), IndexName: 'GSI1', KeyConditionExpression: 'GSI1PK = :pk',
    ExpressionAttributeValues: { ':pk': membershipPk(studentId) }, ScanIndexForward: false,
  }));
  const classIds = (memberships.Items ?? []).filter((item) => item.entityType === 'MEMBERSHIP' && item.status === 'ACTIVE').map((item) => item.classId);
  return Promise.all(classIds.map((classId) => getClassById(classId))).then((items) => items.filter(Boolean));
};

export const getClassForStudent = async (classId, studentId) => {
  const membership = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: classPk(classId), SK: `MEMBERSHIP#${studentId}` } }));
  if (membership.Item?.status !== 'ACTIVE') return null;
  return getClassById(classId);
};
