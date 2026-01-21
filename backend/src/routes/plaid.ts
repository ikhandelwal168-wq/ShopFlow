import express from 'express';
import { Configuration, PlaidApi, PlaidEnvironments, CountryCode, Products } from 'plaid';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Initialize Plaid client
const configuration = new Configuration({
  basePath:
    process.env.PLAID_ENV === 'production'
      ? PlaidEnvironments.production
      : PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Create Link token
router.post('/create-link-token', authenticate, async (req: AuthRequest, res) => {
  try {
    const request = {
      user: {
        client_user_id: req.userId!,
      },
      client_name: 'SubSaver',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    };

    const response = await plaidClient.linkTokenCreate(request);
    res.json({ linkToken: response.data.link_token });
  } catch (error) {
    console.error('Create link token error:', error);
    res.status(500).json({ message: 'Failed to create link token' });
  }
});

// Exchange public token for access token
router.post('/exchange-token', authenticate, async (req: AuthRequest, res) => {
  try {
    const { publicToken } = req.body;

    if (!publicToken) {
      return res.status(400).json({ message: 'Public token is required' });
    }

    // Exchange public token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const { access_token, item_id } = response.data;

    // Get institution info
    const itemResponse = await plaidClient.itemGet({
      access_token,
    });

    const institutionId = itemResponse.data.item.institution_id || '';

    let institutionName = 'Unknown';
    if (institutionId) {
      try {
        const instResponse = await plaidClient.institutionsGetById({
          institution_id: institutionId,
          country_codes: [CountryCode.Us],
        });
        institutionName = instResponse.data.institution.name;
      } catch (err) {
        console.error('Error fetching institution:', err);
      }
    }

    // Store Plaid item
    await prisma.plaidItem.create({
      data: {
        userId: req.userId!,
        accessToken: access_token,
        itemId: item_id,
        institutionId,
        institutionName,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Exchange token error:', error);
    res.status(500).json({ message: 'Failed to exchange token' });
  }
});

// Get transactions
router.get('/transactions', authenticate, async (req: AuthRequest, res) => {
  try {
    const plaidItems = await prisma.plaidItem.findMany({
      where: { userId: req.userId },
    });

    if (plaidItems.length === 0) {
      return res.json([]);
    }

    // Get transactions from the first Plaid item
    // In production, you'd want to aggregate from all items
    const plaidItem = plaidItems[0];

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2); // Last 2 months

    const response = await plaidClient.transactionsGet({
      access_token: plaidItem.accessToken,
      start_date: startDate.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    });

    const transactions = response.data.transactions.map((tx) => ({
      id: tx.transaction_id,
      merchantName: tx.merchant_name || tx.name,
      amount: tx.amount,
      date: tx.date,
      category: tx.category?.[0] || undefined,
    }));

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

export default router;

