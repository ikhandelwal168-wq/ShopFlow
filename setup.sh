#!/bin/bash

# SubSaver Setup Script
# This script will install dependencies and help set up the database

echo "🚀 Starting SubSaver Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Install Frontend Dependencies
echo -e "${YELLOW}Step 1: Installing frontend dependencies...${NC}"
cd "$(dirname "$0")"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
else
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
        exit 1
    fi
fi

# Step 2: Install Backend Dependencies
echo ""
echo -e "${YELLOW}Step 2: Installing backend dependencies...${NC}"
cd backend
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
else
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo -e "${RED}✗ Failed to install backend dependencies${NC}"
        exit 1
    fi
fi

# Step 3: Check PostgreSQL
echo ""
echo -e "${YELLOW}Step 3: Checking PostgreSQL installation...${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is installed${NC}"
    psql --version
else
    echo -e "${RED}✗ PostgreSQL is not installed${NC}"
    echo ""
    echo "Please install PostgreSQL:"
    echo "  macOS: brew install postgresql@14"
    echo "  Or use a cloud database like Supabase (https://supabase.com)"
    echo ""
    read -p "Do you want to continue with database setup? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 4: Create .env file if it doesn't exist
echo ""
echo -e "${YELLOW}Step 4: Setting up environment variables...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env file from .env.example${NC}"
        echo -e "${YELLOW}⚠ Please edit backend/.env and add your database URL and JWT secret${NC}"
    else
        echo -e "${RED}✗ .env.example not found${NC}"
    fi
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Step 5: Generate JWT Secret
echo ""
echo -e "${YELLOW}Step 5: Generating JWT secret...${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null)
if [ -n "$JWT_SECRET" ]; then
    echo -e "${GREEN}✓ Generated JWT secret:${NC}"
    echo "$JWT_SECRET"
    echo ""
    echo "Add this to your backend/.env file as JWT_SECRET"
else
    echo -e "${YELLOW}⚠ Could not generate JWT secret automatically${NC}"
fi

# Step 6: Database setup instructions
echo ""
echo -e "${YELLOW}Step 6: Database Setup${NC}"
echo ""
echo "To set up the database, you need to:"
echo "1. Create a PostgreSQL database"
echo "2. Update DATABASE_URL in backend/.env"
echo "3. Run migrations"
echo ""
echo "Commands to run:"
echo "  # Create database (if using local PostgreSQL)"
echo "  createdb subsaver"
echo ""
echo "  # Or using psql:"
echo "  psql -U postgres"
echo "  CREATE DATABASE subsaver;"
echo "  \\q"
echo ""
echo "  # Then update backend/.env with:"
echo "  DATABASE_URL=\"postgresql://username:password@localhost:5432/subsaver\""
echo ""
echo "  # Run migrations"
echo "  cd backend"
echo "  npx prisma migrate dev"
echo "  npx prisma generate"
echo "  npm run prisma:seed"
echo ""

echo -e "${GREEN}✅ Setup script completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure backend/.env with your database URL and JWT secret"
echo "2. Create the database (see instructions above)"
echo "3. Run: cd backend && npx prisma migrate dev"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: npm run dev (in project root)"
