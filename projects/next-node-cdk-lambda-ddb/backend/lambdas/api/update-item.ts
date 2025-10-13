import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../shared/dynamodb-client';
import { success, error } from '../shared/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return error('Item ID is required', 400);
    }

    if (!event.body) {
      return error('Request body is required', 400);
    }

    const { name, description } = JSON.parse(event.body);
    const now = new Date().toISOString();

    console.log(`Updating item with ID: ${id}`);

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `ITEM#${id}`,
          SK: 'METADATA',
        },
        UpdateExpression: 'SET #name = :name, description = :description, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':name': name,
          ':description': description,
          ':updatedAt': now,
        },
        ReturnValues: 'ALL_NEW',
      })
    );

    const item = {
      id: result.Attributes?.id,
      name: result.Attributes?.name,
      description: result.Attributes?.description,
      createdAt: result.Attributes?.createdAt,
      updatedAt: result.Attributes?.updatedAt,
    };

    return success(item);
  } catch (err) {
    console.error('Error updating item:', err);
    return error('Failed to update item');
  }
};
