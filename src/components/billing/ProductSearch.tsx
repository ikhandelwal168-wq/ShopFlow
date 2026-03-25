import { useMemo, useState } from 'react'
import type { Product } from '@/types/product'

interface Props {
  products: Product[]
  onPick: (product: Product) => void
}

export function ProductSearch({ products, onPick }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products.slice(0, 10)
    return products
      .filter((product) =>
        [product.name, product.sku, product.barcode ?? ''].some((field) => field.toLowerCase().includes(q)),
      )
      .slice(0, 10)
  }, [products, query])

  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <input
        id="global-search"
        className="w-full rounded border px-3 py-2"
        placeholder="Search by name, SKU, barcode"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-2 max-h-64 overflow-auto">
        {filtered.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onPick(product)}
            className="mb-1 flex w-full items-center justify-between rounded px-2 py-2 text-left hover:bg-slate-100"
          >
            <span>
              <span className="block text-sm font-medium">{product.name}</span>
              <span className="text-xs text-slate-500">{product.sku} {product.barcode ? `• ${product.barcode}` : ''}</span>
            </span>
            <span className="text-sm text-slate-700">₹{product.mrp.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
