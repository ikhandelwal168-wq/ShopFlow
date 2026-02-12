import type { ReactNode } from 'react'

interface Props {
  color: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
  children: ReactNode
}

export function Badge({ color, children }: Props) {
  const style = {
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
    red: 'bg-rose-100 text-rose-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-slate-100 text-slate-700',
  }[color]

  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{children}</span>
}
