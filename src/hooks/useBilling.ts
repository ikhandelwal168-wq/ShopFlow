import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { CartItem, PaymentMethod } from '@/types/invoice'
import type { Product } from '@/types/product'
import { yyyymmdd } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface CustomerInput {
  name: string
  phone: string
  gstin: string
}

export function useBilling() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [amountTendered, setAmountTendered] = useState<number>(0)
  const [customer, setCustomer] = useState<CustomerInput>({ name: '', phone: '', gstin: '' })
  const [saving, setSaving] = useState(false)

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((row) => row.product_id === product.id)
      if (existing) {
        return prev.map((row) => (row.product_id === product.id ? { ...row, quantity: row.quantity + 1 } : row))
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          tax_rate: product.tax_rate,
          mrp: product.mrp,
          cost_price: product.cost_price,
          quantity: 1,
          discount: 0,
        },
      ]
    })
  }

  const updateQty = (productId: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((row) => (row.product_id === productId ? { ...row, quantity: Math.max(0, Math.floor(qty)) } : row))
        .filter((row) => row.quantity > 0),
    )
  }

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((row) => row.product_id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setDiscount(0)
    setAmountTendered(0)
    setCustomer({ name: '', phone: '', gstin: '' })
  }

  const totals = useMemo(() => {
    const gross = cart.reduce((sum, row) => sum + row.mrp * row.quantity - row.discount, 0)
    const taxable = cart.reduce((sum, row) => {
      const lineTotal = row.mrp * row.quantity - row.discount
      return sum + lineTotal / (1 + row.tax_rate / 100)
    }, 0)
    const tax = gross - taxable
    const grand = Math.max(0, gross - discount)
    const finalTaxable = grand - tax
    const cgst = tax / 2
    const sgst = tax / 2

    return {
      taxable: finalTaxable,
      tax,
      cgst,
      sgst,
      total: grand,
      change: Math.max(0, amountTendered - grand),
      profit: cart.reduce((sum, row) => sum + (row.mrp - row.cost_price) * row.quantity, 0),
    }
  }, [amountTendered, cart, discount])

  const completeSale = async () => {
    if (!user) throw new Error('User not authenticated')
    if (!cart.length) throw new Error('Cart is empty')

    setSaving(true)
    try {
      const dayCode = yyyymmdd()
      const { count, error: countError } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .like('invoice_number', `INV-${dayCode}-%`)

      if (countError) throw countError

      const invoiceNumber = `INV-${dayCode}-${String((count ?? 0) + 1).padStart(4, '0')}`

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          customer_name: customer.name || null,
          customer_phone: customer.phone || null,
          customer_gstin: customer.gstin || null,
          subtotal: totals.taxable,
          total_tax: totals.tax,
          discount,
          grand_total: totals.total,
          payment_method: paymentMethod,
          amount_tendered: paymentMethod === 'cash' ? amountTendered : null,
          created_by: user.id,
        })
        .select('id')
        .single()

      if (invoiceError || !invoice) throw invoiceError ?? new Error('Failed to create invoice')

      const itemsPayload = cart.map((row) => {
        const lineTotal = row.mrp * row.quantity - row.discount
        const taxAmount = lineTotal - lineTotal / (1 + row.tax_rate / 100)
        return {
          invoice_id: invoice.id,
          product_id: row.product_id,
          product_name: row.product_name,
          quantity: row.quantity,
          unit_price: row.mrp,
          tax_rate: row.tax_rate,
          tax_amount: taxAmount,
          total: lineTotal,
        }
      })

      const { error: itemError } = await supabase.from('invoice_items').insert(itemsPayload)
      if (itemError) throw itemError

      for (const item of cart) {
        const { error: rpcError } = await supabase.rpc('decrease_stock', {
          product_id_input: item.product_id,
          quantity_input: item.quantity,
        })
        if (rpcError) throw rpcError
      }

      clearCart()
      navigate(`/invoice/${invoice.id}`)
    } finally {
      setSaving(false)
    }
  }

  return {
    cart,
    customer,
    setCustomer,
    discount,
    setDiscount,
    paymentMethod,
    setPaymentMethod,
    amountTendered,
    setAmountTendered,
    saving,
    totals,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    completeSale,
  }
}
