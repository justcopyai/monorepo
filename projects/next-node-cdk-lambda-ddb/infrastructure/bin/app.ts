#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();

// Get environment from context or environment variable
const env = app.node.tryGetContext('env') || process.env.ENVIRONMENT || 'dev';

new AppStack(app, `ServerlessApp-${env}`, {
  stackName: `serverless-app-${env}`,
  description: 'Next.js + AWS CDK + Lambda + DynamoDB - Built with JustCopy.ai',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
    region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
  },
  tags: {
    Environment: env,
    Project: 'ServerlessApp',
    ManagedBy: 'CDK',
    Source: 'JustCopy.ai',
  },
});
