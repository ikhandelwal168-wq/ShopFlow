import { Card } from '@/components/ui/Card'
import type { BestSellerRow } from '@/types/report'
import { formatMoney } from '@/lib/utils'

export function BestSellersTable({ rows }: { rows: BestSellerRow[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Best Sellers</h3>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-left">Qty</th>
              <th className="px-3 py-2 text-left">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.product_id}>
                <td className="px-3 py-2">{row.product_name}</td>
                <td className="px-3 py-2">{row.quantity}</td>
                <td className="px-3 py-2">{formatMoney(row.revenue)}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={3} className="px-3 py-8 text-center text-slate-500">No sales yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
