# Setup Status

## ✅ Completed

1. **Frontend Dependencies** - Already installed ✓
2. **Backend .env.example** - Created ✓
3. **JWT Secret Generated** - `d269943be28280bcba394e541bd8be7540f559dbc41804f9b7f8a736898c4a57`
4. **Setup Script** - Created (`setup.sh`) ✓

## ⚠️ Needs Manual Action

Due to npm log file permission issues, you need to run these commands manually:

### 1. Install Backend Dependencies

Open terminal and run:
```bash
cd /Users/hemsons/Portfolio/backend
npm install
```

### 2. Set Up Database

**Option A: Local PostgreSQL (if installed)**
```bash
# Create database
createdb subsaver
```

**Option B: Cloud Database (Recommended - Easier)**
- Go to https://supabase.com/
- Sign up (free)
- Create new project
- Copy database connection string from Settings → Database

### 3. Create .env File

```bash
cd /Users/hemsons/Portfolio/backend
cp .env.example .env
```

Then edit `backend/.env` and add:

```env
# For local PostgreSQL:
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/subsaver"

# OR for Supabase (cloud):
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

JWT_SECRET="d269943be28280bcba394e541bd8be7540f559dbc41804f9b7f8a736898c4a57"
PLAID_CLIENT_ID=""
PLAID_SECRET=""
PLAID_ENV="sandbox"
PORT=5000
```

### 4. Run Database Migrations

```bash
cd /Users/hemsons/Portfolio/backend
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

### 5. Start Servers

**Terminal 1:**
```bash
cd /Users/hemsons/Portfolio/backend
npm run dev
```

**Terminal 2:**
```bash
cd /Users/hemsons/Portfolio
npm run dev
```

### 6. Open Browser

Go to: http://localhost:3000

---

## Quick Reference

**All commands in one place:**
```bash
# 1. Install backend dependencies
cd /Users/hemsons/Portfolio/backend
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your database URL and JWT secret

# 3. Set up database (choose one):
# Local: createdb subsaver
# OR use Supabase cloud database

# 4. Run migrations
npx prisma migrate dev
npx prisma generate
npm run prisma:seed

# 5. Start backend (Terminal 1)
npm run dev

# 6. Start frontend (Terminal 2 - new terminal)
cd /Users/hemsons/Portfolio
npm run dev
```

---

## Troubleshooting

**npm install fails:**
- Make sure you have internet connection
- Try: `npm install --legacy-peer-deps`
- Or delete `node_modules` and `package-lock.json`, then reinstall

**Database connection error:**
- Check PostgreSQL is running: `brew services list` (macOS)
- Verify DATABASE_URL in `.env` is correct
- Test connection: `psql "your-database-url"`

**Port already in use:**
- Change PORT in `.env` to 5001
- Or kill process: `lsof -ti:5000 | xargs kill`
