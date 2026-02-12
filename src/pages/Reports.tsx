import { useMemo, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useDashboard } from '@/hooks/useDashboard'
import { Card } from '@/components/ui/Card'
import { downloadCSV, formatMoney } from '@/lib/utils'

type ReportTab = 'sales' | 'best' | 'slow' | 'profit' | 'valuation' | 'tax'

export function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('sales')
  const { products } = useProducts()
  const { bestSellers, summary } = useDashboard()

  const slowMoving = useMemo(
    () => products.filter((p) => p.current_stock > 0).sort((a, b) => b.cost_price * b.current_stock - a.cost_price * a.current_stock),
    [products],
  )

  const totalStockValue = useMemo(() => products.reduce((sum, p) => sum + p.cost_price * p.current_stock, 0), [products])

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          ['sales', 'Sales Report'],
          ['best', 'Best Sellers'],
          ['slow', 'Slow-Moving Items'],
          ['profit', 'Profit Analysis'],
          ['valuation', 'Inventory Valuation'],
          ['tax', 'Tax Summary'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`rounded px-3 py-2 text-sm ${tab === value ? 'bg-blue-600 text-white' : 'border bg-white'}`}
            onClick={() => setTab(value as ReportTab)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'sales' ? (
        <Card>
          <h2 className="text-lg font-semibold">Sales Report</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <p>Today Revenue: {formatMoney(summary.todayRevenue)}</p>
            <p>Today Profit: {formatMoney(summary.todayProfit)}</p>
            <p>Payment Methods: Cash/Card/UPI breakdown available from invoices table.</p>
          </div>
          <button type="button" className="mt-3 rounded border px-3 py-2" onClick={exportSales}>Export CSV</button>
        </Card>
      ) : null}

      {tab === 'best' ? (
        <Card>
          <h2 className="text-lg font-semibold">Best Sellers</h2>
          <div className="mt-2 overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-left">Qty</th><th className="px-3 py-2 text-left">Revenue</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {bestSellers.map((item) => (
                  <tr key={item.product_id}><td className="px-3 py-2">{item.product_name}</td><td className="px-3 py-2">{item.quantity}</td><td className="px-3 py-2">{formatMoney(item.revenue)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {tab === 'slow' ? (
        <Card>
          <h2 className="text-lg font-semibold">Slow-Moving Items</h2>
          <p className="mt-1 text-sm text-slate-500">Products sorted by capital locked.</p>
          <div className="mt-2 overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="px-3 py-2 text-left">Product</th><th className="px-3 py-2 text-left">Stock</th><th className="px-3 py-2 text-left">Stock Value</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {slowMoving.slice(0, 30).map((product) => (
                  <tr key={product.id}><td className="px-3 py-2">{product.name}</td><td className="px-3 py-2">{product.current_stock}</td><td className="px-3 py-2">{formatMoney(product.current_stock * product.cost_price)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {tab === 'profit' ? (
        <Card>
          <h2 className="text-lg font-semibold">Profit Analysis</h2>
          <p className="mt-2 text-sm">Today total profit: {formatMoney(summary.todayProfit)}</p>
          <p className="text-sm">Category contribution can be derived from `invoice_items` joined with `products`.</p>
        </Card>
      ) : null}

      {tab === 'valuation' ? (
        <Card>
          <h2 className="text-lg font-semibold">Inventory Valuation</h2>
          <p className="mt-2 text-sm">Total stock value at cost: {formatMoney(totalStockValue)}</p>
        </Card>
      ) : null}

      {tab === 'tax' ? (
        <Card>
          <h2 className="text-lg font-semibold">Tax Summary</h2>
          <p className="mt-2 text-sm">Use invoices `total_tax` for filing period summaries. CGST and SGST are split equally for intra-state invoices.</p>
        </Card>
      ) : null}
    </div>
  )
}
