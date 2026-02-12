import { useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'

export function LowStockPage() {
  const { products, loading } = useProducts()
  const lowStock = useMemo(
    () => products.filter((p) => p.current_stock <= p.reorder_level).sort((a, b) => a.current_stock - b.current_stock),
    [products],
  )

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Low Stock Alerts</h1>
      <div className="overflow-auto rounded border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-left">Current Stock</th>
              <th className="px-3 py-2 text-left">Reorder Level</th>
              <th className="px-3 py-2 text-left">Supplier</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lowStock.map((product) => (
              <tr key={product.id}>
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.current_stock}</td>
                <td className="px-3 py-2">{product.reorder_level}</td>
                <td className="px-3 py-2">{product.supplier_name || '-'}</td>
                <td className="px-3 py-2">
                  <button type="button" className="rounded border px-2 py-1 text-xs">Create Purchase Order</button>
                </td>
              </tr>
            ))}
            {!lowStock.length ? (
              <tr><td className="px-3 py-8 text-center text-slate-500" colSpan={5}>No low-stock products.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <button type="button" className="rounded bg-blue-600 px-4 py-2 text-sm text-white">Send Email Alert</button>
    </div>
  )
}
