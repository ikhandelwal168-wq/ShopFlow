import { useEffect, useState } from 'react'
import { BillingCart } from '@/components/billing/BillingCart'
import { ProductSearch } from '@/components/billing/ProductSearch'
import { useBilling } from '@/hooks/useBilling'
import { useProducts } from '@/hooks/useProducts'
import { formatMoney } from '@/lib/utils'

export function BillingPage() {
  const { products, byBarcode } = useProducts()
  const {
    cart,
    customer,
    setCustomer,
    discount,
    setDiscount,
    paymentMethod,
    setPaymentMethod,
    amountTendered,
    setAmountTendered,
    totals,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    completeSale,
    saving,
  } = useBilling()
  const [barcodeInput, setBarcodeInput] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        const search = document.getElementById('global-search') as HTMLInputElement | null
        search?.focus()
      }
      if (event.key === 'F8') {
        event.preventDefault()
        void completeSale()
      }
      if (event.key === 'F9') {
        event.preventDefault()
        clearCart()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [clearCart, completeSale])

  const scanBarcode = () => {
    const code = barcodeInput.trim()
    if (!code) return
    const product = byBarcode.get(code)
    if (product) addToCart(product)
    setBarcodeInput('')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-3">
        <div className="rounded border border-slate-200 bg-white p-3">
          <label className="text-sm text-slate-600">Barcode</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded border px-3 py-2"
              placeholder="Scan or type barcode"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && scanBarcode()}
            />
            <button type="button" onClick={scanBarcode} className="rounded bg-blue-600 px-4 py-2 text-white">Add</button>
          </div>
        </div>

        <ProductSearch products={products} onPick={addToCart} />
        <BillingCart cart={cart} updateQty={updateQty} removeItem={removeItem} />
      </div>

      <div className="space-y-3 rounded border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Bill Summary</h2>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Taxable</span><span>{formatMoney(totals.taxable)}</span></div>
          <div className="flex justify-between"><span>CGST</span><span>{formatMoney(totals.cgst)}</span></div>
          <div className="flex justify-between"><span>SGST</span><span>{formatMoney(totals.sgst)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>{formatMoney(discount)}</span></div>
          <div className="mt-2 flex justify-between border-t pt-2 text-lg font-semibold"><span>Grand Total</span><span>{formatMoney(totals.total)}</span></div>
        </div>

        <label className="text-sm">
          Discount
          <input className="mt-1 w-full rounded border px-3 py-2" type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        </label>

        <div className="grid gap-2 text-sm">
          <label>
            Customer Name
            <input className="mt-1 w-full rounded border px-3 py-2" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          </label>
          <label>
            Phone
            <input className="mt-1 w-full rounded border px-3 py-2" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          </label>
          <label>
            GSTIN
            <input className="mt-1 w-full rounded border px-3 py-2" value={customer.gstin} onChange={(e) => setCustomer({ ...customer, gstin: e.target.value })} />
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm">Payment Method</p>
          <div className="flex gap-3 text-sm">
            {(['cash', 'card', 'upi'] as const).map((method) => (
              <label key={method} className="inline-flex items-center gap-2">
                <input type="radio" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                {method.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {paymentMethod === 'cash' ? (
          <div className="space-y-1 text-sm">
            <label>
              Amount Tendered
              <input className="mt-1 w-full rounded border px-3 py-2" type="number" min={0} value={amountTendered} onChange={(e) => setAmountTendered(Number(e.target.value))} />
            </label>
            <p>Change: {formatMoney(totals.change)}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button type="button" className="rounded border px-4 py-2" onClick={clearCart}>Hold Bill</button>
          <button type="button" className="rounded bg-emerald-600 px-4 py-2 text-white" onClick={() => void completeSale()} disabled={saving}>
            {saving ? 'Processing...' : 'Complete Sale (F8)'}
          </button>
        </div>
      </div>
    </div>
  )
}
