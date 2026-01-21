# SubSaver Setup Guide

This guide will help you set up the SubSaver application from scratch.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Plaid Account** (for bank integration) - [Sign up](https://plaid.com/) (free sandbox account available)

## Step 1: Clone and Install Dependencies

1. **Frontend dependencies:**
```bash
npm install
```

2. **Backend dependencies:**
```bash
cd backend
npm install
cd ..
```

## Step 2: Set Up PostgreSQL Database

1. **Create a PostgreSQL database:**
```bash
# Using psql
psql -U postgres
CREATE DATABASE subsaver;
\q

# Or using createdb command
createdb subsaver
```

2. **Get your database connection string:**
```
postgresql://username:password@localhost:5432/subsaver
```

## Step 3: Configure Environment Variables

### Backend Configuration

1. **Create backend `.env` file:**
```bash
cd backend
cp .env.example .env
```

2. **Edit `backend/.env` with your values:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/subsaver"
JWT_SECRET="generate-a-random-secret-key-here"
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-secret"
PLAID_ENV="sandbox"
PORT=5000
```

**To get Plaid credentials:**
1. Sign up at [Plaid Dashboard](https://dashboard.plaid.com/)
2. Create a new application
3. Copy your Client ID and Secret (use sandbox keys for development)

**To generate JWT_SECRET:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Configuration (Optional)

The frontend uses Vite's proxy by default. If you need to configure a different API URL:

1. Create `.env` file in the root:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Set Up Database Schema

1. **Run Prisma migrations:**
```bash
cd backend
npx prisma migrate dev --name init
```

2. **Generate Prisma Client:**
```bash
npx prisma generate
```

3. **Seed alternatives data (optional):**
```bash
npm run prisma:seed
```

## Step 5: Start the Application

### Development Mode

1. **Start the backend server** (in one terminal):
```bash
cd backend
npm run dev
```

The backend should start on `http://localhost:5000`

2. **Start the frontend server** (in another terminal):
```bash
npm run dev
```

The frontend should start on `http://localhost:3000`

### Verify Installation

1. **Backend health check:**
```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend:**
Open `http://localhost:3000` in your browser

## Step 6: Create Your First Account

1. Navigate to `http://localhost:3000/register`
2. Create an account with your email and password
3. You'll be automatically logged in and redirected to the dashboard

## Step 7: Add Subscriptions

### Manual Entry
1. Click "Add Subscription" button
2. Fill in the form:
   - Service name (e.g., "Netflix")
   - Amount (e.g., 15.99)
   - Billing cycle (monthly/yearly/weekly)
   - Next billing date
   - Category

### Auto-Detection (via Plaid)
1. Click "Connect Bank" button
2. Use Plaid's sandbox credentials:
   - Username: `user_good`
   - Password: `pass_good`
3. Select a bank (any sandbox bank works)
4. The app will analyze your transactions and detect subscriptions

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env`
- Verify database exists: `psql -U postgres -l`

**Error: "relation does not exist"**
- Run migrations: `cd backend && npx prisma migrate dev`

### Backend Issues

**Error: "Port 5000 already in use"**
- Change PORT in `.env` to a different port
- Update frontend proxy in `vite.config.ts` if needed

**Error: "JWT_SECRET is not defined"**
- Make sure `.env` file exists in backend directory
- Check that JWT_SECRET is set

### Frontend Issues

**Error: "Cannot connect to API"**
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.ts`

**Error: "Module not found"**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

### Plaid Issues

**Error: "Invalid client_id"**
- Verify PLAID_CLIENT_ID and PLAID_SECRET in `.env`
- Make sure you're using sandbox credentials for development
- Check Plaid dashboard for correct credentials

## Development Tips

### View Database

Use Prisma Studio to view and edit your database:
```bash
cd backend
npm run prisma:studio
```

Opens at `http://localhost:5555`

### Reset Database

To reset your database (⚠️ deletes all data):
```bash
cd backend
npx prisma migrate reset
```

### Check Logs

- Backend logs appear in the terminal where `npm run dev` is running
- Frontend errors appear in browser console (F12)

## Next Steps

- Add more subscriptions manually
- Connect your bank account (sandbox mode)
- Explore the analytics dashboard
- Check out alternatives for your subscriptions

## Production Deployment

See the main README.md for deployment instructions to Vercel (frontend) and Railway/Render (backend).

## Getting Help

- Check the main README.md for API documentation
- Review Prisma documentation: https://www.prisma.io/docs
- Review Plaid documentation: https://plaid.com/docs
- Check React Query documentation: https://tanstack.com/query
