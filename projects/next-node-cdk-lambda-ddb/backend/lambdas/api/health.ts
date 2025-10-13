import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { success } from '../shared/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return success({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Serverless App API - Built with JustCopy.ai',
  });
};
