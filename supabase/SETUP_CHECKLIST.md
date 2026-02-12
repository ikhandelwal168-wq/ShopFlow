# Supabase One-Time Setup Checklist

Run in order:

1. Open Supabase SQL Editor and run:
   - `supabase/schema.sql`
2. Then run:
   - `supabase/rls.sql`
3. Complete OAuth setup:
   - `supabase/OAUTH_SETUP.md`
4. Put anon key in local `.env`.
5. Restart frontend dev server.

Quick validation queries:

```sql
select table_name, row_security
from information_schema.tables
where table_schema = 'public'
  and table_name in ('products','invoices','invoice_items','stock_adjustments','user_profiles');
```

```sql
select id, name, public from storage.buckets where id in ('product-images', 'invoice-pdfs');
```
