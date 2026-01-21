# Supabase Database Setup Guide

## Step 1: Create Supabase Account & Project

1. Go to **https://supabase.com/**
2. Click **"Start your project"** or **"Sign in"**
3. Sign up with GitHub, Google, or email (free)
4. Click **"New Project"**
5. Fill in:
   - **Name:** subsaver (or any name)
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
6. Click **"Create new project"**
7. Wait 2-3 minutes for project to be created

## Step 2: Get Database Connection String

1. In your Supabase project dashboard, go to **Settings** (gear icon in sidebar)
2. Click **"Database"** in the left menu
3. Scroll down to **"Connection string"** section
4. Find **"URI"** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Important:** Replace `[YOUR-PASSWORD]` with the password you created in Step 1

## Step 3: Update .env File

Once you have the connection string, run this command (replace with your actual connection string):

```bash
cd /Users/hemsons/Portfolio/backend
```

Then we'll update the .env file with your Supabase connection string.

## Step 4: Run Migrations

After updating .env, we'll run:
```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

---

**Ready?** Once you have your Supabase connection string, let me know and I'll help you update the .env file and run the migrations!
