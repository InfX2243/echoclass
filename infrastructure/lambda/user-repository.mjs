import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const now = () => new Date().toISOString();
const log = (message, details = {}) => console.log(JSON.stringify({ scope: 'user-repository', message, ...details }));
const normalizeRole = (value) => value === 'STUDENT' || value === 'TEACHER' ? value : undefined;

export const getOrCreateUser = async ({ subject, username, claims }) => {
  const tableName = process.env.TABLE_NAME;
  log('bootstrap started', { tableName, subject, username, role: claims?.['custom:role'] });
  if (!tableName) throw new Error('TABLE_NAME is not configured');

  const key = { PK: `USER#${subject}`, SK: 'PROFILE' };
  const existing = await client.send(new GetCommand({ TableName: tableName, Key: key }));
  log('DynamoDB GetItem completed', { tableName, found: Boolean(existing.Item) });
  if (existing.Item) return existing.Item;

  const createdAt = now();
  const role = normalizeRole(claims?.['custom:role']);
  const user = { ...key, entityType: 'USER', userId: subject, username: username ?? claims?.username ?? subject, email: claims?.email, ...(role ? { role } : {}), createdAt, updatedAt: createdAt };
  log('creating DynamoDB user', { tableName, subject, role: user.role, hasEmail: Boolean(user.email) });
  try {
    await client.send(new PutCommand({ TableName: tableName, Item: user, ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)' }));
    log('DynamoDB user created', { tableName, subject });
    return user;
  } catch (error) {
    log('DynamoDB PutItem failed', { tableName, subject, errorName: error?.name, errorMessage: error?.message });
    if (error?.name !== 'ConditionalCheckFailedException') throw error;
    const raced = await client.send(new GetCommand({ TableName: tableName, Key: key }));
    if (!raced.Item) throw error;
    log('DynamoDB user found after conditional race', { tableName, subject });
    return raced.Item;
  }
};
