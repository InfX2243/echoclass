import { randomBytes, randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, TransactWriteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName = () => process.env.TABLE_NAME;
const now = () => new Date().toISOString();
const classPk = (classId) => `CLASS#${classId}`;
const teacherPk = (teacherId) => `TEACHER#${teacherId}`;
const studentPk = (studentId) => `STUDENT#${studentId}`;
const invitePk = (code) => `INVITE#${code}`;
const newCode = () => randomBytes(6).toString('base64url').toUpperCase();

export const createInvite = async ({ classId, teacherId }) => {
  const classResult = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: classPk(classId), SK: 'PROFILE' } }));
  const classItem = classResult.Item;
  if (!classItem || classItem.teacherId !== teacherId) return null;

  if (classItem.inviteCode) {
    const existing = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: invitePk(classItem.inviteCode), SK: 'PROFILE' } }));
    if (existing.Item) return { code: existing.Item.code, classId, createdAt: existing.Item.createdAt, status: existing.Item.status };
  }

  const code = newCode();
  const createdAt = now();
  const invite = { PK: invitePk(code), SK: 'PROFILE', entityType: 'INVITE', code, classId, teacherId, createdAt, status: 'ACTIVE' };
  try {
    await client.send(new TransactWriteCommand({
      TransactItems: [
        {
          Update: {
            TableName: tableName(),
            Key: { PK: classPk(classId), SK: 'PROFILE' },
            UpdateExpression: 'SET inviteCode = :code',
            ConditionExpression: 'attribute_not_exists(inviteCode)',
            ExpressionAttributeValues: { ':code': code },
          },
        },
        { Put: { TableName: tableName(), Item: invite, ConditionExpression: 'attribute_not_exists(PK)' } },
      ],
    }));
    return { code, classId, createdAt, status: 'ACTIVE' };
  } catch (caught) {
    if (caught?.name !== 'TransactionCanceledException') throw caught;
    const latest = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: classPk(classId), SK: 'PROFILE' } }));
    if (!latest.Item?.inviteCode) throw caught;
    const existing = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: invitePk(latest.Item.inviteCode), SK: 'PROFILE' } }));
    if (!existing.Item) throw caught;
    return { code: existing.Item.code, classId, createdAt: existing.Item.createdAt, status: existing.Item.status };
  }
};

export const getInvite = async (code) => {
  const result = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: invitePk(code), SK: 'PROFILE' } }));
  return result.Item ?? null;
};

export const joinWithInvite = async ({ code, studentId }) => {
  const invite = await getInvite(code);
  if (!invite || invite.status !== 'ACTIVE') return { kind: 'NOT_FOUND' };
  const existing = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: classPk(invite.classId), SK: `MEMBERSHIP#${studentId}` } }));
  if (existing.Item?.status === 'ACTIVE') return { kind: 'CONFLICT' };
  const joinedAt = now();
  const membership = {
    PK: classPk(invite.classId), SK: `MEMBERSHIP#${studentId}`, entityType: 'MEMBERSHIP', membershipId: randomUUID(),
    classId: invite.classId, studentId, status: 'ACTIVE', joinedAt, updatedAt: joinedAt,
    GSI1PK: studentPk(studentId), GSI1SK: `CLASS#${joinedAt}#${invite.classId}`,
  };
  await client.send(new PutCommand({ TableName: tableName(), Item: membership }));
  return { kind: 'JOINED', membership: { id: membership.membershipId, classId: membership.classId, studentId, status: membership.status, joinedAt } };
};

export const listMembers = async ({ classId }) => {
  const result = await client.send(new QueryCommand({ TableName: tableName(), KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)', ExpressionAttributeValues: { ':pk': classPk(classId), ':prefix': 'MEMBERSHIP#' } }));
  return (result.Items ?? []).filter((item) => item.status === 'ACTIVE').map((item) => ({ id: item.membershipId, studentId: item.studentId, status: item.status, joinedAt: item.joinedAt }));
};

export const removeMembership = async ({ classId, studentId }) => {
  const existing = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: classPk(classId), SK: `MEMBERSHIP#${studentId}` } }));
  if (!existing.Item || existing.Item.status !== 'ACTIVE') return null;
  const updatedAt = now();
  const result = await client.send(new UpdateCommand({ TableName: tableName(), Key: { PK: classPk(classId), SK: `MEMBERSHIP#${studentId}` }, UpdateExpression: 'SET #status = :removed, updatedAt = :updatedAt', ExpressionAttributeNames: { '#status': 'status' }, ExpressionAttributeValues: { ':removed': 'REMOVED', ':updatedAt': updatedAt }, ReturnValues: 'ALL_NEW' }));
  return { id: result.Attributes.membershipId, classId, studentId, status: 'REMOVED', joinedAt: result.Attributes.joinedAt, updatedAt };
};

export const teacherOwnsClass = async ({ classId, teacherId }) => {
  const result = await client.send(new GetCommand({ TableName: tableName(), Key: { PK: classPk(classId), SK: 'PROFILE' } }));
  return result.Item?.teacherId === teacherId;
};
