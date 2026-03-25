import { format } from 'date-fns'
import type { DaySalesPoint } from '@/types/report'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const amount = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

export function SalesChart({ points }: { points: DaySalesPoint[] }) {
  const chartData = points.map((point) => ({
    ...point,
    day: format(new Date(point.date), 'EEE'),
  }))

  return (
    <div className="app-panel p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#1f2b46]">Revenue Trend (7 Days)</h3>
        <button type="button" className="rounded-xl bg-[#f5f7fb] px-4 py-2 text-sm font-semibold text-[#4d5d79]">
          Last 7 Days
        </button>
      </div>

      <div className="h-[390px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 12, left: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e6edf7" strokeDasharray="4 4" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#64758f', fontSize: 13 }} />
            <YAxis tickFormatter={(value) => amount.format(value)} tickLine={false} axisLine={false} tick={{ fill: '#64758f', fontSize: 13 }} />
            <Tooltip formatter={(value: number) => [`₹${amount.format(Number(value))}`, 'Revenue']} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3c7bf0"
              strokeWidth={4}
              dot={{ r: 5, fill: '#3c7bf0' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
