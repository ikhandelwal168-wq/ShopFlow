import { useEffect, useMemo, useState } from 'react'
import { ProductFormModal } from '@/components/products/ProductFormModal'
import { ProductTable } from '@/components/products/ProductTable'
import { useProducts } from '@/hooks/useProducts'
import { stockStatus } from '@/lib/utils'
import type { Product } from '@/types/product'

export function ProductsPage() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | undefined>(undefined)

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products])

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const q = query.toLowerCase()
      const matchQuery = [product.name, product.sku, product.barcode ?? ''].some((field) =>
        field.toLowerCase().includes(q),
      )
      const matchCategory = category === 'All' || product.category === category
      const currentStatus = stockStatus(product.current_stock, product.reorder_level)
      const matchStatus =
        status === 'All' ||
        (status === 'In Stock' && currentStatus === 'in_stock') ||
        (status === 'Low Stock' && currentStatus === 'low_stock') ||
        (status === 'Out of Stock' && currentStatus === 'out_of_stock')
      return matchQuery && matchCategory && matchStatus
    })
  }, [products, query, category, status])

  const openEdit = (product: Product) => {
    setEditing(product)
    setModalOpen(true)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        event.preventDefault()
        setEditing(undefined)
        setModalOpen(true)
      }
      if (event.key === 'Escape') {
        setModalOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (loading) return <div>Loading products...</div>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Products</h1>
        <button
          type="button"
          onClick={() => {
            setEditing(undefined)
            setModalOpen(true)
          }}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Add Product (F2)
        </button>
      </div>

      <div className="grid gap-3 rounded border border-slate-200 bg-white p-3 md:grid-cols-4">
        <input
          className="rounded border px-3 py-2"
          placeholder="Search by name, SKU, barcode"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="rounded border px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select className="rounded border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>

      {error ? <p className="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <ProductTable
        products={filtered}
        onEdit={openEdit}
        onDelete={(product) => {
          if (window.confirm(`Delete ${product.name}?`)) {
            void deleteProduct(product.id)
          }
        }}
      />

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editing}
        onSave={async (input) => {
          if (editing) {
            await updateProduct(editing.id, input)
          } else {
            await createProduct(input)
          }
        }}
      />
    </div>
  )
}
