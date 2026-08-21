import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const now = () => new Date().toISOString();

export const getOrCreateUser = async ({ subject, username, claims }) => {
  const tableName = process.env.TABLE_NAME;
  const key = { PK: `USER#${subject}`, SK: 'PROFILE' };

  const existing = await client.send(new GetCommand({ TableName: tableName, Key: key }));
  if (existing.Item) return existing.Item;

  const createdAt = now();
  const user = {
    ...key,
    entityType: 'USER',
    userId: subject,
    username: username ?? claims?.username ?? subject,
    email: claims?.email,
    createdAt,
    updatedAt: createdAt,
  };

  try {
    await client.send(new PutCommand({
      TableName: tableName,
      Item: user,
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
    }));
    return user;
  } catch (error) {
    if (error?.name !== 'ConditionalCheckFailedException') throw error;

    const raced = await client.send(new GetCommand({ TableName: tableName, Key: key }));
    if (!raced.Item) throw error;
    return raced.Item;
  }
};
