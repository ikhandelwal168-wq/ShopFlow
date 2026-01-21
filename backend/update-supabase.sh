#!/bin/bash

# Script to update .env file with Supabase connection string

echo "🔧 Supabase Database Setup"
echo ""
echo "Please provide your Supabase connection string."
echo "You can find it in: Supabase Dashboard → Settings → Database → Connection string → URI"
echo ""
echo "Format: postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
echo ""
read -p "Enter your Supabase DATABASE_URL: " SUPABASE_URL

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ No connection string provided. Exiting."
    exit 1
fi

# Backup existing .env
if [ -f .env ]; then
    cp .env .env.backup
    echo "✅ Backed up existing .env to .env.backup"
fi

# Update DATABASE_URL in .env
if [ -f .env ]; then
    # Use sed to replace DATABASE_URL line
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$SUPABASE_URL\"|" .env
    else
        # Linux
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$SUPABASE_URL\"|" .env
    fi
else
    # Create new .env file
    cat > .env << EOF
DATABASE_URL="$SUPABASE_URL"
JWT_SECRET="d269943be28280bcba394e541bd8be7540f559dbc41804f9b7f8a736898c4a57"
PLAID_CLIENT_ID=""
PLAID_SECRET=""
PLAID_ENV="sandbox"
PORT=5000
EOF
fi

echo ""
echo "✅ Updated .env file with Supabase connection string"
echo ""
echo "Next steps:"
echo "1. Verify connection: npx prisma db pull"
echo "2. Run migrations: npx prisma migrate dev --name init"
echo "3. Seed database: npm run prisma:seed"
echo ""
