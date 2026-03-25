import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Product } from '@/types/product'

interface Props {
  products: Product[]
  onPick: (product: Product) => void
}

export function ProductSearch({ products, onPick }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products
      .filter((product) => [product.name, product.sku, product.barcode ?? ''].some((field) => field.toLowerCase().includes(q)))
      .slice(0, 8)
  }, [products, query])

  return (
    <div className="app-panel p-4">
      <label className="flex items-center gap-3 rounded-2xl border border-[#e4eaf5] bg-[#f8fafd] px-4 py-3 text-[#8a99b2]">
        <Search size={22} />
        <input
          id="global-search"
          className="w-full border-none bg-transparent p-0 text-sm text-[#1f2b46] placeholder:text-[#9ba9bf] focus:outline-none"
          placeholder="Scan Barcode or Search Products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {filtered.length ? (
        <div className="mt-3 max-h-64 overflow-auto rounded-2xl border border-[#e9eef7] bg-white p-2">
          {filtered.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onPick(product)}
              className="mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-[#f4f8ff]"
            >
              <span>
                <span className="block text-sm font-semibold text-[#1f2b46]">{product.name}</span>
                <span className="text-sm text-[#7f8ea7]">
                  {product.sku}
                  {product.barcode ? ` • ${product.barcode}` : ''}
                </span>
              </span>
              <span className="text-sm font-semibold text-[#2f66de]">₹{product.mrp.toFixed(2)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
