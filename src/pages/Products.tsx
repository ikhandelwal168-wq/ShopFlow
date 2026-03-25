import { useEffect, useMemo, useState } from 'react'
import { Boxes, Filter, Plus, ScanLine, Search } from 'lucide-react'
import { ProductFormModal } from '@/components/products/ProductFormModal'
import { ProductTable } from '@/components/products/ProductTable'
import { useProducts } from '@/hooks/useProducts'
import { getBusinessCategories } from '@/lib/constants'
import { stockStatus } from '@/lib/utils'
import type { Product } from '@/types/product'

export function ProductsPage() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | undefined>(undefined)
  const [businessType, setBusinessType] = useState<string>(() => localStorage.getItem('shopflow-business-type') ?? 'general')

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products])
  useEffect(() => {
    const updateBusinessType = () => {
      setBusinessType(localStorage.getItem('shopflow-business-type') ?? 'general')
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'shopflow-business-type') updateBusinessType()
    }
    window.addEventListener('shopflow-preferences-updated', updateBusinessType)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('shopflow-preferences-updated', updateBusinessType)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const businessCategories = useMemo(() => getBusinessCategories(businessType), [businessType])
  const categoryOptions = useMemo(
    () => Array.from(new Set([...businessCategories, ...categories])),
    [businessCategories, categories],
  )

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const q = query.toLowerCase()
      const matchQuery = [product.name, product.sku, product.barcode ?? ''].some((field) => field.toLowerCase().includes(q))
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

  if (loading) return <div className="app-panel p-8 text-sm text-[#6f7f98]">Loading inventory...</div>

  return (
    <div className="space-y-5">
      <section className="app-panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7efff] text-[#2f66de]">
              <Boxes size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-[#1f2b46]">Inventory</h2>
              <p className="mt-1 text-base text-[#6f7f98]">Manage {products.length} products in your store</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditing(undefined)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2f66de] px-6 py-3 text-lg font-semibold text-white shadow-[0_8px_24px_rgba(47,102,222,0.3)] transition hover:bg-[#295dce]"
          >
            <Plus size={22} />
            Add New Product
          </button>
        </div>
      </section>

      <section className="app-panel p-4 md:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <label className="flex items-center gap-3 rounded-2xl border border-[#e4eaf5] bg-[#f8fafd] px-4 py-3 text-[#8a99b2]">
            <Search size={22} />
            <input
              className="w-full border-none bg-transparent p-0 text-base text-[#1f2b46] placeholder:text-[#9ba9bf] focus:outline-none"
              placeholder="Search by Name, SKU or Barcode..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e4eaf5] bg-[#f8fafd] px-6 py-3 text-base font-semibold text-[#4f5f79]">
            <Filter size={22} />
            Filters
          </button>

          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e4eaf5] bg-[#f8fafd] px-6 py-3 text-base font-semibold text-[#4f5f79]">
            <ScanLine size={22} />
            Scan Barcode
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <select className="rounded-xl border border-[#dfe6f2] bg-white px-3 py-2 text-base text-[#4f5f79]" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select className="rounded-xl border border-[#dfe6f2] bg-white px-3 py-2 text-base text-[#4f5f79]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </section>

      {error ? <p className="rounded-2xl bg-[#fff1f4] px-4 py-3 text-base text-[#cb3e5f]">{error}</p> : null}

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
        categoryOptions={categoryOptions}
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
