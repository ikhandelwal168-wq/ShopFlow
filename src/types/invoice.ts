export type PaymentMethod = 'cash' | 'card' | 'upi'

export interface Invoice {
  id: string
  invoice_number: string
  invoice_date: string
  customer_name: string | null
  customer_phone: string | null
  customer_gstin: string | null
  subtotal: number
  total_tax: number
  discount: number
  grand_total: number
  payment_method: PaymentMethod
  amount_tendered: number | null
  created_by: string | null
  created_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  tax_rate: number
  tax_amount: number
  total: number
}

export interface CartItem {
  product_id: string
  product_name: string
  tax_rate: number
  mrp: number
  cost_price: number
  quantity: number
  discount: number
}
