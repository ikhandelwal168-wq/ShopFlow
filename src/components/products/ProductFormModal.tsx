import { useEffect, useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { PRODUCT_CATEGORIES, TAX_OPTIONS, UNIT_OPTIONS } from '@/lib/constants'
import { formatPercent } from '@/lib/utils'
import type { Product, ProductFormInput } from '@/types/product'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (input: ProductFormInput) => Promise<void>
  product?: Product
}

const defaultValues: ProductFormInput = {
  name: '',
  brand: '',
  category: 'Other',
  size_variant: '',
  barcode: '',
  mrp: 0,
  cost_price: 0,
  current_stock: 0,
  reorder_level: 10,
  hsn_code: '',
  tax_rate: 18,
  unit: 'piece',
  supplier_name: '',
  image_url: '',
}

export function ProductFormModal({ open, onClose, onSave, product }: Props) {
  const [form, setForm] = useState<ProductFormInput>(defaultValues)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        brand: product.brand ?? '',
        category: product.category,
        size_variant: product.size_variant ?? '',
        barcode: product.barcode ?? '',
        mrp: product.mrp,
        cost_price: product.cost_price,
        current_stock: product.current_stock,
        reorder_level: product.reorder_level,
        hsn_code: product.hsn_code ?? '',
        tax_rate: product.tax_rate,
        unit: product.unit,
        supplier_name: product.supplier_name ?? '',
        image_url: product.image_url ?? '',
      })
    } else {
      setForm(defaultValues)
    }
  }, [product, open])

  const margin = useMemo(() => {
    if (!form.cost_price) return 0
    return ((form.mrp - form.cost_price) / form.cost_price) * 100
  }, [form.cost_price, form.mrp])

  const marginColor = margin > 20 ? 'text-emerald-600' : margin >= 10 ? 'text-amber-600' : 'text-rose-600'

  const update = <K extends keyof ProductFormInput>(key: K, value: ProductFormInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
      onClose()
      setForm(defaultValues)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'}>
      <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="text-sm">
          Product Name*
          <input className="mt-1 w-full rounded border px-3 py-2" required value={form.name} onChange={(e) => update('name', e.target.value)} />
        </label>
        <label className="text-sm">
          Brand
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.brand} onChange={(e) => update('brand', e.target.value)} />
        </label>
        <label className="text-sm">
          Category*
          <select className="mt-1 w-full rounded border px-3 py-2" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Size/Variant
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.size_variant} onChange={(e) => update('size_variant', e.target.value)} />
        </label>
        <label className="text-sm">
          Barcode/EAN
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.barcode} onChange={(e) => update('barcode', e.target.value)} />
        </label>
        <label className="text-sm">
          MRP*
          <input className="mt-1 w-full rounded border px-3 py-2" type="number" min={0} step="0.01" required value={form.mrp} onChange={(e) => update('mrp', Number(e.target.value))} />
        </label>
        <label className="text-sm">
          Cost Price*
          <input className="mt-1 w-full rounded border px-3 py-2" type="number" min={0} step="0.01" required value={form.cost_price} onChange={(e) => update('cost_price', Number(e.target.value))} />
        </label>
        <label className="text-sm">
          Current Stock*
          <input className="mt-1 w-full rounded border px-3 py-2" type="number" min={0} required value={form.current_stock} onChange={(e) => update('current_stock', Number(e.target.value))} />
        </label>
        <label className="text-sm">
          Reorder Level*
          <input className="mt-1 w-full rounded border px-3 py-2" type="number" min={0} required value={form.reorder_level} onChange={(e) => update('reorder_level', Number(e.target.value))} />
        </label>
        <label className="text-sm">
          HSN Code
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.hsn_code} onChange={(e) => update('hsn_code', e.target.value)} />
        </label>
        <label className="text-sm">
          Tax Rate*
          <select className="mt-1 w-full rounded border px-3 py-2" value={form.tax_rate} onChange={(e) => update('tax_rate', Number(e.target.value))}>
            {TAX_OPTIONS.map((tax) => (
              <option key={tax} value={tax}>{tax}%</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Unit
          <select className="mt-1 w-full rounded border px-3 py-2" value={form.unit} onChange={(e) => update('unit', e.target.value)}>
            {UNIT_OPTIONS.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Supplier Name
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.supplier_name} onChange={(e) => update('supplier_name', e.target.value)} />
        </label>
        <label className="text-sm md:col-span-2">
          Product Image URL
          <input className="mt-1 w-full rounded border px-3 py-2" value={form.image_url} onChange={(e) => update('image_url', e.target.value)} />
        </label>

        <div className="md:col-span-2 flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-sm text-slate-600">Profit Margin</span>
          <span className={`text-sm font-semibold ${marginColor}`}>{formatPercent(margin)}</span>
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={saving} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
