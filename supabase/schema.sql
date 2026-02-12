CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  size_variant TEXT,
  barcode TEXT UNIQUE,
  mrp DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  current_stock INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,
  hsn_code TEXT,
  tax_rate DECIMAL(5,2) DEFAULT 18.00,
  unit TEXT DEFAULT 'piece',
  supplier_name TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(current_stock);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_date TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT,
  customer_phone TEXT,
  customer_gstin TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  total_tax DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'upi')),
  amount_tendered DECIMAL(10,2),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  adjustment_type TEXT CHECK (adjustment_type IN ('damage', 'return_supplier', 'return_customer', 'correction')),
  quantity_change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  adjusted_by UUID REFERENCES auth.users(id),
  adjusted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'staff', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION decrease_stock(product_id_input UUID, quantity_input INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET current_stock = GREATEST(0, current_stock - quantity_input)
  WHERE id = product_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_daily_sales(days_input INTEGER)
RETURNS TABLE(date TEXT, revenue NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE(invoice_date), 'YYYY-MM-DD') AS date,
    COALESCE(SUM(grand_total), 0) AS revenue
  FROM invoices
  WHERE invoice_date >= (CURRENT_DATE - (days_input - 1))
  GROUP BY DATE(invoice_date)
  ORDER BY DATE(invoice_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
