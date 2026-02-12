import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductFormInput } from '@/types/product'

function buildSku(name: string) {
  const prefix = name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4) || 'ITEM'
  const suffix = Math.floor(Math.random() * 9000 + 1000)
  return `${prefix}-${suffix}`
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
    const payload = {
      ...input,
      sku: buildSku(input.name),
      brand: input.brand || null,
      size_variant: input.size_variant || null,
      barcode: input.barcode || null,
      hsn_code: input.hsn_code || null,
      supplier_name: input.supplier_name || null,
      image_url: input.image_url || null,
      is_active: true,
    }
    const { error: insertError } = await supabase.from('products').insert(payload)
    if (insertError) throw insertError
    await loadProducts()
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
