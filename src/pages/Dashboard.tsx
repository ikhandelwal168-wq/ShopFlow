import { MetricCard } from '@/components/ui/MetricCard'
import { useDashboard } from '@/hooks/useDashboard'
import { formatMoney, formatPercent } from '@/lib/utils'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { BestSellersTable } from '@/components/dashboard/BestSellersTable'

export function DashboardPage() {
  const { summary, salesTrend, categorySales, bestSellers, loading } = useDashboard()

  if (loading) return <div>Loading dashboard...</div>

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard title="Today's Revenue" value={formatMoney(summary.todayRevenue)} />
        <MetricCard title="Today's Profit" value={formatMoney(summary.todayProfit)} hint={`Margin ${formatPercent(summary.margin)}`} />
        <MetricCard title="Bills Generated" value={String(summary.billCount)} />
        <MetricCard title="Low Stock Items" value={String(summary.lowStockCount)} hint={summary.lowStockCount > 0 ? 'Action required' : 'Healthy'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SalesChart points={salesTrend} />
        <CategoryChart points={categorySales} />
      </div>

      <BestSellersTable rows={bestSellers} />
    </div>
  )
}
