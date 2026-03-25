import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductFormInput } from '@/types/product'

function buildSku(name: string) {
  const prefix = name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'ITEM'
  const now = Date.now().toString().slice(-5)
  const rand = Math.floor(Math.random() * 90 + 10)
  return `${prefix}-${now}${rand}`
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
      setLoading(false)
      return
    }

    setProducts((data as Product[]) ?? [])
    setError(null)
    setLoading(false)
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        void loadProducts()
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  const byBarcode = useMemo(() => {
    const index = new Map<string, Product>()
    for (const product of products) {
      if (product.barcode) index.set(product.barcode, product)
    }
    return index
  }, [products])

  const createProduct = async (input: ProductFormInput) => {
    const normalizedInput = {
      ...input,
      name: input.name.trim(),
      category: input.category.trim(),
      brand: input.brand?.trim(),
      size_variant: input.size_variant?.trim(),
      barcode: input.barcode?.trim(),
      hsn_code: input.hsn_code?.trim(),
      supplier_name: input.supplier_name?.trim(),
      image_url: input.image_url?.trim(),
      mrp: Number(input.mrp),
      cost_price: Number(input.cost_price),
      current_stock: Number(input.current_stock),
      reorder_level: Number(input.reorder_level),
      tax_rate: Number(input.tax_rate),
    }

    if (!normalizedInput.name) throw new Error('Product name is required')
    if (!normalizedInput.category) throw new Error('Category is required')
    if (!Number.isFinite(normalizedInput.mrp) || normalizedInput.mrp < 0) throw new Error('Enter a valid MRP')
    if (!Number.isFinite(normalizedInput.cost_price) || normalizedInput.cost_price < 0) throw new Error('Enter a valid cost price')
    if (!Number.isFinite(normalizedInput.current_stock) || normalizedInput.current_stock < 0) throw new Error('Enter valid initial stock')
    if (!Number.isFinite(normalizedInput.reorder_level) || normalizedInput.reorder_level < 0) throw new Error('Enter valid reorder level')

    let lastError: Error | null = null
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const payload = {
        ...normalizedInput,
        sku: buildSku(normalizedInput.name),
        brand: normalizedInput.brand || null,
        size_variant: normalizedInput.size_variant || null,
        barcode: normalizedInput.barcode || null,
        hsn_code: normalizedInput.hsn_code || null,
        supplier_name: normalizedInput.supplier_name || null,
        image_url: normalizedInput.image_url || null,
        is_active: true,
      }

      const { error: insertError } = await supabase.from('products').insert(payload)
      if (!insertError) {
        await loadProducts()
        return
      }

      // Retry only for SKU collisions, surface clear message for barcode collisions.
      if (insertError.code === '23505' && insertError.message.toLowerCase().includes('barcode')) {
        throw new Error('This barcode already exists. Use a unique barcode.')
      }
      if (insertError.code === '23505' && insertError.message.toLowerCase().includes('sku')) {
        lastError = new Error('SKU conflict, retrying...')
        continue
      }
      throw new Error(insertError.message)
    }

    throw lastError ?? new Error('Unable to create product right now. Please try again.')
  }

  const updateProduct = async (id: string, input: ProductFormInput) => {
    const payload = {
      ...input,
      brand: input.brand || null,
      size_variant: input.size_variant || null,
      barcode: input.barcode || null,
      hsn_code: input.hsn_code || null,
      supplier_name: input.supplier_name || null,
      image_url: input.image_url || null,
    }
    const { error: updateError } = await supabase.from('products').update(payload).eq('id', id)
    if (updateError) throw updateError
    await loadProducts()
  }

  const deleteProduct = async (id: string) => {
    const { error: deleteError } = await supabase.from('products').update({ is_active: false }).eq('id', id)
    if (deleteError) throw deleteError
    await loadProducts()
  }

  return {
    products,
    loading,
    error,
    byBarcode,
    refresh: loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
