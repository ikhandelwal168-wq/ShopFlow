export interface DaySalesPoint {
  date: string
  revenue: number
}

export interface CategorySalesPoint {
  category: string
  revenue: number
}

export interface BestSellerRow {
  product_id: string
  product_name: string
  quantity: number
  revenue: number
  profit: number
}

export interface SlowMovingRow {
  id: string
  name: string
  category: string
  current_stock: number
  cost_price: number
  stock_value: number
  last_sale_date: string | null
  days_stagnant: number
}
