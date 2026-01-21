# Detailed Step-by-Step Setup Guide for SubSaver

This guide will walk you through every single step needed to get SubSaver running on your computer.

---

## Prerequisites Check

Before we start, make sure you have these installed:

### 1. Check Node.js Installation

Open your terminal and run:
```bash
node --version
```

**Expected output:** Should show v18.0.0 or higher (e.g., `v18.17.0`)

**If not installed:**
- Download from: https://nodejs.org/
- Install the LTS (Long Term Support) version
- Restart your terminal after installation

### 2. Check npm Installation

```bash
npm --version
```

**Expected output:** Should show version number (e.g., `9.6.7`)

npm comes with Node.js, so if Node.js is installed, npm should work too.

### 3. Check PostgreSQL Installation (for database)

```bash
psql --version
```

**Expected output:** Should show version number (e.g., `PostgreSQL 14.9`)

**If not installed:**
- **macOS:** `brew install postgresql@14` (if you have Homebrew)
- **Windows:** Download from https://www.postgresql.org/download/windows/
- **Linux:** `sudo apt-get install postgresql` (Ubuntu/Debian)

**Note:** If you don't want to install PostgreSQL locally, you can use a cloud database like:
- Supabase (free tier available): https://supabase.com/
- Railway: https://railway.app/
- Render: https://render.com/

---

## Step 1: Navigate to Project Directory

Open your terminal and navigate to the project folder:

```bash
cd /Users/hemsons/Portfolio
```

**Verify you're in the right place:**
```bash
ls
```

You should see folders like `src`, `backend`, `package.json`, etc.

---

## Step 2: Install Frontend Dependencies

### 2.1 Check if dependencies are already installed

```bash
ls node_modules
```

If you see a long list of folders, dependencies are already installed. Skip to Step 3.

### 2.2 Install frontend dependencies

```bash
npm install
```

**What this does:**
- Reads `package.json` to see what packages are needed
- Downloads all required packages (React, TypeScript, Tailwind, etc.)
- Creates `node_modules` folder with all dependencies
- Creates `package-lock.json` to lock versions

**Expected output:**
```
added 234 packages, and audited 235 packages in 45s
```

**Time:** This may take 2-5 minutes depending on your internet speed.

**If you get errors:**
- Make sure you have internet connection
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- Check Node.js version is 18+

---

## Step 3: Install Backend Dependencies

### 3.1 Navigate to backend folder

```bash
cd backend
```

### 3.2 Install backend dependencies

```bash
npm install
```

**What this does:**
- Installs Express, Prisma, Plaid SDK, and other backend packages
- Creates `node_modules` folder in the backend directory

**Expected output:**
```
added 156 packages, and audited 157 packages in 30s
```

**Time:** This may take 1-3 minutes.

### 3.3 Go back to project root

```bash
cd ..
```

---

## Step 4: Set Up PostgreSQL Database

You have two options:

### Option A: Local PostgreSQL Database

#### 4.1 Start PostgreSQL service

**macOS (with Homebrew):**
```bash
brew services start postgresql@14
```

**macOS (without Homebrew):**
```bash
# PostgreSQL usually starts automatically, but if not:
pg_ctl -D /usr/local/var/postgres start
```

**Windows:**
- PostgreSQL usually runs as a Windows service
- Check Services app to ensure "postgresql" service is running

**Linux:**
```bash
sudo systemctl start postgresql
```

#### 4.2 Create the database

**Method 1: Using createdb command**
```bash
createdb subsaver
```

**Method 2: Using psql**
```bash
psql -U postgres
```

Then in the psql prompt:
```sql
CREATE DATABASE subsaver;
\q
```

**Method 3: If you need to specify a user**
```bash
psql -U your_username -d postgres
```

Then:
```sql
CREATE DATABASE subsaver;
\q
```

#### 4.3 Verify database was created

```bash
psql -U postgres -l
```

Look for `subsaver` in the list.

### Option B: Cloud Database (Easier for beginners)

#### 4.1 Sign up for Supabase (Free)

1. Go to https://supabase.com/
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project
5. Wait for project to be created (takes ~2 minutes)

#### 4.2 Get your database URL

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** connection string
4. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

**Note:** Replace `[YOUR-PASSWORD]` with your actual database password (shown when you created the project)

---

## Step 5: Configure Backend Environment Variables

### 5.1 Create .env file

```bash
cd backend
cp .env.example .env
```

**What this does:**
- Copies the example environment file to create your actual `.env` file
- The `.env` file stores your configuration (database URL, API keys, etc.)

### 5.2 Open .env file in a text editor

You can use:
- **VS Code:** `code .env`
- **Nano (terminal):** `nano .env`
- **Vim:** `vim .env`
- **Any text editor:** Open `backend/.env` in your preferred editor

### 5.3 Fill in the environment variables

Edit the `.env` file and replace the placeholder values:

```env
# Database URL
# For local PostgreSQL:
DATABASE_URL="postgresql://username:password@localhost:5432/subsaver"

# For Supabase (cloud):
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# JWT Secret (for authentication tokens)
# Generate a random secret:
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Plaid Configuration (Optional - only if you want bank integration)
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-secret"
PLAID_ENV="sandbox"

# Server Port
PORT=5000
```

#### 5.3.1 Generate JWT Secret

In your terminal, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Expected output:** A long random string like `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

Copy this string and paste it as your `JWT_SECRET` value.

#### 5.3.2 Get Plaid Credentials (Optional)

**Only needed if you want to connect bank accounts.**

1. Go to https://dashboard.plaid.com/
2. Sign up for a free account
3. Click "Get API Keys"
4. Select "Sandbox" environment (for testing)
5. Copy your **Client ID** and **Secret**
6. Paste them in `.env` file

**For testing without real bank accounts:**
- Use Plaid's sandbox mode
- Test credentials: `user_good` / `pass_good`
- Any bank in the list will work

#### 5.3.3 Example .env file (Local PostgreSQL)

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/subsaver"
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-secret"
PLAID_ENV="sandbox"
PORT=5000
```

#### 5.3.4 Example .env file (Supabase)

```env
DATABASE_URL="postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.abcdefghijklmnop.supabase.co:5432/postgres"
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-secret"
PLAID_ENV="sandbox"
PORT=5000
```

**Important:** 
- Don't use quotes around the values (or use them consistently)
- Don't add spaces around the `=` sign
- Save the file after editing

---

## Step 6: Set Up Database Schema

### 6.1 Navigate to backend folder

```bash
cd backend
```

### 6.2 Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

**What this does:**
- Creates the database tables (User, Subscription, PlaidItem, Alternative)
- Sets up relationships between tables
- Creates migration files to track changes

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "subsaver", schema "public" at "localhost:5432"

✔ Generated Prisma Client (v5.10.2) in 234ms

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240106123456_init/
    └─ migration.sql

✔ Migration applied successfully.
```

**If you get errors:**
- Check your `DATABASE_URL` in `.env` is correct
- Make sure PostgreSQL is running
- Verify database exists: `psql -U postgres -l`

### 6.3 Generate Prisma Client

```bash
npx prisma generate
```

**What this does:**
- Generates TypeScript types for your database
- Creates Prisma Client that you'll use to query the database

**Expected output:**
```
✔ Generated Prisma Client (v5.10.2) in 234ms
```

### 6.4 (Optional) Seed alternatives data

```bash
npm run prisma:seed
```

**What this does:**
- Adds sample data for alternatives (Netflix alternatives, Spotify alternatives, etc.)
- Makes the alternatives feature work immediately

**Expected output:**
```
Seeded alternatives data
```

---

## Step 7: Start the Backend Server

### 7.1 Make sure you're in the backend folder

```bash
cd backend
```

### 7.2 Start the development server

```bash
npm run dev
```

**What this does:**
- Starts the Express server
- Watches for file changes and auto-restarts
- Connects to your database

**Expected output:**
```
Server running on port 5000
```

**Keep this terminal open!** The backend needs to keep running.

**If you get errors:**

**Error: "Cannot find module '@prisma/client'"**
```bash
npx prisma generate
```

**Error: "Port 5000 already in use"**
- Change `PORT=5001` in `.env` file
- Or kill the process using port 5000:
  ```bash
  # macOS/Linux:
  lsof -ti:5000 | xargs kill
  
  # Windows:
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

**Error: "Database connection error"**
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Test connection: `psql "postgresql://username:password@localhost:5432/subsaver"`

---

## Step 8: Start the Frontend Server

### 8.1 Open a NEW terminal window

**Important:** Keep the backend terminal running, open a new terminal for the frontend.

### 8.2 Navigate to project root

```bash
cd /Users/hemsons/Portfolio
```

### 8.3 Start the frontend development server

```bash
npm run dev
```

**What this does:**
- Starts Vite development server
- Compiles TypeScript and React code
- Serves the app on a local port
- Hot-reloads when you make changes

**Expected output:**
```
  VITE v5.4.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Note:** The port might be different (3000, 5173, etc.) - use whatever port is shown.

**Keep this terminal open too!**

**If you get errors:**

**Error: "Port already in use"**
- Vite will automatically try the next port
- Or specify a port: `npm run dev -- --port 3001`

**Error: "Cannot find module"**
```bash
npm install
```

---

## Step 9: Open the Application in Browser

### 9.1 Open your web browser

Use Chrome, Firefox, Safari, or Edge.

### 9.2 Navigate to the frontend URL

Go to the URL shown in your frontend terminal, typically:
```
http://localhost:3000
```

Or whatever port was shown (e.g., `http://localhost:5173`)

### 9.3 What you should see

- **Login page** with "Sign in to SubSaver" heading
- Email and password fields
- "Sign in" and "Sign up" buttons

**If you see an error:**
- Make sure backend is running (check Terminal 1)
- Make sure frontend is running (check Terminal 2)
- Check browser console (F12) for errors
- Verify both servers are on the correct ports

---

## Step 10: Create Your First Account

### 10.1 Click "Sign up" or navigate to register page

Click the "Don't have an account? Sign up" link, or go to:
```
http://localhost:3000/register
```

### 10.2 Fill in the registration form

- **Name:** (Optional) Your name
- **Email:** Your email address
- **Password:** At least 6 characters

### 10.3 Click "Sign up"

**What happens:**
- Account is created in the database
- You're automatically logged in
- You're redirected to the dashboard

### 10.4 You should now see the Dashboard

- Welcome message
- Stats cards (Monthly Spend, Yearly Spend, etc.)
- "Add Subscription" button
- Empty subscription list

---

## Step 11: Add Your First Subscription

### 11.1 Click "Add Subscription" button

Located in the top right of the dashboard.

### 11.2 Fill in the form

Example:
- **Service Name:** Netflix
- **Amount:** 15.99
- **Currency:** USD
- **Billing Cycle:** Monthly
- **Next Billing Date:** Pick a date (e.g., next month)
- **Category:** streaming

### 11.3 Click "Add Subscription"

**What happens:**
- Subscription is saved to database
- Appears in your subscription list
- Analytics update automatically

### 11.4 View your subscription

You should see:
- Subscription card with name, amount, next billing date
- Category badge
- Activate/Deactivate button
- Delete button
- View Alternatives button (🔍 icon)

---

## Step 12: Explore Features

### 12.1 View Analytics

Scroll down on the dashboard to see:
- **Category Breakdown** pie chart
- **Total Monthly/Yearly Spend** cards
- **Potential Savings** (if alternatives exist)

### 12.2 View Alternatives

1. Click the search icon (🔍) on any subscription
2. See cheaper alternatives with:
   - Price comparison
   - Monthly savings
   - Features list
   - Links to learn more

### 12.3 Connect Bank Account (Optional)

1. Click "Connect Bank" button
2. If you configured Plaid:
   - Use sandbox credentials: `user_good` / `pass_good`
   - Select any bank
   - Transactions will be analyzed for subscriptions

**If Plaid is not configured:**
- This feature won't work
- You can still add subscriptions manually
- Plaid is optional

---

## Troubleshooting Common Issues

### Issue: "Cannot connect to API"

**Symptoms:** Frontend shows error, can't load data

**Solutions:**
1. Check backend is running (Terminal 1)
2. Check backend is on port 5000 (or port in `.env`)
3. Check `vite.config.ts` has proxy configured:
   ```typescript
   server: {
     proxy: {
       "/api": {
         target: "http://localhost:5000",
         changeOrigin: true,
       },
     },
   }
   ```
4. Restart both servers

### Issue: "Database connection error"

**Symptoms:** Backend won't start, shows database error

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```
2. Test database connection:
   ```bash
   psql "postgresql://username:password@localhost:5432/subsaver"
   ```
3. Verify `DATABASE_URL` in `.env` is correct
4. Check database exists: `psql -U postgres -l`

### Issue: "Module not found"

**Symptoms:** Error about missing packages

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Do the same for backend:
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: "Port already in use"

**Symptoms:** Server won't start, port error

**Solutions:**
1. Change port in `.env` (backend) or `vite.config.ts` (frontend)
2. Or kill the process using the port:
   ```bash
   # Find process
   lsof -i :5000
   
   # Kill it
   kill -9 <PID>
   ```

### Issue: "Prisma Client not generated"

**Symptoms:** Backend error about Prisma Client

**Solutions:**
```bash
cd backend
npx prisma generate
```

---

## Quick Command Reference

### Start Everything

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

### Database Commands

```bash
# Run migrations
cd backend
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# View database in browser
npx prisma studio

# Seed data
npm run prisma:seed
```

### Useful URLs

- Frontend: http://localhost:3000 (or port shown)
- Backend API: http://localhost:5000
- Backend Health: http://localhost:5000/health
- Prisma Studio: http://localhost:5555 (when running `npx prisma studio`)

---

## Next Steps

1. ✅ Add more subscriptions manually
2. ✅ Explore the analytics dashboard
3. ✅ Check out alternatives for your subscriptions
4. ✅ (Optional) Set up Plaid for bank integration
5. ✅ Customize the app to your needs

---

## Getting Help

If you're stuck:
1. Check the error message carefully
2. Check both terminal windows for errors
3. Check browser console (F12 → Console tab)
4. Verify all prerequisites are installed
5. Make sure both servers are running
6. Check `.env` file configuration

---

## Congratulations! 🎉

You've successfully set up and run SubSaver! The app is now ready to help you track your subscriptions and save money.
