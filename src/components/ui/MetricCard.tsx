import { Card } from '@/components/ui/Card'

interface Props {
  title: string
  value: string
  hint?: string
}

export function MetricCard({ title, value, hint }: Props) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </Card>
  )
}
