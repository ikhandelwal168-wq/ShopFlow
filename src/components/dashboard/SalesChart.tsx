import { Card } from '@/components/ui/Card'
import type { DaySalesPoint } from '@/types/report'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function SalesChart({ points }: { points: DaySalesPoint[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Sales Trend (7 days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
