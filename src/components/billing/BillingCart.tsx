import { ShoppingCart } from 'lucide-react'
import type { CartItem } from '@/types/invoice'
import { formatMoney } from '@/lib/utils'

interface Props {
  cart: CartItem[]
  updateQty: (productId: string, qty: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export function BillingCart({ cart, updateQty, removeItem, clearCart }: Props) {
  return (
    <div className="app-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#e8edf5] px-6 py-5">
        <h3 className="text-[30px] font-semibold text-[#1f2b46]">Current Cart ({cart.length} items)</h3>
        <button type="button" onClick={clearCart} className="text-sm font-semibold text-[#ef3f67]">
          Clear All
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#f6f8fc] text-[11px] uppercase tracking-wide text-[#73839d]">
            <tr>
              <th className="px-6 py-4">Item Details</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Unit Price</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.product_id} className="border-t border-[#edf1f7] text-sm text-[#1f2b46]">
                <td className="px-6 py-4 font-semibold">{item.product_name}</td>
                <td className="px-6 py-4">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6f2] px-2 py-1">
                    <button type="button" onClick={() => updateQty(item.product_id, item.quantity - 1)} className="px-2 text-lg">-</button>
                    <input
                      className="w-12 border-none bg-transparent p-0 text-center text-lg font-semibold focus:outline-none"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQty(item.product_id, Number(e.target.value))}
                    />
                    <button type="button" onClick={() => updateQty(item.product_id, item.quantity + 1)} className="px-2 text-lg">+</button>
                  </div>
                </td>
                <td className="px-6 py-4">{formatMoney(item.mrp)}</td>
                <td className="px-6 py-4 font-semibold">{formatMoney(item.mrp * item.quantity)}</td>
                <td className="px-6 py-4">
                  <button type="button" onClick={() => removeItem(item.product_id)} className="rounded-lg bg-[#fff1f4] px-3 py-1 text-xs text-[#cb3e5f]">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!cart.length ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-[#93a2b9]">
          <ShoppingCart size={72} />
          <p className="text-2xl font-semibold">Your cart is empty</p>
          <p className="text-sm">Scan items to start billing</p>
        </div>
      ) : null}
    </div>
  )
}
