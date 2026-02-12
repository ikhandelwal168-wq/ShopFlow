import { Badge } from '@/components/ui/Badge'
import { Table, TBody, THead } from '@/components/ui/Table'
import { formatMoney, formatPercent, productProfitMargin, stockStatus } from '@/lib/utils'
import type { Product } from '@/types/product'

interface Props {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

function stockBadge(product: Product) {
  const status = stockStatus(product.current_stock, product.reorder_level)
  if (status === 'in_stock') return <Badge color="green">In Stock</Badge>
  if (status === 'low_stock') return <Badge color="yellow">Low Stock</Badge>
  return <Badge color="red">Out of Stock</Badge>
}

export function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-auto rounded border border-slate-200 bg-white">
      <Table>
        <THead>
          <tr>
            <th className="px-3 py-2">SKU</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Brand</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Stock</th>
            <th className="px-3 py-2">MRP</th>
            <th className="px-3 py-2">Cost</th>
            <th className="px-3 py-2">Profit %</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </THead>
        <TBody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-3 py-2">{product.sku}</td>
              <td className="px-3 py-2 font-medium">{product.name}</td>
              <td className="px-3 py-2">{product.brand || '-'}</td>
              <td className="px-3 py-2">{product.category}</td>
              <td className="px-3 py-2">{product.current_stock}</td>
              <td className="px-3 py-2">{formatMoney(product.mrp)}</td>
              <td className="px-3 py-2">{formatMoney(product.cost_price)}</td>
              <td className="px-3 py-2">{formatPercent(productProfitMargin(product))}</td>
              <td className="px-3 py-2">{stockBadge(product)}</td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <button type="button" className="rounded bg-slate-100 px-2 py-1 text-xs" onClick={() => onEdit(product)}>Edit</button>
                  <button type="button" className="rounded bg-rose-100 px-2 py-1 text-xs text-rose-700" onClick={() => onDelete(product)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </TBody>
      </Table>
    </div>
  )
}
