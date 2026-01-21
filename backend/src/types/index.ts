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
