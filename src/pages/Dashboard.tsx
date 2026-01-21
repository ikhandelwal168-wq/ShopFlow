import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { subscriptionApi } from '../services/api';
import SubscriptionList from '../components/SubscriptionList';
import AddSubscriptionModal from '../components/AddSubscriptionModal';
import PlaidLink from '../components/PlaidLink';
import Analytics from '../components/Analytics';
import type { Subscription } from '../types';

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: subscriptions = [], refetch } = useQuery<Subscription[]>({
    queryKey: ['subscriptions'],
    queryFn: subscriptionApi.getAll,
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: subscriptionApi.getAnalytics,
  });

  const totalMonthly = subscriptions
    .filter((sub) => sub.isActive)
    .reduce((sum, sub) => {
      const monthlyAmount =
        sub.billingCycle === 'yearly'
          ? sub.amount / 12
          : sub.billingCycle === 'weekly'
          ? sub.amount * 4.33
          : sub.amount;
      return sum + monthlyAmount;
    }, 0);

  const totalYearly = totalMonthly * 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your subscriptions
          </p>
        </div>
        <div className="flex gap-3">
          <PlaidLink />
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Monthly Spend
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalMonthly.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Yearly Spend
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalYearly.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Subscriptions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {subscriptions.filter((s) => s.isActive).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {analytics && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Potential Savings
                    </dt>
                    <dd className="text-lg font-medium text-green-600">
                      ${analytics.potentialSavings.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics */}
      {analytics && <Analytics analytics={analytics} />}

      {/* Subscriptions List */}
      <SubscriptionList
        subscriptions={subscriptions}
        onUpdate={refetch}
      />

      {/* Add Subscription Modal */}
      {showAddModal && (
        <AddSubscriptionModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
