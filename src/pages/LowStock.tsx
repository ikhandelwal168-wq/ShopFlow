import { Send, ShoppingCart, TriangleAlert } from 'lucide-react'
import { useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'

export function LowStockPage() {
  const { products, loading } = useProducts()
  const lowStock = useMemo(
    () => products.filter((p) => p.current_stock <= p.reorder_level).sort((a, b) => a.current_stock - b.current_stock),
    [products],
  )

  if (loading) return <div className="app-panel p-8 text-sm text-[#6f7f98]">Loading...</div>

  return (
    <div className="space-y-5">
      <section className="rounded-[26px] border border-[#f4ced7] bg-[#fff2f5] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ef3f67] text-white">
            <TriangleAlert size={34} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#a21d3e]">Low Stock Alerts</h2>
            <p className="mt-1 text-sm text-[#c23054]">You have {lowStock.length} items that need restocking soon.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {lowStock.map((product) => (
          <article key={product.id} className="app-panel p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff3f9] text-base font-semibold text-[#8393ab]">
                {product.name.slice(0, 1).toUpperCase()}
              </div>
              <span className="app-pill bg-[#fff1d6] text-[#c77809]">LOW STOCK</span>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-[#1f2b46]">{product.name}</h3>
            <p className="mt-1 text-sm text-[#6f7f98]">{product.supplier_name || 'Primary Supplier'} | {product.sku}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f6f8fc] p-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#7f8ea7]">Stock Left</p>
                <p className="mt-1 text-2xl font-bold text-[#d77b0f]">{product.current_stock}</p>
              </div>
              <div className="rounded-2xl bg-[#f6f8fc] p-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#7f8ea7]">Reorder Level</p>
                <p className="mt-1 text-2xl font-bold text-[#1f2b46]">{product.reorder_level}</p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2f66de] px-4 py-3 text-base font-semibold text-white">
                <ShoppingCart size={20} />
                Reorder
              </button>
              <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dfe6f2] text-[#6f7f98]">
                <Send size={19} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {!lowStock.length ? <div className="app-panel p-8 text-center text-base text-[#6f7f98]">No low-stock products.</div> : null}
    </div>
  )
}
