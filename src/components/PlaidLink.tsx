import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePlaidLink } from 'react-plaid-link';
import { CreditCard, Loader } from 'lucide-react';
import { plaidApi } from '../services/api';

export default function PlaidLink() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const queryClient = useQueryClient();

  const exchangeMutation = useMutation({
    mutationFn: plaidApi.exchangeToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setLinkToken(null); // Reset token
      alert('Bank account connected successfully! We\'ll analyze your transactions for subscriptions.');
    },
    onError: () => {
      setLinkToken(null); // Reset token on error
      alert('Failed to connect bank account. Please try again.');
    },
  });

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken) => {
      exchangeMutation.mutate(publicToken);
    },
    onExit: (err) => {
      if (err) {
        console.error('Plaid Link error:', err);
      }
      setLinkToken(null); // Reset token when user exits
    },
  });

  const handleClick = async () => {
    if (!linkToken) {
      setIsLoadingToken(true);
      try {
        const data = await plaidApi.createLinkToken();
        setLinkToken(data.linkToken);
      } catch (error) {
        console.error('Failed to create link token:', error);
        alert('Failed to initialize bank connection. Please try again.');
      } finally {
        setIsLoadingToken(false);
      }
    }
  };

  // Open Plaid Link when token is ready
  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <button
      onClick={handleClick}
      disabled={isLoadingToken || exchangeMutation.isPending || (linkToken && !ready)}
      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
    >
      {isLoadingToken || exchangeMutation.isPending ? (
        <>
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Connect Bank
        </>
      )}
    </button>
  );
}

