#!/bin/bash

# Script to update password in .env file

echo "🔐 Update Supabase Password in .env"
echo ""
read -sp "Enter your Supabase database password: " PASSWORD
echo ""

if [ -z "$PASSWORD" ]; then
    echo "❌ No password provided. Exiting."
    exit 1
fi

# Escape special characters in password for sed
ESCAPED_PASSWORD=$(printf '%s\n' "$PASSWORD" | sed 's/[[\.*^$()+?{|]/\\&/g')

# Update .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\[YOUR-PASSWORD\]/$ESCAPED_PASSWORD/g" .env
else
    # Linux
    sed -i "s/\[YOUR-PASSWORD\]/$ESCAPED_PASSWORD/g" .env
fi

echo "✅ Password updated in .env file"
echo ""
echo "Next: Testing database connection..."
