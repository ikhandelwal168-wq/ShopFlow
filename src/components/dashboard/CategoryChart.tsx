import type { CategorySalesPoint } from '@/types/report'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const palette = ['#3f82f2', '#14b47e', '#f6a60f', '#6f66e8', '#f0568f', '#00a7c4']

export function CategoryChart({ points }: { points: CategorySalesPoint[] }) {
  const total = points.reduce((sum, point) => sum + point.revenue, 0)
  const chartPoints = points.length ? points : [{ category: 'No Data', revenue: 1 }]

  return (
    <div className="app-panel p-6">
      <h3 className="mb-4 text-xl font-semibold text-[#1f2b46]">Sales by Category</h3>
      <div className="h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartPoints} dataKey="revenue" nameKey="category" innerRadius={72} outerRadius={106} paddingAngle={3}>
              {chartPoints.map((entry, index) => (
                <Cell key={`${entry.category}-${index}`} fill={palette[index % palette.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 pt-2">
        {points.map((point, index) => {
          const pct = total ? Math.round((point.revenue / total) * 100) : 0
          return (
            <div key={point.category} className="flex items-center justify-between text-[15px]">
              <span className="inline-flex items-center gap-2 text-[#4d5d79]">
                <span className="h-3 w-3 rounded-full" style={{ background: palette[index % palette.length] }} />
                {point.category}
              </span>
              <span className="font-semibold text-[#1f2b46]">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
