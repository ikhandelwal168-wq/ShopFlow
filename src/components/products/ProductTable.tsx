import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { formatMoney, formatPercent, productProfitMargin, stockStatus } from '@/lib/utils'
import type { Product } from '@/types/product'

interface Props {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

function statusBadge(product: Product) {
  const status = stockStatus(product.current_stock, product.reorder_level)
  if (status === 'in_stock') {
    return <span className="rounded-full bg-[#dff7ea] px-3 py-1 text-sm font-semibold text-[#0f9a67]">In Stock</span>
  }
  if (status === 'low_stock') {
    return <span className="rounded-full bg-[#fff1d6] px-3 py-1 text-sm font-semibold text-[#c77809]">Low Stock</span>
  }
  return <span className="rounded-full bg-[#ffe4ea] px-3 py-1 text-sm font-semibold text-[#cb3e5f]">Out of Stock</span>
}

export function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="app-panel overflow-hidden">
      <div className="overflow-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#73839d]">
            <tr>
              <th className="px-6 py-4">Product Info</th>
              <th className="px-6 py-4">Stock Level</th>
              <th className="px-6 py-4">MRP / Cost</th>
              <th className="px-6 py-4">Profit %</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-[#edf1f7] bg-white text-[15px] text-[#1f2b46]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff3f9] text-base font-semibold text-[#8494ad]">
                      {product.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-[#678]">
                        <span>{product.sku}</span>
                        <span className="rounded-full bg-[#edf2fb] px-2 py-0.5 text-[#2f66de]">{product.category}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold">
                    {product.current_stock} <span className="font-normal text-[#72829b]">{product.unit}</span>
                  </p>
                  <p className="text-xs text-[#7f8ea7]">Reorder at {product.reorder_level}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-[#0f9a67]">{formatMoney(product.mrp)}</p>
                  <p className="text-sm text-[#7f8ea7]">Cost: {formatMoney(product.cost_price)}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-xl bg-[#e8f6ef] px-3 py-1 text-sm font-semibold text-[#0f9a67]">{formatPercent(productProfitMargin(product))}</span>
                </td>
                <td className="px-6 py-4">{statusBadge(product)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3 text-[#95a4be]">
                    <button type="button" onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`}>
                      <Pencil size={22} />
                    </button>
                    <button type="button" onClick={() => onDelete(product)} aria-label={`Delete ${product.name}`}>
                      <Trash2 size={22} />
                    </button>
                    <button type="button" aria-label="More actions">
                      <EllipsisVertical size={22} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!products.length ? (
              <tr>
                <td className="px-6 py-12 text-center text-lg text-[#6f7f98]" colSpan={6}>
                  No products found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#edf1f7] px-6 py-4 text-sm text-[#6f7f98]">Showing {products.length} products</div>
    </div>
  )
}
