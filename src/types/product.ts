export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface Product {
  id: string
  sku: string
  name: string
  brand: string | null
  category: string
  size_variant: string | null
  barcode: string | null
  mrp: number
  cost_price: number
  current_stock: number
  reorder_level: number
  hsn_code: string | null
  tax_rate: number
  unit: string
  supplier_name: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductFormInput {
  name: string
  brand?: string
  category: string
  size_variant?: string
  barcode?: string
  mrp: number
  cost_price: number
  current_stock: number
  reorder_level: number
  hsn_code?: string
  tax_rate: number
  unit: string
  supplier_name?: string
  image_url?: string
}
