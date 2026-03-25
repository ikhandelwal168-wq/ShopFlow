import type { CartItem } from '@/types/invoice'
import { formatMoney } from '@/lib/utils'

interface Props {
  cart: CartItem[]
  updateQty: (productId: string, qty: number) => void
  removeItem: (productId: string) => void
}

export function BillingCart({ cart, updateQty, removeItem }: Props) {
  return (
    <div className="overflow-auto rounded border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-2 text-left">Product</th>
            <th className="px-3 py-2 text-left">Qty</th>
            <th className="px-3 py-2 text-left">MRP</th>
            <th className="px-3 py-2 text-left">Tax</th>
            <th className="px-3 py-2 text-left">Total</th>
            <th className="px-3 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {cart.map((item) => (
            <tr key={item.product_id}>
              <td className="px-3 py-2">{item.product_name}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded border px-2" onClick={() => updateQty(item.product_id, item.quantity - 1)}>-</button>
                  <input
                    className="w-14 rounded border px-2 py-1"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQty(item.product_id, Number(e.target.value))}
                  />
                  <button type="button" className="rounded border px-2" onClick={() => updateQty(item.product_id, item.quantity + 1)}>+</button>
                </div>
              </td>
              <td className="px-3 py-2">{formatMoney(item.mrp)}</td>
              <td className="px-3 py-2">{item.tax_rate}%</td>
              <td className="px-3 py-2">{formatMoney(item.mrp * item.quantity)}</td>
              <td className="px-3 py-2">
                <button type="button" onClick={() => removeItem(item.product_id)} className="rounded bg-rose-100 px-2 py-1 text-xs text-rose-700">Remove</button>
              </td>
            </tr>
          ))}
          {!cart.length ? (
            <tr>
              <td className="px-3 py-8 text-center text-slate-500" colSpan={6}>Add products to start billing.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
