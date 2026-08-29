import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName = () => process.env.TABLE_NAME;
const now = () => new Date().toISOString();
const lessonPk = (lessonId) => `LESSON#${lessonId}`;
const studentPk = (studentId) => `USER#${studentId}`;
const clean = (item) => ({ id: item.echoId, studentUserId: item.studentUserId, lessonId: item.lessonId, timestampSeconds: item.timestampSeconds, type: item.type, note: item.note ?? null, createdAt: item.createdAt, updatedAt: item.updatedAt });

export const createEcho = async ({ studentUserId, lessonId, timestampSeconds, type, note }) => {
  const createdAt = now();
  const echoId = randomUUID();
  const item = { entityType: 'ECHO', echoId, id: echoId, studentUserId, lessonId, timestampSeconds, type, note: note || null, createdAt, updatedAt };
  const params = { TableName: tableName(), Item: { PK: lessonPk(lessonId), SK: `ECHO#${createdAt}#${echoId}`, GSI1PK: studentPk(studentUserId), GSI1SK: `ECHO#${createdAt}#${echoId}`, ...item }, ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)' }; console.log(JSON.stringify({ scope: 'echo-repository', event: 'dynamodb-put-start', tableName: params.TableName, PK: params.Item.PK, SK: params.Item.SK, GSI1PK: params.Item.GSI1PK })); try { const result = await client.send(new PutCommand(params)); console.log(JSON.stringify({ scope: 'echo-repository', event: 'dynamodb-put-success', tableName: params.TableName, metadata: result?.$metadata })); } catch (e) { console.error(JSON.stringify({ scope: 'echo-repository', event: 'dynamodb-put-failed', tableName: params.TableName, name: e?.name, message: e?.message, code: e?.code, stack: e?.stack, metadata: e?.$metadata })); throw e; }
  return clean(item);
};

export const getEcho = async (echoId, lessonId) => {
  const r = await client.send(new QueryCommand({ TableName: tableName(), KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)', ExpressionAttributeValues: { ':pk': lessonPk(lessonId), ':prefix': 'ECHO#' } }));
  return (r.Items ?? []).find((item) => item.echoId === echoId && item.entityType === 'ECHO') ?? null;
};

export const listEchoesForLesson = async (lessonId) => {
  const r = await client.send(new QueryCommand({ TableName: tableName(), KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)', ExpressionAttributeValues: { ':pk': lessonPk(lessonId), ':prefix': 'ECHO#' }, ScanIndexForward: true }));
  return (r.Items ?? []).filter((item) => item.entityType === 'ECHO').map(clean);
};

export const listEchoesForStudent = async (studentUserId) => {
  const r = await client.send(new QueryCommand({ TableName: tableName(), IndexName: 'GSI1', KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :prefix)', ExpressionAttributeValues: { ':pk': studentPk(studentUserId), ':prefix': 'ECHO#' }, ScanIndexForward: false }));
  return (r.Items ?? []).filter((item) => item.entityType === 'ECHO').map(clean);
};

export const updateEcho = async ({ echoId, lessonId, studentUserId, timestampSeconds, type, note }) => {
  const existing = await getEcho(echoId, lessonId);
  if (!existing || existing.studentUserId !== studentUserId) return null;
  const updatedAt = now();
  const r = await client.send(new UpdateCommand({ TableName: tableName(), Key: { PK: existing.PK, SK: existing.SK }, UpdateExpression: 'SET timestampSeconds = :timestampSeconds, #type = :type, note = :note, updatedAt = :updatedAt', ExpressionAttributeNames: { '#type': 'type' }, ExpressionAttributeValues: { ':timestampSeconds': timestampSeconds, ':type': type, ':note': note || null, ':updatedAt': updatedAt }, ReturnValues: 'ALL_NEW' }));
  return clean(r.Attributes);
};

export const deleteEcho = async ({ echoId, lessonId, studentUserId }) => {
  const existing = await getEcho(echoId, lessonId);
  if (!existing || existing.studentUserId !== studentUserId) return false;
  await client.send(new DeleteCommand({ TableName: tableName(), Key: { PK: existing.PK, SK: existing.SK }, ConditionExpression: 'studentUserId = :studentUserId', ExpressionAttributeValues: { ':studentUserId': studentUserId } }));
  return true;
};
