# SubSaver Backend

Backend API for the SubSaver subscription tracking application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up PostgreSQL database and run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PLAID_CLIENT_ID`: Plaid API client ID
- `PLAID_SECRET`: Plaid API secret
- `PLAID_ENV`: Plaid environment (sandbox/production)
- `PORT`: Server port (default: 5000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Subscriptions
- `GET /api/subscriptions` - Get all user subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `POST /api/subscriptions/detect` - Auto-detect from transactions
- `GET /api/subscriptions/analytics` - Get spending analytics

### Plaid
- `POST /api/plaid/create-link-token` - Generate Plaid Link token
- `POST /api/plaid/exchange-token` - Exchange public token
- `GET /api/plaid/transactions` - Get transactions

### Alternatives
- `GET /api/alternatives/:serviceName` - Get alternatives for a service
- `GET /api/alternatives/savings` - Calculate potential savings
