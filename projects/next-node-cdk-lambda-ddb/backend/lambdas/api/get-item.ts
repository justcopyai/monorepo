import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../shared/dynamodb-client';
import { success, error } from '../shared/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return error('Item ID is required', 400);
    }

    console.log(`Getting item with ID: ${id}`);

    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `ITEM#${id}`,
          SK: 'METADATA',
        },
      })
    );

    if (!result.Item) {
      return error('Item not found', 404);
    }

    const item = {
      id: result.Item.id,
      name: result.Item.name,
      description: result.Item.description,
      createdAt: result.Item.createdAt,
      updatedAt: result.Item.updatedAt,
    };

    return success(item);
  } catch (err) {
    console.error('Error getting item:', err);
    return error('Failed to get item');
  }
};
