import express from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { detectSubscriptions } from '../services/subscriptionDetection';

const router = express.Router();

const subscriptionSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  billingCycle: z.enum(['monthly', 'yearly', 'weekly']),
  nextBillingDate: z.string().datetime(),
  category: z.string(),
  isActive: z.boolean().default(true),
});

// Get all subscriptions
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.userId },
      orderBy: { nextBillingDate: 'asc' },
    });

    res.json(subscriptions);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create subscription
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = subscriptionSchema.parse(req.body);

    const subscription = await prisma.subscription.create({
      data: {
        ...data,
        nextBillingDate: new Date(data.nextBillingDate),
        userId: req.userId!,
      },
    });

    res.status(201).json(subscription);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Create subscription error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update subscription
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = subscriptionSchema.partial().parse(req.body);

    // Verify ownership
    const existing = await prisma.subscription.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...updates,
        nextBillingDate: updates.nextBillingDate
          ? new Date(updates.nextBillingDate)
          : undefined,
      },
    });

    res.json(subscription);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Update subscription error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete subscription
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.subscription.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    await prisma.subscription.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Auto-detect subscriptions from transactions
router.post('/detect', authenticate, async (req: AuthRequest, res) => {
  try {
    // Get user's Plaid items
    const plaidItems = await prisma.plaidItem.findMany({
      where: { userId: req.userId },
    });

    if (plaidItems.length === 0) {
      return res.json([]);
    }

    // This would fetch transactions from Plaid and detect subscriptions
    // For now, return empty array - will be implemented with Plaid integration
    const detected = await detectSubscriptions(req.userId!);

    res.json(detected);
  } catch (error) {
    console.error('Detect subscriptions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get analytics
router.get('/analytics', authenticate, async (req: AuthRequest, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.userId, isActive: true },
    });

    // Calculate monthly spend
    const totalMonthlySpend = subscriptions.reduce((sum, sub) => {
      const monthlyAmount =
        sub.billingCycle === 'yearly'
          ? sub.amount / 12
          : sub.billingCycle === 'weekly'
          ? sub.amount * 4.33
          : sub.amount;
      return sum + monthlyAmount;
    }, 0);

    const totalYearlySpend = totalMonthlySpend * 12;

    // Category breakdown
    const categoryMap = new Map<string, number>();
    subscriptions.forEach((sub) => {
      const monthlyAmount =
        sub.billingCycle === 'yearly'
          ? sub.amount / 12
          : sub.billingCycle === 'weekly'
          ? sub.amount * 4.33
          : sub.amount;
      categoryMap.set(
        sub.category,
        (categoryMap.get(sub.category) || 0) + monthlyAmount
      );
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalMonthlySpend) * 100,
      })
    );

    // Upcoming renewals (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const upcomingRenewals = subscriptions.filter(
      (sub) =>
        new Date(sub.nextBillingDate) <= thirtyDaysFromNow &&
        new Date(sub.nextBillingDate) >= new Date()
    );

    // Potential savings (placeholder - would calculate from alternatives)
    const potentialSavings = 0; // TODO: Calculate from alternatives

    res.json({
      totalMonthlySpend,
      totalYearlySpend,
      categoryBreakdown,
      upcomingRenewals,
      potentialSavings,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
