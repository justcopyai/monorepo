# ⚡ Quick Start Guide

Get your serverless app running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- AWS CLI configured (`aws configure`)
- AWS CDK installed globally: `npm install -g aws-cdk`
- An AWS account

## Step 1: Install Dependencies (3 minutes)

```bash
# From project root
cd monorepo/projects/next-node-cdk-lambda-ddb

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install infrastructure dependencies
cd ../infrastructure
npm install
```

## Step 2: Configure AWS (2 minutes)

```bash
# Set up infrastructure environment
cd infrastructure
cp .env.example .env

# Edit .env with your AWS details:
# AWS_ACCOUNT_ID=your-account-id
# AWS_REGION=us-east-1
# ENVIRONMENT=dev

# Bootstrap CDK (first time only)
cdk bootstrap
```

## Step 3: Deploy to AWS (4 minutes)

```bash
# From infrastructure directory
cdk deploy

# ✅ Note the API Gateway URL from the output!
# It will look like: https://abc123.execute-api.us-east-1.amazonaws.com/prod/
```

## Step 4: Configure Frontend (1 minute)

```bash
# From frontend directory
cd ../frontend
cp .env.example .env.local

# Edit .env.local and add your API URL:
# NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
```

## Step 5: Run Frontend (30 seconds)

```bash
# From frontend directory
npm run dev

# Open http://localhost:3000
# 🎉 Your app is running!
```

## What You Just Built

### API Endpoints
- `GET /health` - Health check
- `GET /items` - List all items
- `GET /items/:id` - Get item by ID
- `POST /items` - Create item
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item

### AWS Resources Created
- ✅ DynamoDB table with GSI
- ✅ 6 Lambda functions
- ✅ API Gateway REST API
- ✅ IAM roles & policies
- ✅ CloudWatch log groups

## Test the API

```bash
# Health check
curl https://your-api-url/health

# Create an item
curl -X POST https://your-api-url/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"My first item"}'

# Get all items
curl https://your-api-url/items
```

## Next Steps

1. **Customize the frontend** - Edit `frontend/app/page.tsx`
2. **Add more Lambda functions** - See `backend/lambdas/api/`
3. **Modify the database** - Edit `infrastructure/lib/app-stack.ts`
4. **Deploy to production** - `cdk deploy --context env=prod`

## Troubleshooting

### CDK Bootstrap Error
```bash
cdk bootstrap aws://ACCOUNT-ID/REGION
```

### Lambda Can't Access DynamoDB
- Check IAM permissions in `infrastructure/lib/app-stack.ts`
- Verify `TABLE_NAME` environment variable

### Frontend Can't Connect to API
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in CDK stack
- Ensure API Gateway is deployed

## Clean Up

```bash
# Delete all AWS resources
cd infrastructure
cdk destroy

# This will remove:
# - Lambda functions
# - API Gateway
# - IAM roles
# - CloudWatch logs
# (DynamoDB table is retained by default)
```

## Built with JustCopy.ai

This template was created for [JustCopy.ai](https://justcopy.ai) users!

**Want to customize this further?**
1. Go to [JustCopy.ai](https://justcopy.ai)
2. Tell the AI what you want to change
3. Deploy your custom version instantly

**Start for FREE** - 100,000 tokens on signup!

---

Need help? Check the [README.md](./README.md) for detailed documentation.
