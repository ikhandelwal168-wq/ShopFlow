import { useEffect, useState } from 'react'
import { CreditCard, IndianRupee, Smartphone } from 'lucide-react'
import { BillingCart } from '@/components/billing/BillingCart'
import { ProductSearch } from '@/components/billing/ProductSearch'
import { useBilling } from '@/hooks/useBilling'
import { useProducts } from '@/hooks/useProducts'
import { formatMoney } from '@/lib/utils'
import type { PaymentMethod } from '@/types/invoice'

const paymentOptions: Array<{ key: PaymentMethod; label: string; icon: typeof IndianRupee }> = [
  { key: 'cash', label: 'Cash', icon: IndianRupee },
  { key: 'card', label: 'Card', icon: CreditCard },
  { key: 'upi', label: 'UPI / QR', icon: Smartphone },
]

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
    <div className="grid gap-4 2xl:grid-cols-[1.45fr_1fr]">
      <div className="space-y-4">
        <div className="app-panel p-4">
          <label className="flex items-center gap-3 rounded-2xl border border-[#e4eaf5] bg-[#f8fafd] px-4 py-3 text-[#8a99b2]">
            <input
              className="w-full border-none bg-transparent p-0 text-sm text-[#1f2b46] placeholder:text-[#9ba9bf] focus:outline-none"
              placeholder="Enter Barcode..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && scanBarcode()}
            />
            <button type="button" onClick={scanBarcode} className="rounded-xl bg-[#2f66de] px-4 py-2 text-base font-semibold text-white">
              Add
            </button>
          </label>
        </div>

        <ProductSearch products={products} onPick={addToCart} />
        <BillingCart cart={cart} updateQty={updateQty} removeItem={removeItem} clearCart={clearCart} />
      </div>

      <aside className="app-panel p-6">
        <h3 className="text-[34px] font-semibold text-[#1f2b46]">Customer Information</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input
            className="rounded-2xl border border-[#e4eaf5] bg-[#f8fafd] px-4 py-3 text-sm text-[#1f2b46] placeholder:text-[#98a6bc]"
            placeholder="Walk-in Customer"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          <input
            className="rounded-2xl border border-[#e4eaf5] bg-[#f8fafd] px-4 py-3 text-sm text-[#1f2b46] placeholder:text-[#98a6bc]"
            placeholder="+91 99999 99999"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#7f8ea7]">Payment Method</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {paymentOptions.map((option) => {
              const Icon = option.icon
              const active = paymentMethod === option.key
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setPaymentMethod(option.key)}
                  className={`rounded-2xl border px-4 py-5 text-center transition ${
                    active ? 'border-[#2f66de] bg-[#eef4ff] text-[#2f66de]' : 'border-[#e4eaf5] bg-white text-[#62738e]'
                  }`}
                >
                  <Icon className="mx-auto mb-2" size={28} />
                  <span className="text-base font-semibold">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 space-y-4 text-base">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-[#445571]">Amount Tendered</span>
            <input
              className="w-36 rounded-xl border border-[#bdeacc] bg-[#e6f8ee] px-3 py-2 text-right font-semibold text-[#0f9a67]"
              type="number"
              min={0}
              value={amountTendered}
              onChange={(e) => setAmountTendered(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-between text-[#60718b]">
            <span>Subtotal (Pre-tax)</span>
            <span className="font-semibold text-[#1f2b46]">{formatMoney(totals.taxable)}</span>
          </div>
          <div className="flex justify-between text-[#60718b]">
            <span>GST Breakdown (CGST+SGST)</span>
            <span className="font-semibold text-[#1f2b46]">{formatMoney(totals.tax)}</span>
          </div>
          <div className="flex justify-between text-[#60718b]">
            <span>Discount</span>
            <input
              className="w-32 rounded-lg border border-[#dfe6f2] px-2 py-1 text-right"
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-[#081735] px-6 py-5 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8fa3c8]">Grand Total</p>
          <p className="mt-2 text-3xl font-bold">{formatMoney(totals.total)}</p>
          <p className="mt-2 text-sm text-[#8fa3c8]">Change: {formatMoney(totals.change)}</p>
        </div>

        <div className="mt-6 grid gap-3">
          <button type="button" onClick={clearCart} className="rounded-2xl border border-[#dfe6f2] px-5 py-3 text-sm font-semibold text-[#5f6f88]">
            Hold Bill
          </button>
          <button
            type="button"
            onClick={() => void completeSale()}
            disabled={saving}
            className="rounded-3xl bg-[#8ca8eb] px-5 py-4 text-2xl font-bold text-white shadow-[0_10px_28px_rgba(74,110,190,0.35)] disabled:opacity-70"
          >
            {saving ? 'Processing...' : 'Complete & Print'}
          </button>
        </div>
      </aside>
    </div>
  )
}
