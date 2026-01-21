import type { Transaction, DetectedSubscription } from '../types';

export async function detectSubscriptions(
  userId: string
): Promise<DetectedSubscription[]> {
  // This is a placeholder - in a real implementation, you would:
  // 1. Fetch transactions from Plaid
  // 2. Group by merchant name
  // 3. Analyze patterns (intervals, amounts)
  // 4. Return detected subscriptions with confidence scores

  // For now, return empty array
  // Full implementation would be:
  
  /*
  const transactions = await fetchTransactionsFromPlaid(userId);
  
  // Group transactions by merchant
  const merchantGroups = groupByMerchant(transactions);
  
  // Analyze each group for subscription patterns
  const detected: DetectedSubscription[] = [];
  
  for (const [merchant, txs] of Object.entries(merchantGroups)) {
    if (txs.length < 3) continue; // Need at least 3 transactions
    
    const pattern = analyzePattern(txs);
    if (pattern.confidence > 0.7) {
      detected.push({
        merchantName: merchant,
        amount: pattern.averageAmount,
        billingCycle: pattern.cycle,
        confidence: pattern.confidence,
        lastTransactionDate: pattern.lastDate,
        transactionCount: txs.length,
      });
    }
  }
  
  return detected;
  */

  return [];
}

function groupByMerchant(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  
  transactions.forEach((tx) => {
    if (!groups[tx.merchantName]) {
      groups[tx.merchantName] = [];
    }
    groups[tx.merchantName].push(tx);
  });
  
  return groups;
}

function analyzePattern(transactions: Transaction[]): {
  averageAmount: number;
  cycle: 'monthly' | 'yearly' | 'weekly';
  confidence: number;
  lastDate: string;
} {
  // Sort by date
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate average amount
  const amounts = sorted.map((t) => Math.abs(t.amount));
  const averageAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;

  // Check amount variance (should be within 5%)
  const variance = amounts.reduce(
    (sum, amount) => sum + Math.abs(amount - averageAmount),
    0
  ) / amounts.length;
  const variancePercent = (variance / averageAmount) * 100;

  if (variancePercent > 5) {
    return {
      averageAmount,
      cycle: 'monthly',
      confidence: 0,
      lastDate: sorted[sorted.length - 1].date,
    };
  }

  // Calculate intervals between transactions
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const daysDiff =
      (new Date(sorted[i].date).getTime() -
        new Date(sorted[i - 1].date).getTime()) /
      (1000 * 60 * 60 * 24);
    intervals.push(daysDiff);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

  // Determine cycle
  let cycle: 'monthly' | 'yearly' | 'weekly' = 'monthly';
  if (avgInterval >= 25 && avgInterval <= 35) {
    cycle = 'monthly';
  } else if (avgInterval >= 350 && avgInterval <= 380) {
    cycle = 'yearly';
  } else if (avgInterval >= 6 && avgInterval <= 8) {
    cycle = 'weekly';
  }

  // Calculate confidence based on consistency
  const intervalVariance =
    intervals.reduce((sum, interval) => sum + Math.abs(interval - avgInterval), 0) /
    intervals.length;
  const consistency = Math.max(0, 1 - intervalVariance / avgInterval);
  const confidence = Math.min(1, consistency * 0.9 + (transactions.length > 5 ? 0.1 : 0));

  return {
    averageAmount,
    cycle,
    confidence,
    lastDate: sorted[sorted.length - 1].date,
  };
}
