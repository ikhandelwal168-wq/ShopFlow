# Step-by-Step: Creating Your Supabase Account & Project

Follow these steps exactly to create your Supabase database.

---

## Step 1: Go to Supabase Website

1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: **https://supabase.com/**
3. You'll see the Supabase homepage

---

## Step 2: Sign Up for Free Account

1. Click the **"Start your project"** button (usually in the top right or center of the page)
   - OR click **"Sign in"** if you see that instead, then click **"Sign up"**

2. Choose how to sign up:
   - **Option A: Sign up with GitHub** (Recommended - fastest)
     - Click "Continue with GitHub"
     - Authorize Supabase to access your GitHub
   - **Option B: Sign up with Google**
     - Click "Continue with Google"
     - Sign in with your Google account
   - **Option C: Sign up with Email**
     - Enter your email address
     - Enter a password (at least 8 characters)
     - Click "Sign up"
     - Check your email and click the verification link

3. After signing up, you'll be redirected to the Supabase dashboard

---

## Step 3: Create a New Project

1. In the Supabase dashboard, you'll see:
   - A welcome message or your projects list
   - Click the **"New Project"** button (usually green, top right)

2. Fill in the project details:

   **Organization:**
   - If this is your first project, it will create a default organization
   - You can keep the default or create a new one
   - Click "Create new organization" if needed
   - Give it a name (e.g., "My Projects")

   **Project Details:**
   - **Name:** Enter `subsaver` (or any name you like)
   - **Database Password:** 
     - **IMPORTANT:** Create a STRONG password (at least 12 characters)
     - Use a mix of letters, numbers, and symbols
     - **WRITE THIS DOWN** - you'll need it for the connection string!
     - Example: `MySecurePass123!@#`
   
   **Region:**
   - Choose the region closest to you:
     - **US East** (if you're in USA/Canada)
     - **US West** (if you're on US West Coast)
     - **EU West** (if you're in Europe)
     - **Asia Pacific** (if you're in Asia)
   - This affects database speed

   **Pricing Plan:**
   - Select **"Free"** (it should be selected by default)
   - The free tier includes:
     - 500 MB database
     - 2 GB bandwidth
     - Perfect for development and small projects

3. Check the box: **"I agree to the Terms of Service"**

4. Click the **"Create new project"** button (green button at bottom)

---

## Step 4: Wait for Project to Initialize

1. You'll see a loading screen that says:
   - "Setting up your project..."
   - "Provisioning database..."
   - "Creating API..."

2. **This takes 2-3 minutes** - be patient!

3. You'll see progress indicators. Wait until you see:
   - ✅ "Project created successfully"
   - OR you're redirected to your project dashboard

---

## Step 5: Get Your Database Connection String

Once your project is ready:

1. In the left sidebar, click **"Settings"** (gear icon ⚙️)

2. In the Settings menu, click **"Database"**

3. Scroll down to find **"Connection string"** section

4. You'll see several tabs:
   - **URI** ← Click this tab
   - Transaction mode
   - Session mode
   - etc.

5. Under the **"URI"** tab, you'll see a connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```

6. **IMPORTANT:** 
   - The connection string has `[YOUR-PASSWORD]` as a placeholder
   - You need to **replace** `[YOUR-PASSWORD]` with the actual password you created in Step 3
   - For example, if your password was `MySecurePass123!@#`, the final string would be:
     ```
     postgresql://postgres:MySecurePass123!@#@db.abcdefghijklmnop.supabase.co:5432/postgres
     ```

7. **Copy the entire connection string** (with your password replaced)

---

## Step 6: Alternative - Get Connection Details Separately

If you prefer to build the connection string yourself:

1. In Settings → Database, you'll see:
   - **Host:** `db.xxxxx.supabase.co`
   - **Database name:** `postgres`
   - **Port:** `5432`
   - **User:** `postgres`
   - **Password:** (the one you created)

2. The connection string format is:
   ```
   postgresql://postgres:YOUR_PASSWORD@HOST:5432/postgres
   ```

---

## Step 7: Test Your Connection (Optional)

You can test if your connection string works:

1. Copy your connection string
2. I'll help you test it once you share it with me

---

## What You Need to Share With Me

Once you have your Supabase project set up, I need:

1. **Your connection string** - the full URI with your password
   - Format: `postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres`

OR

2. **Your connection details:**
   - Host
   - Password
   - (I can build the connection string for you)

---

## Troubleshooting

**Problem: "Project creation failed"**
- Wait a few minutes and try again
- Check your internet connection
- Try a different browser

**Problem: "Can't find connection string"**
- Make sure you're in Settings → Database
- Look for "Connection string" section (scroll down)
- Click the "URI" tab

**Problem: "Forgot my database password"**
- Go to Settings → Database
- Click "Reset database password"
- Create a new password
- Update your connection string

**Problem: "Connection string has [YOUR-PASSWORD]"**
- This is a placeholder - replace it with your actual password
- Make sure there are no spaces
- The password should match exactly what you created

---

## Security Note

⚠️ **Important:** 
- Never share your database password publicly
- The `.env` file should NOT be committed to git (it's already in .gitignore)
- Keep your Supabase password secure

---

## Next Steps After Getting Connection String

Once you have your connection string:

1. Share it with me, OR
2. Run: `cd /Users/hemsons/Portfolio/backend && ./update-supabase.sh`
3. I'll update the .env file and run migrations

---

**Ready to start?** Go to https://supabase.com/ and follow the steps above!

Let me know when you have your connection string, and I'll complete the setup! 🚀
