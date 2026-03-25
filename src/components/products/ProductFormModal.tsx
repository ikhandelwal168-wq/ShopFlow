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
  categoryOptions?: string[]
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
  tax_rate: 0,
  unit: 'piece',
  supplier_name: '',
  image_url: '',
}

function getSkuPreview(name: string) {
  const normalized = name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3) || 'SKU'
  return `${normalized}-12345`
}

export function ProductFormModal({ open, onClose, onSave, product, categoryOptions = [] }: Props) {
  const [form, setForm] = useState<ProductFormInput>(defaultValues)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [customCategory, setCustomCategory] = useState('')

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
      setCustomCategory('')
    } else {
      setForm(defaultValues)
      setCustomCategory('')
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
    setError('')
    setSaving(true)
    try {
      const category = form.category === '__custom__' ? customCategory.trim() : form.category
      await onSave({
        ...form,
        category,
      })
      onClose()
      setForm(defaultValues)
      setCustomCategory('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const categoryList = Array.from(new Set([...PRODUCT_CATEGORIES, ...categoryOptions]))

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'}>
      <form className="space-y-7" onSubmit={handleSubmit}>
        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Product Name*</span>
              <input
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-lg text-[#1f2b46] placeholder:text-[#a0aec2]"
                required
                placeholder="e.g. Sony WH-1000XM5"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Category*</span>
              <select
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-lg text-[#1f2b46]"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
              >
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">Custom...</option>
              </select>
            </label>
          </div>

          {form.category === '__custom__' ? (
            <label className="block space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Custom Category*</span>
              <input
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-lg text-[#1f2b46]"
                required
                placeholder="Enter category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </label>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">SKU Code*</span>
              <input
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-base text-[#98a6bc]"
                value={product?.sku ?? getSkuPreview(form.name)}
                readOnly
              />
            </label>
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Barcode/EAN</span>
              <input
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-base text-[#1f2b46] placeholder:text-[#a0aec2]"
                placeholder="8901234..."
                value={form.barcode}
                onChange={(e) => update('barcode', e.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Brand</span>
              <input
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-base text-[#1f2b46] placeholder:text-[#a0aec2]"
                placeholder="e.g. Sony"
                value={form.brand}
                onChange={(e) => update('brand', e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 border-t border-[#e8edf5] pt-6">
          <h4 className="text-[28px] font-bold uppercase tracking-wide text-[#2f66de]">Pricing &amp; Inventory</h4>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">MRP (Inclusive)*</span>
              <input
                className="w-full rounded-2xl border border-[#bdeacc] bg-[#e6f8ee] px-4 py-3 text-base text-[#1f2b46]"
                type="number"
                min={0}
                step="0.01"
                required
                value={form.mrp}
                onChange={(e) => update('mrp', Number(e.target.value))}
              />
            </label>

            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Cost Price*</span>
              <input
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-base text-[#1f2b46]"
                type="number"
                min={0}
                step="0.01"
                required
                value={form.cost_price}
                onChange={(e) => update('cost_price', Number(e.target.value))}
              />
            </label>

            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Tax Rate (%)</span>
              <select className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-base text-[#1f2b46]" value={form.tax_rate} onChange={(e) => update('tax_rate', Number(e.target.value))}>
                {TAX_OPTIONS.map((tax) => (
                  <option key={tax} value={tax}>{tax}%</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Unit</span>
              <select className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-base text-[#1f2b46]" value={form.unit} onChange={(e) => update('unit', e.target.value)}>
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Initial Stock*</span>
              <input
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-base text-[#1f2b46]"
                type="number"
                min={0}
                required
                value={form.current_stock}
                onChange={(e) => update('current_stock', Number(e.target.value))}
              />
            </label>

            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">Reorder Alert Level*</span>
              <input
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-base text-[#1f2b46]"
                type="number"
                min={0}
                required
                value={form.reorder_level}
                onChange={(e) => update('reorder_level', Number(e.target.value))}
              />
            </label>

            <label className="space-y-2">
              <span className="text-base font-semibold text-[#34455f]">HSN Code</span>
              <input
                className="w-full rounded-2xl border border-[#d6e0ef] bg-[#f8fafd] px-4 py-3 text-base text-[#1f2b46]"
                value={form.hsn_code}
                onChange={(e) => update('hsn_code', e.target.value)}
              />
            </label>

            <div className="flex flex-col justify-end pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8da0bd]">Projected Margin</p>
              <p className={`text-3xl font-bold ${marginColor}`}>{formatPercent(margin)}</p>
            </div>
          </div>
        </section>

        {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        <div className="flex items-center justify-end gap-4 border-t border-[#e8edf5] pt-6">
          <button type="button" onClick={onClose} className="rounded-2xl px-5 py-3 text-lg font-semibold text-[#455772]">
            Close
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-[#2f66de] px-8 py-3 text-lg font-semibold text-white shadow-[0_10px_26px_rgba(47,102,222,0.35)] hover:bg-[#295dce] disabled:opacity-60"
          >
            {saving ? 'Saving...' : product ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
