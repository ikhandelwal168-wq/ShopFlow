# Quick Start Guide - How to Open SubSaver

## 🚀 Quick Start (If dependencies already installed)

### Step 1: Start the Backend Server

Open a terminal and run:
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Step 2: Start the Frontend Server

Open a **NEW terminal** (keep the backend running) and run:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000` (or another port if 3000 is taken)

### Step 3: Open in Browser

Open your browser and go to:
```
http://localhost:3000
```

You should see the login page!

---

## 📋 Full Setup (First Time)

If you haven't installed dependencies yet, follow these steps:

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Set Up Database (PostgreSQL Required)

**Option A: Using PostgreSQL locally**
```bash
# Create database
createdb subsaver

# Or using psql:
psql -U postgres
CREATE DATABASE subsaver;
\q
```

**Option B: Using a cloud database (Supabase, Railway, etc.)**
- Get your database URL from your provider

### 4. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/subsaver"
JWT_SECRET="your-random-secret-key-here"
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-secret"
PLAID_ENV="sandbox"
PORT=5000
```

**Quick JWT_SECRET generator:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**For Plaid (optional - only needed for bank integration):**
1. Sign up at https://dashboard.plaid.com/
2. Create a new application
3. Copy your sandbox Client ID and Secret

### 5. Set Up Database Schema

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed  # Optional: seed alternatives data
cd ..
```

### 6. Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### 7. Open the App

Go to `http://localhost:3000` in your browser!

---

## 🎯 First Steps After Opening

1. **Register a new account** at `/register`
2. **Login** with your credentials
3. **Add a subscription** manually using the "Add Subscription" button
4. **View analytics** on the dashboard
5. **Connect bank** (optional) using Plaid sandbox credentials

---

## ⚠️ Troubleshooting

### "Cannot connect to API"
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify `vite.config.ts` has proxy configured

### "Database connection error"
- Make sure PostgreSQL is running
- Check DATABASE_URL in `backend/.env`
- Run migrations: `cd backend && npx prisma migrate dev`

### "Port already in use"
- Change PORT in `backend/.env` to a different port
- Or kill the process using that port

### "Module not found"
- Run `npm install` in both frontend and backend directories
- Delete `node_modules` and reinstall if needed

---

## 📝 Notes

- **Backend must be running** before frontend can work
- **Database must be set up** before backend can start
- **Plaid is optional** - you can use the app without it (manual entry only)
- Use **Plaid sandbox** credentials for testing (free)

---

## 🎉 You're Ready!

Once both servers are running, the app is ready to use!
