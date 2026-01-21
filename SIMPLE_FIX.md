# Simple Fix - 3 Easy Steps

## The Problem
Your Mac can't connect to Supabase (network issue).

## The Solution
Use a LOCAL database instead (no internet needed!)

---

## Step 1: Install PostgreSQL (if not installed)

**Open Terminal and paste this:**

```bash
brew install postgresql@14
```

Wait for it to finish (takes 2-3 minutes).

---

## Step 2: Start PostgreSQL

**In Terminal, paste:**

```bash
brew services start postgresql@14
```

---

## Step 3: Create Database

**In Terminal, paste:**

```bash
createdb subsaver
```

---

## Done! 

Tell me when you've done these 3 steps, and I'll:
- Update the connection string
- Restart everything
- Make it work!

---

**That's it - just 3 commands!**
