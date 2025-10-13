import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, TABLE_NAME } from '../shared/dynamodb-client';
import { success, error } from '../shared/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return error('Request body is required', 400);
    }

    const { name, description } = JSON.parse(event.body);

    if (!name) {
      return error('Name is required', 400);
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const item = {
      PK: `ITEM#${id}`,
      SK: 'METADATA',
      GSI1PK: 'ITEM',
      GSI1SK: now,
      id,
      name,
      description: description || undefined,
      createdAt: now,
      updatedAt: now,
    };

    console.log('Creating item:', item);

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return success({
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }, 201);
  } catch (err) {
    console.error('Error creating item:', err);
    return error('Failed to create item');
  }
};
