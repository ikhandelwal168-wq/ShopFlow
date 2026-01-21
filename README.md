# SubSaver - Subscription Analysis App

A full-stack web application that helps users track their subscriptions, find cheaper alternatives, and manage recurring expenses.

## Features

- 📊 **Dashboard** - View all subscriptions with spending analytics
- 🔍 **Auto-Detection** - Automatically detect subscriptions from bank transactions (via Plaid)
- 💰 **Savings Calculator** - Find cheaper alternatives and calculate potential savings
- 📈 **Analytics** - Visual charts showing spending by category
- 🔔 **Renewal Tracking** - Never miss a subscription renewal
- 🏦 **Bank Integration** - Connect bank accounts via Plaid to track transactions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **Recharts** - Data visualization
- **React Router** - Routing
- **React Plaid Link** - Bank account integration

### Backend
- **Node.js** with Express and TypeScript
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Plaid API** - Banking integration
- **JWT** - Authentication
- **Zod** - Schema validation

## Project Structure

```
Portfolio/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app component
├── backend/               # Backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utilities
│   └── prisma/            # Prisma schema and migrations
├── package.json           # Frontend dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Plaid account (for bank integration - sandbox mode available)

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/subsaver"
JWT_SECRET="your-super-secret-jwt-key"
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-secret"
PLAID_ENV="sandbox"
PORT=5000
```

4. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Seed alternatives data (optional):
```bash
npx ts-node prisma/seed.ts
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Subscriptions
- `GET /api/subscriptions` - Get all user subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `POST /api/subscriptions/detect` - Auto-detect from transactions
- `GET /api/subscriptions/analytics` - Get spending analytics

### Plaid
- `POST /api/plaid/create-link-token` - Generate Plaid Link token
- `POST /api/plaid/exchange-token` - Exchange public token
- `GET /api/plaid/transactions` - Get transactions

### Alternatives
- `GET /api/alternatives/:serviceName` - Get alternatives for a service
- `GET /api/alternatives/savings` - Calculate potential savings

## Development

### Frontend Development
- The frontend uses Vite for fast HMR (Hot Module Replacement)
- TypeScript is configured with strict mode
- Tailwind CSS is used for styling

### Backend Development
- TypeScript with Express
- Prisma for database operations
- JWT for authentication
- Plaid SDK for banking integration

## Deployment

### Frontend (Vercel)
1. Build the frontend:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

### Backend (Railway/Render)
1. Set environment variables in your hosting platform
2. Run migrations:
```bash
npx prisma migrate deploy
```

3. Start the server:
```bash
npm start
```

## Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL (default: `/api`)

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PLAID_CLIENT_ID` - Plaid API client ID
- `PLAID_SECRET` - Plaid API secret
- `PLAID_ENV` - Plaid environment (sandbox/production)
- `PORT` - Server port (default: 5000)

## Features in Detail

### Subscription Detection Algorithm
The app analyzes transaction patterns to detect subscriptions:
- Groups transactions by merchant name
- Calculates intervals between transactions
- Identifies recurring patterns (monthly, yearly, weekly)
- Filters out one-time purchases
- Provides confidence scores for each detection

### Alternatives Database
Pre-populated with common services and their alternatives:
- Streaming services (Netflix, Spotify, etc.)
- Software subscriptions (Adobe, Microsoft 365, etc.)
- Each alternative includes price, features, and potential savings

### Analytics Dashboard
- Total monthly/yearly spend
- Category breakdown (pie chart)
- Upcoming renewals timeline
- Potential savings calculation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Future Enhancements

- [ ] Email notifications for renewals
- [ ] Usage tracking and cost-per-use metrics
- [ ] Export data (CSV/PDF)
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Subscription sharing with family/friends
- [ ] Price change alerts