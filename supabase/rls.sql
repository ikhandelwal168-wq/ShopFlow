-- Run this after supabase/schema.sql

-- 1) Auto-create user profile rows on auth signup/login providers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

-- 2) Helper to read role from user_profiles
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role FROM public.user_profiles WHERE id = auth.uid()), 'viewer')::TEXT;
$$;

GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

-- 3) Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4) Drop existing policies for idempotent re-run
DROP POLICY IF EXISTS products_select_authenticated ON public.products;
DROP POLICY IF EXISTS products_insert_staff_admin ON public.products;
DROP POLICY IF EXISTS products_update_staff_admin ON public.products;
DROP POLICY IF EXISTS products_delete_staff_admin ON public.products;

DROP POLICY IF EXISTS invoices_select_authenticated ON public.invoices;
DROP POLICY IF EXISTS invoices_insert_staff_admin ON public.invoices;
DROP POLICY IF EXISTS invoices_update_owner_or_admin ON public.invoices;
DROP POLICY IF EXISTS invoices_delete_owner_or_admin ON public.invoices;

DROP POLICY IF EXISTS invoice_items_select_authenticated ON public.invoice_items;
DROP POLICY IF EXISTS invoice_items_insert_staff_admin ON public.invoice_items;
DROP POLICY IF EXISTS invoice_items_update_staff_admin ON public.invoice_items;
DROP POLICY IF EXISTS invoice_items_delete_staff_admin ON public.invoice_items;

DROP POLICY IF EXISTS stock_adjustments_select_authenticated ON public.stock_adjustments;
DROP POLICY IF EXISTS stock_adjustments_insert_staff_admin ON public.stock_adjustments;
DROP POLICY IF EXISTS stock_adjustments_update_staff_admin ON public.stock_adjustments;
DROP POLICY IF EXISTS stock_adjustments_delete_admin ON public.stock_adjustments;

DROP POLICY IF EXISTS user_profiles_select_self_or_admin ON public.user_profiles;
DROP POLICY IF EXISTS user_profiles_insert_self_or_admin ON public.user_profiles;
DROP POLICY IF EXISTS user_profiles_update_self_or_admin ON public.user_profiles;
DROP POLICY IF EXISTS user_profiles_delete_admin ON public.user_profiles;

-- 5) Products policies
CREATE POLICY products_select_authenticated
ON public.products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY products_insert_staff_admin
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.current_user_role() IN ('admin', 'staff'));

CREATE POLICY products_update_staff_admin
ON public.products
FOR UPDATE
TO authenticated
USING (public.current_user_role() IN ('admin', 'staff'))
WITH CHECK (public.current_user_role() IN ('admin', 'staff'));

CREATE POLICY products_delete_staff_admin
ON public.products
FOR DELETE
TO authenticated
USING (public.current_user_role() IN ('admin', 'staff'));

-- 6) Invoice policies
CREATE POLICY invoices_select_authenticated
ON public.invoices
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY invoices_insert_staff_admin
ON public.invoices
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role() IN ('admin', 'staff')
  AND created_by = auth.uid()
);

CREATE POLICY invoices_update_owner_or_admin
ON public.invoices
FOR UPDATE
TO authenticated
USING (
  (created_by = auth.uid() AND public.current_user_role() IN ('admin', 'staff'))
  OR public.current_user_role() = 'admin'
)
WITH CHECK (
  (created_by = auth.uid() AND public.current_user_role() IN ('admin', 'staff'))
  OR public.current_user_role() = 'admin'
);

CREATE POLICY invoices_delete_owner_or_admin
ON public.invoices
FOR DELETE
TO authenticated
USING (
  (created_by = auth.uid() AND public.current_user_role() IN ('admin', 'staff'))
  OR public.current_user_role() = 'admin'
);

-- 7) Invoice item policies
CREATE POLICY invoice_items_select_authenticated
ON public.invoice_items
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY invoice_items_insert_staff_admin
ON public.invoice_items
FOR INSERT
TO authenticated
WITH CHECK (public.current_user_role() IN ('admin', 'staff'));

CREATE POLICY invoice_items_update_staff_admin
ON public.invoice_items
FOR UPDATE
TO authenticated
USING (public.current_user_role() IN ('admin', 'staff'))
WITH CHECK (public.current_user_role() IN ('admin', 'staff'));

CREATE POLICY invoice_items_delete_staff_admin
ON public.invoice_items
FOR DELETE
TO authenticated
USING (public.current_user_role() IN ('admin', 'staff'));

-- 8) Stock adjustments policies
CREATE POLICY stock_adjustments_select_authenticated
ON public.stock_adjustments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY stock_adjustments_insert_staff_admin
ON public.stock_adjustments
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role() IN ('admin', 'staff')
  AND adjusted_by = auth.uid()
);

CREATE POLICY stock_adjustments_update_staff_admin
ON public.stock_adjustments
FOR UPDATE
TO authenticated
USING (public.current_user_role() IN ('admin', 'staff'))
WITH CHECK (public.current_user_role() IN ('admin', 'staff'));

CREATE POLICY stock_adjustments_delete_admin
ON public.stock_adjustments
FOR DELETE
TO authenticated
USING (public.current_user_role() = 'admin');

-- 9) User profile policies
CREATE POLICY user_profiles_select_self_or_admin
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY user_profiles_insert_self_or_admin
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY user_profiles_update_self_or_admin
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid() OR public.current_user_role() = 'admin')
WITH CHECK (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY user_profiles_delete_admin
ON public.user_profiles
FOR DELETE
TO authenticated
USING (public.current_user_role() = 'admin');

-- 10) Storage buckets and policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-pdfs', 'invoice-pdfs', false)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS storage_select_authenticated ON storage.objects;
DROP POLICY IF EXISTS storage_insert_staff_admin ON storage.objects;
DROP POLICY IF EXISTS storage_update_owner_or_admin ON storage.objects;
DROP POLICY IF EXISTS storage_delete_owner_or_admin ON storage.objects;

CREATE POLICY storage_select_authenticated
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id IN ('product-images', 'invoice-pdfs'));

CREATE POLICY storage_insert_staff_admin
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('product-images', 'invoice-pdfs')
  AND public.current_user_role() IN ('admin', 'staff')
);

CREATE POLICY storage_update_owner_or_admin
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id IN ('product-images', 'invoice-pdfs')
  AND (owner = auth.uid() OR public.current_user_role() = 'admin')
)
WITH CHECK (
  bucket_id IN ('product-images', 'invoice-pdfs')
  AND (owner = auth.uid() OR public.current_user_role() = 'admin')
);

CREATE POLICY storage_delete_owner_or_admin
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id IN ('product-images', 'invoice-pdfs')
  AND (owner = auth.uid() OR public.current_user_role() = 'admin')
);
