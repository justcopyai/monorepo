import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from 'path';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table with single-table design
    const table = new dynamodb.Table(this, 'AppDataTable', {
      tableName: `AppData-${this.node.tryGetContext('env') || 'dev'}`,
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // Global Secondary Index for querying all items
    table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {
        name: 'GSI1PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI1SK',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Lambda function configuration
    const lambdaEnv = {
      TABLE_NAME: table.tableName,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    };

    const lambdaProps = {
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: lambdaEnv,
      logRetention: logs.RetentionDays.ONE_WEEK,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/lambdas')),
    };

    // Lambda Functions
    const getItemsFunction = new lambda.Function(this, 'GetItemsFunction', {
      ...lambdaProps,
      functionName: `get-items-${this.node.tryGetContext('env') || 'dev'}`,
      handler: 'api/get-items.handler',
      description: 'Get all items from DynamoDB',
    });

    const getItemFunction = new lambda.Function(this, 'GetItemFunction', {
      ...lambdaProps,
      functionName: `get-item-${this.node.tryGetContext('env') || 'dev'}`,
      handler: 'api/get-item.handler',
      description: 'Get single item by ID',
    });

    const createItemFunction = new lambda.Function(this, 'CreateItemFunction', {
      ...lambdaProps,
      functionName: `create-item-${this.node.tryGetContext('env') || 'dev'}`,
      handler: 'api/create-item.handler',
      description: 'Create new item',
    });

    const updateItemFunction = new lambda.Function(this, 'UpdateItemFunction', {
      ...lambdaProps,
      functionName: `update-item-${this.node.tryGetContext('env') || 'dev'}`,
      handler: 'api/update-item.handler',
      description: 'Update existing item',
    });

    const deleteItemFunction = new lambda.Function(this, 'DeleteItemFunction', {
      ...lambdaProps,
      functionName: `delete-item-${this.node.tryGetContext('env') || 'dev'}`,
      handler: 'api/delete-item.handler',
      description: 'Delete item by ID',
    });

    const healthFunction = new lambda.Function(this, 'HealthFunction', {
      ...lambdaProps,
      functionName: `health-${this.node.tryGetContext('env') || 'dev'}`,
      handler: 'api/health.handler',
      description: 'Health check endpoint',
    });

    // Grant DynamoDB permissions to Lambda functions
    table.grantReadData(getItemsFunction);
    table.grantReadData(getItemFunction);
    table.grantWriteData(createItemFunction);
    table.grantWriteData(updateItemFunction);
    table.grantWriteData(deleteItemFunction);

    // API Gateway REST API
    const api = new apigateway.RestApi(this, 'AppApi', {
      restApiName: `serverless-app-api-${this.node.tryGetContext('env') || 'dev'}`,
      description: 'API Gateway for serverless app - Built with JustCopy.ai',
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // API Routes
    const items = api.root.addResource('items');
    items.addMethod('GET', new apigateway.LambdaIntegration(getItemsFunction));
    items.addMethod('POST', new apigateway.LambdaIntegration(createItemFunction));

    const item = items.addResource('{id}');
    item.addMethod('GET', new apigateway.LambdaIntegration(getItemFunction));
    item.addMethod('PUT', new apigateway.LambdaIntegration(updateItemFunction));
    item.addMethod('DELETE', new apigateway.LambdaIntegration(deleteItemFunction));

    const health = api.root.addResource('health');
    health.addMethod('GET', new apigateway.LambdaIntegration(healthFunction));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
      exportName: `ApiUrl-${this.node.tryGetContext('env') || 'dev'}`,
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
      description: 'DynamoDB Table Name',
      exportName: `TableName-${this.node.tryGetContext('env') || 'dev'}`,
    });

    new cdk.CfnOutput(this, 'TableArn', {
      value: table.tableArn,
      description: 'DynamoDB Table ARN',
    });
  }
}
