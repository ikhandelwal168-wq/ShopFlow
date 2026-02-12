import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { APP_NAME } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'

const SUBMIT_COOLDOWN_SECONDS = 8

function normalizeAuthError(err: unknown, isSignup: boolean) {
  const message = err instanceof Error ? err.message : 'Authentication failed'
  const lower = message.toLowerCase()

  if (lower.includes('429') || lower.includes('too many requests') || lower.includes('rate limit')) {
    return isSignup
      ? 'Too many signup attempts. Wait a few minutes, then try again. If your account may already exist, use Sign in.'
      : 'Too many login attempts. Wait a few minutes and retry.'
  }

  return message
}

export function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  if (user) return <Navigate to="/dashboard" replace />

  useEffect(() => {
    if (!cooldownSeconds) return
    const interval = window.setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [cooldownSeconds])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cooldownSeconds > 0 || loading) return
    setError('')
    setCooldownSeconds(SUBMIT_COOLDOWN_SECONDS)
    try {
      if (isSignup) {
        await signUp(email, password, fullName)
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(normalizeAuthError(err, isSignup))
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-xl font-bold text-slate-900">{APP_NAME}</h1>
        <p className="mt-1 text-sm text-slate-500">Login to manage inventory and billing</p>

        <form className="mt-4 space-y-3" onSubmit={submit}>
          {isSignup ? (
            <input
              className="w-full rounded border px-3 py-2"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          ) : null}
          <input
            className="w-full rounded border px-3 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded border px-3 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error ? <p className="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || cooldownSeconds > 0}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : cooldownSeconds > 0
                ? `Please wait ${cooldownSeconds}s`
                : isSignup
                  ? 'Create account'
                  : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          className="mt-3 w-full rounded border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
        >
          Sign in with Google
        </button>

        <button
          type="button"
          onClick={() => setIsSignup((v) => !v)}
          className="mt-3 text-sm text-blue-700 hover:underline"
        >
          {isSignup ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
      </div>
    </div>
  )
}
