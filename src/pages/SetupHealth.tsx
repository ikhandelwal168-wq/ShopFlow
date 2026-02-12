import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

type CheckLevel = 'ok' | 'warn' | 'fail' | 'info'

type CheckResult = {
  key: string
  label: string
  level: CheckLevel
  message: string
}

const requiredTables = ['products', 'invoices', 'invoice_items', 'stock_adjustments', 'user_profiles']

function levelStyle(level: CheckLevel) {
  if (level === 'ok') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  if (level === 'warn') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  if (level === 'fail') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

export function SetupHealthPage() {
  const { user } = useAuth()
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<CheckResult[]>([])

  const summary = useMemo(() => {
    const fail = results.filter((r) => r.level === 'fail').length
    const warn = results.filter((r) => r.level === 'warn').length
    return { fail, warn }
  }, [results])

  const runChecks = async () => {
    setRunning(true)
    const checks: CheckResult[] = []

    const hasUrl = Boolean(import.meta.env.VITE_SUPABASE_URL)
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
    const hasAnon = Boolean(anon && anon !== 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE' && anon !== 'YOUR_SUPABASE_ANON_KEY')
    checks.push({
      key: 'env-url',
      label: 'Env: Supabase URL',
      level: hasUrl ? 'ok' : 'fail',
      message: hasUrl ? 'Configured' : 'Missing VITE_SUPABASE_URL in .env',
    })
    checks.push({
      key: 'env-key',
      label: 'Env: Supabase Anon Key',
      level: hasAnon ? 'ok' : 'fail',
      message: hasAnon ? 'Configured' : 'Missing/placeholder VITE_SUPABASE_ANON_KEY in .env',
    })

    checks.push({
      key: 'auth',
      label: 'Auth Session',
      level: user ? 'ok' : 'warn',
      message: user ? `Logged in as ${user.email}` : 'Not logged in. Sign in to validate RLS and storage access.',
    })

    for (const table of requiredTables) {
      const { error } = await supabase.from(table).select('*', { head: true, count: 'exact' })
      if (!error) {
        checks.push({ key: `table-${table}`, label: `Table: ${table}`, level: 'ok', message: 'Reachable' })
        continue
      }

      const missing = String(error.message).toLowerCase().includes('does not exist')
      const denied = String(error.message).toLowerCase().includes('permission denied')
      checks.push({
        key: `table-${table}`,
        label: `Table: ${table}`,
        level: missing ? 'fail' : denied ? 'warn' : 'fail',
        message: missing ? 'Table missing. Run supabase/schema.sql.' : denied ? 'Permission denied. Check RLS policies.' : error.message,
      })
    }

    const { data: buckets, error: bucketError } = await supabase
      .schema('storage')
      .from('buckets')
      .select('id')
      .in('id', ['product-images', 'invoice-pdfs'])
    if (bucketError) {
      checks.push({ key: 'storage', label: 'Storage Buckets', level: 'warn', message: `Could not verify buckets: ${bucketError.message}` })
    } else {
      const bucketIds = new Set((buckets ?? []).map((b) => b.id))
      const missingBuckets = ['product-images', 'invoice-pdfs'].filter((id) => !bucketIds.has(id))
      checks.push({
        key: 'storage',
        label: 'Storage Buckets',
        level: missingBuckets.length ? 'warn' : 'ok',
        message: missingBuckets.length ? `Missing bucket(s): ${missingBuckets.join(', ')}` : 'Buckets are present',
      })
    }

    checks.push({
      key: 'oauth',
      label: 'Google OAuth Redirect',
      level: 'info',
      message: 'Verify in Supabase/Auth and Google Cloud using supabase/OAUTH_SETUP.md',
    })

    setResults(checks)
    setRunning(false)
  }

  useEffect(() => {
    void runChecks()
  }, [user?.id])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Setup Health</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Checks env, auth, schema, RLS reachability, and storage buckets.</p>
        </div>
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          onClick={() => void runChecks()}
          disabled={running}
        >
          {running ? 'Running...' : 'Run Checks'}
        </button>
      </div>

      <div className="rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {summary.fail > 0 ? `${summary.fail} blocking issue(s) found.` : 'No blocking issues found.'}
          {summary.warn > 0 ? ` ${summary.warn} warning(s) found.` : ''}
        </p>
      </div>

      <div className="space-y-2">
        {results.map((result) => (
          <div key={result.key} className="flex items-start justify-between gap-3 rounded border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{result.label}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{result.message}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${levelStyle(result.level)}`}>
              {result.level.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
