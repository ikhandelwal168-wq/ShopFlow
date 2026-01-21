import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, ExternalLink, TrendingDown } from 'lucide-react';
import { alternativesApi } from '../services/api';
import type { Alternative, Competitor } from '../types';

interface AlternativesPanelProps {
  serviceName: string;
  currentPrice: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  onClose: () => void;
}

export default function AlternativesPanel({
  serviceName,
  currentPrice,
  billingCycle,
  onClose,
}: AlternativesPanelProps) {
  const [monthlyPrice, setMonthlyPrice] = useState(currentPrice);

  useEffect(() => {
    // Convert to monthly equivalent
    if (billingCycle === 'yearly') {
      setMonthlyPrice(currentPrice / 12);
    } else if (billingCycle === 'weekly') {
      setMonthlyPrice(currentPrice * 4.33);
    } else {
      setMonthlyPrice(currentPrice);
    }
  }, [currentPrice, billingCycle]);

  const { data: alternative, isLoading } = useQuery({
    queryKey: ['alternatives', serviceName],
    queryFn: () => alternativesApi.getAlternatives(serviceName),
    enabled: !!serviceName,
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
          <div className="text-center py-8">Loading alternatives...</div>
        </div>
      </div>
    );
  }

  if (!alternative) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">No Alternatives Found</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            We don't have alternatives for {serviceName} yet. Check back soon!
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const competitors = alternative.competitors as Competitor[];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white m-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Alternatives for {serviceName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Compare prices and find cheaper options
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Current Service */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-purple-900">{serviceName}</h3>
              <p className="text-sm text-purple-700">Current subscription</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-900">
                ${monthlyPrice.toFixed(2)}
              </div>
              <div className="text-sm text-purple-700">/month</div>
            </div>
          </div>
        </div>

        {/* Alternatives Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Savings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {competitors.map((competitor, index) => {
                const savings = monthlyPrice - competitor.price;
                const yearlySavings = savings * 12;
                const isCheaper = savings > 0;

                return (
                  <tr
                    key={index}
                    className={isCheaper ? 'bg-green-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {competitor.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${competitor.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">/month</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isCheaper ? (
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          ${savings.toFixed(2)}/mo
                          <div className="text-xs text-gray-500 ml-2">
                            (${yearlySavings.toFixed(2)}/yr)
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No savings</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {competitor.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                        {competitor.features.length > 3 && (
                          <li className="text-xs text-gray-400">
                            +{competitor.features.length - 3} more
                          </li>
                        )}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(competitor.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-600 hover:text-purple-900"
                      >
                        Learn More
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total Savings Summary */}
        {competitors.some((c) => monthlyPrice - c.price > 0) && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900">
                  Potential Monthly Savings
                </h3>
                <p className="text-sm text-green-700">
                  By switching to the cheapest alternative
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-900">
                  $
                  {(
                    monthlyPrice -
                    Math.min(...competitors.map((c) => c.price))
                  ).toFixed(2)}
                </div>
                <div className="text-sm text-green-700">per month</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
