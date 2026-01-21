export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: string;
  category: string;
  isActive: boolean;
  lastUsedDate?: string;
  createdAt: string;
  updatedAt: string;
  plaidItemId?: string;
}

export interface PlaidItem {
  id: string;
  userId: string;
  accessToken: string;
  itemId: string;
  institutionId: string;
  institutionName: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  category?: string;
}

export interface DetectedSubscription {
  merchantName: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  confidence: number;
  lastTransactionDate: string;
  transactionCount: number;
}

export interface Alternative {
  id: string;
  serviceName: string;
  competitors: Competitor[];
  category: string;
  updatedAt: string;
}

export interface Competitor {
  name: string;
  price: number;
  features: string[];
  savings?: number;
}

export interface SubscriptionAnalytics {
  totalMonthlySpend: number;
  totalYearlySpend: number;
  categoryBreakdown: CategorySpend[];
  upcomingRenewals: Subscription[];
  potentialSavings: number;
}

export interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
}
