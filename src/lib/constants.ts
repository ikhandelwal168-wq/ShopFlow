export const APP_NAME = 'ShopFlow Inventory'

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Groceries',
  'Cosmetics',
  'Stationery',
  'Other',
] as const

export const TAX_OPTIONS = [0, 5, 12, 18, 28] as const
export const UNIT_OPTIONS = ['piece', 'kg', 'liter', 'box', 'packet'] as const

export const BUSINESS_TYPES = [
  'general',
  'grocery',
  'fashion',
  'electronics',
  'pharmacy',
  'restaurant',
  'custom',
] as const

export type BusinessType = (typeof BUSINESS_TYPES)[number]

export const BUSINESS_CATEGORY_MAP: Record<BusinessType, string[]> = {
  general: ['General', 'Home', 'Daily Essentials', 'Accessories', 'Other'],
  grocery: ['Groceries', 'Fruits & Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Household', 'Other'],
  fashion: ['Clothing', 'Footwear', 'Accessories', 'Kids Wear', 'Ethnic Wear', 'Other'],
  electronics: ['Mobiles', 'Laptops', 'Accessories', 'Appliances', 'Wearables', 'Other'],
  pharmacy: ['Medicines', 'Supplements', 'Personal Care', 'Medical Devices', 'Baby Care', 'Other'],
  restaurant: ['Starters', 'Main Course', 'Beverages', 'Desserts', 'Combos', 'Other'],
  custom: [],
}

export function getBusinessCategories(businessType: string | null | undefined) {
  const key = (businessType ?? 'general') as BusinessType
  return BUSINESS_CATEGORY_MAP[key] ?? BUSINESS_CATEGORY_MAP.general
}
