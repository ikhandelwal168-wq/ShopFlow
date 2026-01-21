# Installation Instructions

Due to npm log file permissions, please run these commands manually in your terminal.

## Step 1: Install Backend Dependencies

Open your terminal and run:

```bash
cd /Users/hemsons/Portfolio/backend
npm install
```

**Note:** Frontend dependencies are already installed ✓

## Step 2: Set Up Database

You have two options:

### Option A: Install PostgreSQL Locally

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Then create database:**
```bash
createdb subsaver
```

### Option B: Use Cloud Database (Easier - Recommended)

1. Go to https://supabase.com/
2. Sign up for free account
3. Create a new project
4. Go to Settings → Database
5. Copy the connection string (URI format)

## Step 3: Configure Environment Variables

1. Create `.env` file in backend folder:
```bash
cd /Users/hemsons/Portfolio/backend
cp .env.example .env
```

2. Edit `backend/.env` and add:

**For local PostgreSQL:**
```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/subsaver"
JWT_SECRET="paste-generated-secret-here"
PLAID_CLIENT_ID=""
PLAID_SECRET=""
PLAID_ENV="sandbox"
PORT=5000
```

**For Supabase:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
JWT_SECRET="paste-generated-secret-here"
PLAID_CLIENT_ID=""
PLAID_SECRET=""
PLAID_ENV="sandbox"
PORT=5000
```

3. Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as `JWT_SECRET` in `.env`

## Step 4: Set Up Database Schema

```bash
cd /Users/hemsons/Portfolio/backend
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

## Step 5: Start the Application

**Terminal 1 (Backend):**
```bash
cd /Users/hemsons/Portfolio/backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd /Users/hemsons/Portfolio
npm run dev
```

## Step 6: Open in Browser

Go to: http://localhost:3000

---

## Quick Setup Script

You can also run the setup script:

```bash
cd /Users/hemsons/Portfolio
./setup.sh
```

This will guide you through the setup process.
