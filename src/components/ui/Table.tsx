import type { ReactNode } from 'react'

export function Table({ children }: { children: ReactNode }) {
  return <table className="min-w-full text-left text-sm">{children}</table>
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="bg-slate-100 text-slate-700">{children}</thead>
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>
}
