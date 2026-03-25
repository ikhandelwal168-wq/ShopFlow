import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, Boxes, Download, TrendingUp } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useProducts } from '@/hooks/useProducts'
import { downloadCSV, formatMoney } from '@/lib/utils'

type ReportTab = 'sales' | 'profit' | 'slow'

export function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('sales')
  const { summary, salesTrend, bestSellers, loading } = useDashboard()
  const { products } = useProducts()

  const slowMoving = useMemo(
    () =>
      products
        .filter((p) => p.current_stock > 0)
        .sort((a, b) => b.cost_price * b.current_stock - a.cost_price * a.current_stock)
        .slice(0, 8),
    [products],
  )

  const exportSales = () => {
    downloadCSV(
      'sales-report.csv',
      ['metric', 'value'],
      [
        ['today_revenue', summary.todayRevenue],
        ['today_profit', summary.todayProfit],
        ['bills_generated', summary.billCount],
      ],
    )
  }

  const bars = salesTrend.map((point) => ({
    date: format(new Date(point.date), 'MMM dd'),
    revenue: point.revenue,
  }))

  if (loading) {
    return <div className="app-panel p-8 text-sm text-[#6f7f98]">Loading reports...</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="rounded-2xl bg-[#e8edf5] p-1">
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setTab('sales')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-base font-semibold ${
                tab === 'sales' ? 'bg-white text-[#2f66de]' : 'text-[#63748f]'
              }`}
            >
              <TrendingUp size={18} />
              Sales Report
            </button>
            <button
              type="button"
              onClick={() => setTab('profit')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-base font-semibold ${
                tab === 'profit' ? 'bg-white text-[#2f66de]' : 'text-[#63748f]'
              }`}
            >
              <BarChart3 size={18} />
              Profit Analysis
            </button>
            <button
              type="button"
              onClick={() => setTab('slow')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-base font-semibold ${
                tab === 'slow' ? 'bg-white text-[#2f66de]' : 'text-[#63748f]'
              }`}
            >
              <Boxes size={18} />
              Slow Moving Items
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" className="rounded-2xl border border-[#dfe6f2] bg-white px-4 py-2 text-base font-semibold text-[#4f5f79]">
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={exportSales}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2f66de] px-5 py-2 text-base font-semibold text-white"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {tab === 'sales' ? (
        <>
          <section className="app-panel p-6">
            <h2 className="text-xl font-semibold text-[#1f2b46]">Daily Sales Revenue</h2>
            <div className="mt-5 h-[460px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bars}>
                  <CartesianGrid vertical={false} stroke="#e6edf7" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64758f', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64758f', fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => formatMoney(Number(value))} />
                  <Bar dataKey="revenue" fill="#3f82f2" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-3xl border border-[#ccebdd] bg-[#e8f7ef] p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#159160]">Total Sales</p>
              <p className="mt-2 text-2xl font-bold text-[#107853]">{formatMoney(summary.todayRevenue)}</p>
            </div>
            <div className="rounded-3xl border border-[#dce5f5] bg-[#eff4ff] p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#2f66de]">Total Invoices</p>
              <p className="mt-2 text-2xl font-bold text-[#244daf]">{summary.billCount} Bills</p>
            </div>
            <div className="rounded-3xl border border-[#dfe5f3] bg-[#f0f3fb] p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5f69c4]">Avg. Bill Value</p>
              <p className="mt-2 text-2xl font-bold text-[#4b53a9]">
                {summary.billCount ? formatMoney(summary.todayRevenue / summary.billCount) : formatMoney(0)}
              </p>
            </div>
          </div>
        </>
      ) : null}

      {tab === 'profit' ? (
        <section className="app-panel p-6">
          <h2 className="text-xl font-semibold text-[#1f2b46]">Profit Analysis</h2>
          <div className="mt-4 space-y-2 text-sm text-[#4f5f79]">
            <p>Today's profit: <span className="font-semibold text-[#1f2b46]">{formatMoney(summary.todayProfit)}</span></p>
            <p>Margin: <span className="font-semibold text-[#1f2b46]">{summary.todayRevenue ? ((summary.todayProfit / summary.todayRevenue) * 100).toFixed(2) : '0.00'}%</span></p>
            <p>Top contributors are calculated from invoice line-items and product costs.</p>
          </div>
          <div className="mt-5 overflow-auto rounded-2xl border border-[#e8edf5]">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f6f8fc] text-xs uppercase tracking-wide text-[#73839d]">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Qty Sold</th>
                  <th className="px-4 py-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.slice(0, 8).map((row) => (
                  <tr key={row.product_id} className="border-t border-[#edf1f7]">
                    <td className="px-4 py-3">{row.product_name}</td>
                    <td className="px-4 py-3">{row.quantity}</td>
                    <td className="px-4 py-3 font-semibold">{formatMoney(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === 'slow' ? (
        <section className="app-panel p-6">
          <h2 className="text-xl font-semibold text-[#1f2b46]">Slow Moving Items</h2>
          <p className="mt-2 text-sm text-[#6f7f98]">Sorted by inventory value locked.</p>
          <div className="mt-5 overflow-auto rounded-2xl border border-[#e8edf5]">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f6f8fc] text-xs uppercase tracking-wide text-[#73839d]">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Stock Value</th>
                </tr>
              </thead>
              <tbody>
                {slowMoving.map((item) => (
                  <tr key={item.id} className="border-t border-[#edf1f7]">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.current_stock}</td>
                    <td className="px-4 py-3 font-semibold">{formatMoney(item.current_stock * item.cost_price)}</td>
                  </tr>
                ))}
                {!slowMoving.length ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-[#6f7f98]">
                      No inventory data.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  )
}
