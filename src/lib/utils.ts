import type { Product } from '@/types/product'

export const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export function formatMoney(value: number) {
  return INR.format(Number.isFinite(value) ? value : 0)
}

export function formatPercent(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(2)}%`
}

export function productProfitMargin(product: Pick<Product, 'mrp' | 'cost_price'>) {
  if (!product.cost_price) return 0
  return ((product.mrp - product.cost_price) / product.cost_price) * 100
}

export function stockStatus(currentStock: number, reorderLevel: number) {
  if (currentStock <= 0) return 'out_of_stock' as const
  if (currentStock <= reorderLevel) return 'low_stock' as const
  return 'in_stock' as const
}

export function toLocalDateTime(value: string) {
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function yyyymmdd(date = new Date()) {
  return date.toISOString().slice(0, 10).split('-').join('')
}

export function daysBetween(dateISO: string) {
  const ms = Date.now() - new Date(dateISO).getTime()
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

export function downloadCSV(filename: string, headers: string[], rows: Array<(string | number | null)[]>) {
  const escape = (v: string | number | null) => {
    const text = String(v ?? '')
    return /[",\n]/.test(text) ? `"${text.split('"').join('""')}"` : text
  }
  const csv = [headers.join(','), ...rows.map((row) => row.map(escape).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
