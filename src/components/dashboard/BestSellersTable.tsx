import { Plus } from 'lucide-react'
import { formatMoney } from '@/lib/utils'
import type { BestSellerRow } from '@/types/report'

export function BestSellersTable({ rows }: { rows: BestSellerRow[] }) {
  return (
    <div className="app-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#e8edf5] px-6 py-5">
        <h3 className="text-xl font-semibold text-[#1f2b46]">Best Selling Items</h3>
        <button type="button" className="text-base font-semibold text-[#2f66de]">
          View All Reports
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#73839d]">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Quantity Sold</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 5).map((row) => (
              <tr key={row.product_id} className="border-t border-[#edf1f7] bg-white text-[15px] text-[#1f2b46]">
                <td className="px-6 py-4 font-semibold">{row.product_name}</td>
                <td className="px-6 py-4 text-[#5f6f88]">-</td>
                <td className="px-6 py-4">{row.quantity} Units</td>
                <td className="px-6 py-4 font-semibold text-[#0f9a67]">{formatMoney(row.revenue)}</td>
                <td className="px-6 py-4 text-right text-[#96a5bf]">
                  <Plus className="inline-block" size={20} />
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#6f7f98]">
                  No sales yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
