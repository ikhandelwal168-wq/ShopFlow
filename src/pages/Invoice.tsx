import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { formatMoney, toLocalDateTime } from '@/lib/utils'

interface InvoicePrintData {
  invoice_number: string
  invoice_date: string
  customer_name: string | null
  payment_method: string
  amount_tendered: number | null
  grand_total: number
  subtotal: number
  total_tax: number
  invoice_items: Array<{
    product_name: string
    quantity: number
    unit_price: number
    tax_rate: number
    total: number
  }>
}

export function InvoicePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<InvoicePrintData | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!id) return
      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_number, invoice_date, customer_name, payment_method, amount_tendered, grand_total, subtotal, total_tax, invoice_items(product_name, quantity, unit_price, tax_rate, total)')
        .eq('id', id)
        .single()
      if (!error) setData(data as InvoicePrintData)
    }

    void load()
  }, [id])

  if (!data) return <div className="p-6">Loading invoice...</div>

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 print:p-0">
      <div className="rounded border border-slate-200 bg-white p-6 font-mono text-sm print:border-none">
        <p className="text-center text-lg font-bold">SHOP NAME</p>
        <p className="text-center">Complete Address</p>
        <p className="text-center">GSTIN: XXXXXXXXXXXX</p>
        <p className="mt-4">Invoice #: {data.invoice_number}</p>
        <p>Date: {toLocalDateTime(data.invoice_date)}</p>
        <p>Customer: {data.customer_name || 'Walk-in'}</p>

        <div className="mt-3 border-t border-b border-slate-900 py-2">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left">Item</th>
                <th className="text-left">Qty</th>
                <th className="text-left">Rate</th>
                <th className="text-left">Tax</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.invoice_items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit_price.toFixed(2)}</td>
                  <td>{item.tax_rate}%</td>
                  <td className="text-right">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 space-y-1 text-right">
          <p>Subtotal: {formatMoney(data.subtotal)}</p>
          <p>CGST: {formatMoney(data.total_tax / 2)}</p>
          <p>SGST: {formatMoney(data.total_tax / 2)}</p>
          <p className="text-lg font-semibold">Grand Total: {formatMoney(data.grand_total)}</p>
        </div>

        <p className="mt-3">Payment Method: {data.payment_method.toUpperCase()}</p>
        {data.amount_tendered ? <p>Tendered: {formatMoney(data.amount_tendered)}</p> : null}
      </div>

      <div className="flex gap-2 print:hidden">
        <button type="button" onClick={() => window.print()} className="rounded bg-blue-600 px-4 py-2 text-white">Print</button>
        <button type="button" onClick={() => navigate('/billing')} className="rounded border px-4 py-2">Close</button>
      </div>
    </div>
  )
}
