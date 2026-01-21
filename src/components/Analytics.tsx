import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { SubscriptionAnalytics } from '../types';

interface AnalyticsProps {
  analytics: SubscriptionAnalytics;
}

const COLORS = ['#9333ea', '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics({ analytics }: AnalyticsProps) {
  const pieData = analytics.categoryBreakdown.map((cat) => ({
    name: cat.category,
    value: cat.amount,
    percentage: cat.percentage,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Spending Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">Total Monthly Spend</div>
            <div className="text-2xl font-bold text-purple-900 mt-1">
              ${analytics.totalMonthlySpend.toFixed(2)}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Total Yearly Spend</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              ${analytics.totalYearlySpend.toFixed(2)}
            </div>
          </div>

          {analytics.potentialSavings > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium">Potential Savings</div>
              <div className="text-2xl font-bold text-green-900 mt-1">
                ${analytics.potentialSavings.toFixed(2)}/month
              </div>
              <div className="text-xs text-green-600 mt-1">
                By switching to cheaper alternatives
              </div>
            </div>
          )}

          {analytics.upcomingRenewals.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-sm text-yellow-600 font-medium">Upcoming Renewals</div>
              <div className="text-2xl font-bold text-yellow-900 mt-1">
                {analytics.upcomingRenewals.length}
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                In the next 30 days
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
