import { AlertCircle, IndianRupee, ReceiptText, TrendingUp } from 'lucide-react'
import { BestSellersTable } from '@/components/dashboard/BestSellersTable'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { useDashboard } from '@/hooks/useDashboard'
import { formatMoney } from '@/lib/utils'

const summaryCards = [
  {
    key: 'revenue',
    title: "Today's Revenue",
    icon: IndianRupee,
    iconBg: 'bg-[#3c7bf0]',
    badgeClass: 'bg-[#e8f6ef] text-[#169464]',
  },
  {
    key: 'profit',
    title: "Today's Profit",
    icon: TrendingUp,
    iconBg: 'bg-[#1fb97a]',
    badgeClass: 'bg-[#e8f6ef] text-[#169464]',
  },
  {
    key: 'bills',
    title: 'Bills Generated',
    icon: ReceiptText,
    iconBg: 'bg-[#6f66e8]',
    badgeClass: 'bg-[#feeff1] text-[#e24a68]',
  },
  {
    key: 'alerts',
    title: 'Low Stock Items',
    icon: AlertCircle,
    iconBg: 'bg-[#f33f68]',
    badgeClass: 'bg-[#feeff1] text-[#e24a68]',
  },
] as const

export function DashboardPage() {
  const { summary, salesTrend, categorySales, bestSellers, loading } = useDashboard()

  if (loading) {
    return <div className="app-panel p-8 text-sm text-[#6f7f98]">Loading dashboard...</div>
  }

  const cardData = [
    { value: formatMoney(summary.todayRevenue), delta: '+12.5%' },
    { value: formatMoney(summary.todayProfit), delta: `+${Math.max(summary.margin, 0).toFixed(1)}%` },
    { value: String(summary.billCount), delta: summary.billCount > 0 ? `+${summary.billCount}` : '-2' },
    { value: String(summary.lowStockCount), delta: summary.lowStockCount > 0 ? 'Alert' : 'Healthy' },
  ]

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon
          const data = cardData[index]
          return (
            <div key={card.key} className="app-panel p-6">
              <div className="flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg} text-white`}>
                  <Icon size={28} />
                </div>
                <span className={`app-pill ${card.badgeClass}`}>{data.delta}</span>
              </div>
              <p className="mt-4 text-[15px] text-[#5f6f88]">{card.title}</p>
              <p className="mt-1 text-[42px] font-bold leading-tight text-[#1a2742]">{data.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[2fr_1fr]">
        <SalesChart points={salesTrend} />
        <CategoryChart points={categorySales} />
      </div>

      <BestSellersTable rows={bestSellers} />
    </div>
  )
}
