# Next.js + AWS CDK + Lambda + DynamoDB Starter

<div align="center">

## **⚡ Production-Ready Serverless Template from [JustCopy.ai](https://justcopy.ai)**

### **Copy → Ask AI to Customize → Deploy to AWS**
**No setup. No boilerplate. Just ship.**

[![Start Free](https://img.shields.io/badge/Start_Building-FREE-00D9FF?style=for-the-badge&logo=react)](https://justcopy.ai)
[![AI Agents](https://img.shields.io/badge/AI_Agents-Copy_&_Customize-8B5CF6?style=for-the-badge&logo=openai)](https://justcopy.ai)
[![100K Free Tokens](https://img.shields.io/badge/100K-Free_Tokens-10B981?style=for-the-badge)](https://justcopy.ai)

</div>

---

## 🎯 Why This Template?

**Skip months of infrastructure setup.** Get a production-ready serverless app in 10 minutes:

✨ **Copy from JustCopy.ai** → Already configured, tested, and optimized
🤖 **Tell AI what you need** → "Add authentication", "Connect Stripe", "Add email"
🚀 **Deploy to AWS** → One command, fully automated

### Built with AI Agents in Mind

This isn't just code—it's an **AI-ready template** that understands:
- ✅ What questions to ask you before deployment
- ✅ How to customize based on your requirements
- ✅ Best practices for serverless architecture
- ✅ Cost optimization from day one

> **Try it now**: Tell the AI "I want to add user authentication" or "I need Stripe payments"

---

## 🚀 What's Inside

A complete **production-ready serverless stack**:

| Layer | Technology | What You Get |
|-------|-----------|--------------|
| **Frontend** | Next.js 15 + TypeScript | App Router, Tailwind CSS, API client, responsive design |
| **Backend** | AWS Lambda + API Gateway | 6 REST endpoints, TypeScript, error handling, CORS |
| **Database** | DynamoDB | Single-table design, GSI for queries, auto-scaling |
| **Infrastructure** | AWS CDK (IaC) | TypeScript definitions, multi-environment, CloudWatch logs |
| **Deployment** | AWS CDK | One-command deploy, environment separation, IAM configured |

**What makes it special:**
- 🎯 **AI-Optimized**: Designed for JustCopy.ai AI agents to understand and customize
- ⚡ **10-Minute Deploy**: From zero to production-ready API
- 💰 **$0-40/month**: Free tier eligible, pay-per-request billing
- 📊 **Observable**: CloudWatch logs, DynamoDB metrics, API Gateway monitoring
- 🔒 **Secure**: IAM least-privilege, CORS configured, error handling
- 🌍 **Scalable**: Auto-scales from 0 to millions of requests

---

## 🤖 AI Agent Features (Unique to JustCopy.ai)

This template includes **AGENT_GUIDE.md** - a machine-readable file that helps AI agents:

### What AI Knows About This Template:
- ✅ **Required AWS configuration** (Account ID, Region, Environment)
- ✅ **All optional customizations** (Lambda memory, DynamoDB settings, custom domains)
- ✅ **Deployment steps** with error handling
- ✅ **Common user questions** and how to answer them
- ✅ **Customization patterns** (Add auth, payments, email, etc.)
- ✅ **Cost implications** for different configurations

### What This Means For You:
**Instead of reading docs and configuring manually, just tell the AI:**

```
💬 "Deploy this to AWS, ask me what you need"
```

**The AI will:**
1. Read AGENT_GUIDE.md
2. Ask: "What's your AWS Account ID and preferred region?"
3. Ask: "Do you want dev, staging, or prod environment?"
4. Configure everything automatically
5. Run `cdk deploy` for you
6. Give you the API URL

**See AGENT_GUIDE.md for the complete AI interaction spec.**

---

## 📦 Project Structure

```
next-node-cdk-lambda-ddb/
├── frontend/           # Next.js 15 application
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable React components
│   ├── lib/           # Utilities and helpers
│   └── public/        # Static assets
├── backend/           # Lambda functions
│   └── lambdas/
│       ├── api/       # API Lambda handlers
│       ├── shared/    # Shared utilities
│       └── types/     # TypeScript types
├── infrastructure/    # AWS CDK stack
│   ├── bin/           # CDK app entry point
│   ├── lib/           # CDK stack definitions
│   └── cdk.json       # CDK configuration
└── README.md
```

## 🎯 Features

### Frontend
✅ Next.js 15 with App Router
✅ TypeScript & ESLint configured
✅ Tailwind CSS for styling
✅ API routes for backend integration
✅ Environment variable support
✅ Responsive design ready

### Backend
✅ AWS Lambda with Node.js 20
✅ API Gateway REST API
✅ DynamoDB single-table design
✅ TypeScript support
✅ CORS configured
✅ Error handling middleware

### Infrastructure
✅ AWS CDK with TypeScript
✅ DynamoDB table with GSIs
✅ Lambda functions
✅ API Gateway
✅ IAM roles & policies
✅ CloudWatch logs
✅ Environment-based configuration (dev/prod)

## 🏃 Quick Start

### Prerequisites
- Node.js 18+ installed
- AWS CLI configured with credentials
- AWS CDK CLI installed: `npm install -g aws-cdk`

### 1. Install Dependencies

```bash
# Install root dependencies (if using monorepo workspace)
npm install

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

### 2. Configure Environment

```bash
# Frontend environment
cp frontend/.env.example frontend/.env.local
# Edit .env.local with your API Gateway URL (after deployment)

# Infrastructure environment
cp infrastructure/.env.example infrastructure/.env
# Edit .env with your AWS account details
```

### 3. Deploy Infrastructure

```bash
cd infrastructure

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy to AWS
cdk deploy

# Note the API Gateway URL from the output
```

### 4. Run Frontend Locally

```bash
cd frontend

# Update .env.local with API Gateway URL from deployment
echo "NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod" >> .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 💡 Too Much Manual Work? Let AI Do It For You

**This Quick Start is optional.** On [JustCopy.ai](https://justcopy.ai), the AI agent handles all of this:

1. ✅ Asks you for AWS credentials
2. ✅ Configures environment files
3. ✅ Deploys infrastructure automatically
4. ✅ Tests the API endpoints
5. ✅ Gives you the live URL

**Time:** 2 minutes vs 30 minutes manually

👉 **[Try AI-Powered Deployment on JustCopy.ai](https://justcopy.ai)** - 100K free tokens, no card required

---

## 📚 API Endpoints

The backend provides the following REST API endpoints:

### Items Resource
- `GET /items` - List all items
- `GET /items/:id` - Get item by ID
- `POST /items` - Create new item
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item

### Health Check
- `GET /health` - API health status

## 🗄️ Database Schema

**DynamoDB Table**: `AppData-{stage}`

```
PK (Partition Key): ITEM#{itemId}
SK (Sort Key): METADATA
```

**Global Secondary Index (GSI)**:
- GSI1PK: `ITEM`
- GSI1SK: `created_at` (for sorting by date)

## 🎨 Customization

### Adding New Lambda Functions

1. Create function in `backend/lambdas/api/`:
```typescript
// backend/lambdas/api/my-function.ts
export const handler = async (event: APIGatewayProxyEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from my function!' })
  };
};
```

2. Add to CDK stack in `infrastructure/lib/app-stack.ts`:
```typescript
const myFunction = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'my-function.handler',
  code: lambda.Code.fromAsset('../backend/lambdas/api'),
  environment: {
    TABLE_NAME: table.tableName
  }
});

api.root.addResource('my-resource').addMethod('GET',
  new apigateway.LambdaIntegration(myFunction)
);
```

3. Deploy: `cd infrastructure && cdk deploy`

### Modifying DynamoDB Schema

Edit `infrastructure/lib/app-stack.ts`:
```typescript
const table = new dynamodb.Table(this, 'AppDataTable', {
  partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  // Add GSIs as needed
});
```

### Frontend Customization

- **Pages**: Add to `frontend/app/` directory
- **Components**: Create in `frontend/components/`
- **API Client**: Update `frontend/lib/api-client.ts`
- **Styles**: Edit `frontend/app/globals.css`

## 🚀 Deployment

### Deploy Everything

```bash
# Deploy infrastructure
cd infrastructure
cdk deploy

# Build and deploy frontend (to S3 + CloudFront)
cd ../frontend
npm run build
# Upload to S3 or deploy to Vercel/Netlify
```

### Environment Stages

The CDK stack supports multiple environments:

```bash
# Deploy to dev
cdk deploy --context env=dev

# Deploy to production
cdk deploy --context env=prod
```

## 🧪 Testing

```bash
# Test Lambda functions locally
cd backend
npm test

# Test frontend
cd frontend
npm test

# Run E2E tests
npm run test:e2e
```

## 📊 Monitoring

### CloudWatch Logs
- Frontend logs: CloudWatch Log Groups
- Lambda logs: `/aws/lambda/FunctionName`
- API Gateway logs: API Gateway CloudWatch Logs

### DynamoDB Metrics
- Read/Write capacity
- Item counts
- Request latency

Access via AWS CloudWatch Console

## 💰 Cost Estimation

**Monthly costs for moderate usage:**
- Lambda: ~$5-20 (1M requests)
- DynamoDB: ~$1-10 (PAY_PER_REQUEST mode)
- API Gateway: ~$3.50 per million requests
- CloudWatch: ~$0.50-5

**Total**: ~$10-40/month for small apps

## 🤖 Why JustCopy.ai is Different

This isn't just a GitHub template—it's an **AI-native codebase**.

### Traditional Way (Hours to Days):
```
1. Clone repo → 2. Read docs → 3. Configure → 4. Debug → 5. Deploy → 6. Repeat
```

### JustCopy.ai Way (Minutes):
```
1. Tell AI what you want → 2. AI configures & deploys → 3. Done ✅
```

---

## 🎁 How to Use This Template on JustCopy.ai

### **Step 1: Copy** (2 seconds)
Go to [JustCopy.ai](https://justcopy.ai) → Select `next-node-cdk-lambda-ddb` → Click "Copy"

### **Step 2: Customize with AI** (2 minutes)
Talk to the AI agent like a senior developer:

**Example conversations:**
- 💬 "Add Cognito authentication for user login"
- 💬 "I need Stripe for subscriptions, add checkout and webhook handlers"
- 💬 "Add S3 bucket for user profile photos with image resizing"
- 💬 "Create a real-time notification system with WebSockets"
- 💬 "Add email sending with AWS SES and transactional templates"

**The AI will:**
1. ✅ Ask you clarifying questions (API keys, preferences, etc.)
2. ✅ Modify the code across frontend, backend, and infrastructure
3. ✅ Update the CDK stack with new AWS resources
4. ✅ Configure environment variables
5. ✅ Show you exactly what changed

### **Step 3: Deploy** (3 minutes)
```bash
# The AI has already configured everything
cd infrastructure
cdk deploy

# That's it! Your customized app is live on AWS
```

---

## 🎯 Real Examples: What AI Can Do For You

### Example 1: "Add Authentication"
**You say:** "I need user authentication with email/password"

**AI does:**
- Creates Cognito User Pool in CDK stack
- Adds signup/login Lambda functions
- Adds JWT middleware to protect API routes
- Creates login/signup UI components
- Configures environment variables

**You deploy:** `cdk deploy` → Done in 5 minutes

### Example 2: "Add Payments"
**You say:** "I want to charge users $10/month with Stripe"

**AI does:**
- Adds Stripe SDK to backend
- Creates checkout Lambda function
- Adds webhook handler for payment events
- Creates pricing UI component
- Stores subscription status in DynamoDB

**You deploy:** `cdk deploy` → Accepting payments in 10 minutes

### Example 3: "Scale to Handle More Users"
**You say:** "I expect 100K users, optimize the database"

**AI does:**
- Adds DynamoDB read/write capacity settings
- Creates additional GSIs for query patterns
- Adds ElastiCache for session management
- Optimizes Lambda memory/timeout settings
- Sets up CloudWatch alarms

**You deploy:** `cdk deploy` → Production-scale infrastructure

---

## 💎 JustCopy.ai Free Tier

Get started with **zero cost**:

| Feature | Free Tier | What It Means |
|---------|-----------|---------------|
| **AI Tokens** | 100,000 on signup | ~50 template customizations |
| **Templates** | Unlimited access | Copy any template, any time |
| **Deployments** | Unlimited dev | Deploy to your AWS account FREE |
| **AI Assistance** | Full access | Ask AI anything about your code |
| **Referrals** | 50K tokens per friend | Share & earn unlimited tokens |

**No credit card required.** Start building now: [JustCopy.ai](https://justcopy.ai)

---

## 🚀 From Zero to Production in 10 Minutes

**Minute 0-2**: Sign up at [JustCopy.ai](https://justcopy.ai) → Get 100K free tokens
**Minute 2-4**: Copy this template → Tell AI your customizations
**Minute 4-5**: AI modifies code → Review changes
**Minute 5-8**: `cdk deploy` → AWS provisions resources
**Minute 8-10**: Test your API → Frontend connects

**You now have:**
- ✅ Production-ready API deployed to AWS
- ✅ DynamoDB database with GSI
- ✅ 6 Lambda functions running
- ✅ API Gateway with custom domain (optional)
- ✅ CloudWatch monitoring enabled
- ✅ Full type safety across the stack

**Traditional way:** 2-4 weeks + $5K-50K in developer time
**JustCopy.ai way:** 10 minutes + FREE

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [JustCopy.ai Platform](https://justcopy.ai)

## 🤝 Contributing

Found a bug or want to improve this template?

1. Submit issues on GitHub
2. Create pull requests
3. Share improvements with the community

Once merged, your improvements are instantly available to all JustCopy.ai users!

## 📜 License

This project is licensed under the JustCopy Source License (JSL):
- ✅ **FREE** for personal use and learning
- ✅ **UNLIMITED commercial use** when deployed via JustCopy.ai
- ⚠️ **Commercial license required** for direct commercial use without JustCopy.ai

See [LICENSE](../../LICENSE) for details.

---

## 🎓 Who Is This For?

### ✅ Perfect For:
- **Startup Founders**: Ship MVP in days, not months
- **Solo Developers**: Get enterprise-grade infrastructure without the complexity
- **Agencies**: Deliver client projects 10x faster
- **Students**: Learn AWS/serverless with production-ready code
- **Teams**: Standardize on proven patterns

### ❌ Not Recommended If:
- You need on-premise deployment (this is AWS-only)
- You want a monolithic architecture (this is microservices)
- You prefer managing servers manually

---

## 🌟 What Developers Are Saying

> "Went from idea to deployed API in 8 minutes. The AI asked me exactly the right questions about my AWS setup. Mind blown."
>
> — **Sarah Chen**, Indie Hacker

> "We use JustCopy.ai templates as our starting point for every client project. Saved us literally 100+ hours of boilerplate work."
>
> — **Marcus Rodriguez**, Agency CTO

> "The AI understood 'add Stripe subscriptions' and modified 15 files correctly. This is the future of development."
>
> — **Priya Patel**, Full-Stack Developer

---

## 🔥 Compare: JustCopy.ai vs Traditional Approach

| Task | Traditional Way | JustCopy.ai | Time Saved |
|------|----------------|-------------|------------|
| Initial setup | 2-4 hours | 2 minutes | **98% faster** |
| Add authentication | 1-2 days | 5 minutes | **99% faster** |
| Add payments | 2-3 days | 10 minutes | **99% faster** |
| Configure CDK | 4-8 hours | Done for you | **100% faster** |
| Database schema design | 1-2 days | Ask AI, get optimal design | **95% faster** |
| Deploy to AWS | 2-4 hours (first time) | 3 minutes | **97% faster** |
| **Total to production** | **2-4 weeks** | **10 minutes** | **99.8% faster** |

**ROI:** For a $150K/year developer, JustCopy.ai saves **$5K-50K per project**.

---

## 🎯 Ready to Ship 10x Faster?

<div align="center">

### **Don't spend weeks configuring AWS. Let AI do it in minutes.**

<br/>

<a href="https://justcopy.ai">
  <img src="https://img.shields.io/badge/🚀_START_BUILDING-FREE_(100K_Tokens)-00D9FF?style=for-the-badge&labelColor=1e293b&color=00D9FF" alt="Start Free">
</a>

<br/>
<br/>

**🎁 Get 100,000 FREE tokens** • No credit card • Deploy in 10 minutes

<br/>

<a href="https://justcopy.ai/referral">
  <img src="https://img.shields.io/badge/💰_REFER_&_EARN-50K_Tokens_Per_Friend-8B5CF6?style=for-the-badge&labelColor=1e293b&color=8B5CF6" alt="Referral">
</a>

<br/>
<br/>

**Share JustCopy.ai → Your friends get 100K tokens → You get 50K tokens**

<br/>
<br/>

---

### 🔗 Quick Links

[🏠 JustCopy.ai Home](https://justcopy.ai) • [📚 All Templates](https://justcopy.ai/templates) • [💬 Discord Community](https://justcopy.ai/discord) • [📖 Documentation](https://justcopy.ai/docs) • [🐦 Twitter Updates](https://justcopy.ai/twitter)

---

<sub>Built with ❤️ by developers, for developers • Open Source (JSL License) • AI-Native • Production-Ready</sub>

<br/>

**[JustCopy.ai](https://justcopy.ai)** - Copy. Customize. Deploy. 🚀

</div>
