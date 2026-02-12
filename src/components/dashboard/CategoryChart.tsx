import { Card } from '@/components/ui/Card'
import type { CategorySalesPoint } from '@/types/report'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#14B8A6', '#64748B']

export function CategoryChart({ points }: { points: CategorySalesPoint[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Category Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={points} dataKey="revenue" nameKey="category" outerRadius={95}>
              {points.map((entry, index) => (
                <Cell key={entry.category} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
