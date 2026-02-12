import { useEffect, useState } from 'react'
import { subDays } from 'date-fns'
import { supabase } from '@/lib/supabase'
import type { BestSellerRow, CategorySalesPoint, DaySalesPoint } from '@/types/report'

type InvoiceItemRow = {
  quantity: number
  unit_price: number
  product_id: string | null
}

type InvoiceRow = {
  id: string
  grand_total: number
  invoice_date: string
  invoice_items?: InvoiceItemRow[]
}

interface DashboardSummary {
  todayRevenue: number
  todayProfit: number
  billCount: number
  lowStockCount: number
  margin: number
}

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary>({
    todayRevenue: 0,
    todayProfit: 0,
    billCount: 0,
    lowStockCount: 0,
    margin: 0,
  })
  const [salesTrend, setSalesTrend] = useState<DaySalesPoint[]>([])
  const [categorySales, setCategorySales] = useState<CategorySalesPoint[]>([])
  const [bestSellers, setBestSellers] = useState<BestSellerRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const today = new Date().toISOString().slice(0, 10)
    const from = subDays(new Date(), 6).toISOString().slice(0, 10)

    const [invoiceRes, lowStockRes, trendRes, bestRes] = await Promise.all([
      supabase
        .from('invoices')
        .select('id, grand_total, invoice_date, invoice_items(quantity, unit_price, product_id)')
        .gte('invoice_date', `${today}T00:00:00`),
      supabase.from('products').select('id, current_stock, reorder_level'),
      supabase.rpc('get_daily_sales', { days_input: 7 }),
      supabase
        .from('invoice_items')
        .select('product_id, product_name, quantity, total')
        .gte('created_at', `${from}T00:00:00`),
    ])

    const invoices = (invoiceRes.data ?? []) as InvoiceRow[]
    const todayRevenue = invoices.reduce((sum: number, inv: InvoiceRow) => sum + Number(inv.grand_total || 0), 0)

    const productIds = Array.from(
      new Set(
        invoices.flatMap((inv: InvoiceRow) =>
          (inv.invoice_items ?? []).map((item: InvoiceItemRow) => item.product_id).filter(Boolean),
        ),
      ),
    ) as string[]

    let todayProfit = 0
    if (productIds.length) {
      const { data: products } = await supabase.from('products').select('id, cost_price').in('id', productIds)
      const costMap = new Map((products ?? []).map((p: { id: string; cost_price: number }) => [p.id, Number(p.cost_price)]))
      for (const inv of invoices) {
        for (const item of inv.invoice_items ?? []) {
          const cost = costMap.get(String(item.product_id)) ?? 0
          todayProfit += (Number(item.unit_price) - cost) * Number(item.quantity)
        }
      }
    }

    const bestMap = new Map<string, BestSellerRow>()
    for (const row of bestRes.data ?? []) {
      const key = row.product_id as string
      const existing = bestMap.get(key)
      const revenue = Number(row.total)
      const qty = Number(row.quantity)
      if (existing) {
        existing.revenue += revenue
        existing.quantity += qty
      } else {
        bestMap.set(key, {
          product_id: key,
          product_name: row.product_name as string,
          quantity: qty,
          revenue,
          profit: 0,
        })
      }
    }

    const best = Array.from(bestMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10)

    const { data: categoryData } = await supabase
      .from('invoice_items')
      .select('total, products(category)')
      .gte('created_at', `${from}T00:00:00`)

    const categoryMap = new Map<string, number>()
    for (const row of categoryData ?? []) {
      const productInfo = Array.isArray(row.products) ? row.products[0] : row.products
      const category = String(productInfo?.category ?? 'Other')
      categoryMap.set(category, (categoryMap.get(category) ?? 0) + Number(row.total))
    }

    setSummary({
      todayRevenue,
      todayProfit,
      billCount: invoices.length,
      lowStockCount: (lowStockRes.data ?? []).filter(
        (p: { current_stock: number; reorder_level: number }) => Number(p.current_stock) <= Number(p.reorder_level),
      ).length,
      margin: todayRevenue ? (todayProfit / todayRevenue) * 100 : 0,
    })
    setSalesTrend((trendRes.data as DaySalesPoint[]) ?? [])
    setBestSellers(best)
    setCategorySales(Array.from(categoryMap.entries()).map(([category, revenue]) => ({ category, revenue })))
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  return { summary, salesTrend, categorySales, bestSellers, loading, refresh: load }
}
