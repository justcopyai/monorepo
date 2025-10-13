import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../shared/dynamodb-client';
import { success, error } from '../shared/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return error('Item ID is required', 400);
    }

    console.log(`Deleting item with ID: ${id}`);

    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `ITEM#${id}`,
          SK: 'METADATA',
        },
      })
    );

    return success({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    return error('Failed to delete item');
  }
};
