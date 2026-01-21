import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Calendar, DollarSign, Search } from 'lucide-react';
import { subscriptionApi } from '../services/api';
import type { Subscription } from '../types';
import { format } from 'date-fns';
import AlternativesPanel from './AlternativesPanel';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onUpdate: () => void;
}

export default function SubscriptionList({ subscriptions, onUpdate }: SubscriptionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAlternatives, setShowAlternatives] = useState<Subscription | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: subscriptionApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      onUpdate();
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      subscriptionApi.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      onUpdate();
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (subscription: Subscription) => {
    toggleActiveMutation.mutate({
      id: subscription.id,
      isActive: !subscription.isActive,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      streaming: 'bg-purple-100 text-purple-800',
      software: 'bg-blue-100 text-blue-800',
      fitness: 'bg-green-100 text-green-800',
      news: 'bg-yellow-100 text-yellow-800',
      cloud: 'bg-indigo-100 text-indigo-800',
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No subscriptions yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Add your first subscription to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Subscriptions</h2>
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                !subscription.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subscription.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                        subscription.category
                      )}`}
                    >
                      {subscription.category}
                    </span>
                    {!subscription.isActive && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-600">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        ${subscription.amount.toFixed(2)} / {subscription.billingCycle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Next: {format(new Date(subscription.nextBillingDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAlternatives(subscription)}
                    className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                    title="View Alternatives"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(subscription)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      subscription.isActive
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {subscription.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(subscription.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternatives Panel */}
      {showAlternatives && (
        <AlternativesPanel
          serviceName={showAlternatives.name}
          currentPrice={showAlternatives.amount}
          billingCycle={showAlternatives.billingCycle}
          onClose={() => setShowAlternatives(null)}
        />
      )}
    </div>
  );
}

