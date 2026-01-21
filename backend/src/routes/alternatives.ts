import express from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get alternatives for a service
router.get('/:serviceName', authenticate, async (req: AuthRequest, res) => {
  try {
    const { serviceName } = req.params;

    const alternative = await prisma.alternative.findUnique({
      where: { serviceName },
    });

    if (!alternative) {
      return res.status(404).json({ message: 'No alternatives found' });
    }

    res.json(alternative);
  } catch (error) {
    console.error('Get alternatives error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get potential savings
router.get('/savings', authenticate, async (req: AuthRequest, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.userId, isActive: true },
    });

    let totalSavings = 0;

    for (const sub of subscriptions) {
      const alternative = await prisma.alternative.findUnique({
        where: { serviceName: sub.name },
      });

      if (alternative && alternative.competitors) {
        const competitors = alternative.competitors as Array<{
          name: string;
          price: number;
          savings?: number;
        }>;

        if (competitors.length > 0) {
          // Find cheapest alternative
          const cheapest = competitors.reduce((min, curr) =>
            curr.price < min.price ? curr : min
          );

          const monthlyCurrent =
            sub.billingCycle === 'yearly'
              ? sub.amount / 12
              : sub.billingCycle === 'weekly'
              ? sub.amount * 4.33
              : sub.amount;

          const savings = monthlyCurrent - cheapest.price;
          if (savings > 0) {
            totalSavings += savings;
          }
        }
      }
    }

    res.json({ potentialSavings: totalSavings });
  } catch (error) {
    console.error('Get savings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
