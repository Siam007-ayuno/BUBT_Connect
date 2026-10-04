'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ExtendedPost } from '@/lib/demo-data'

interface AnalyticsChartsProps {
  posts: ExtendedPost[]
}

const CATEGORY_DATA = [
  { name: 'IT & WiFi', count: 18, resolved: 14 },
  { name: 'Library', count: 12, resolved: 9 },
  { name: 'Cafeteria', count: 15, resolved: 8 },
  { name: 'Facilities', count: 10, resolved: 7 },
  { name: 'Academic', count: 14, resolved: 11 },
  { name: 'Exam/Results', count: 8, resolved: 7 },
  { name: 'Transport', count: 6, resolved: 4 },
]

const MONTHLY_TREND = [
  { month: 'Apr', reported: 15, resolved: 11 },
  { month: 'May', reported: 22, resolved: 18 },
  { month: 'Jun', reported: 28, resolved: 23 },
  { month: 'Jul', reported: 19, resolved: 17 },
  { month: 'Aug', reported: 34, resolved: 29 },
  { month: 'Sep', reported: 31, resolved: 26 },
]

const DEPARTMENT_DATA = [
  { name: 'CSE', value: 38, color: '#3b82f6' },
  { name: 'EEE', value: 20, color: '#8b5cf6' },
  { name: 'BBA', value: 18, color: '#10b981' },
  { name: 'Campus Facilities', value: 24, color: '#f59e0b' },
]

const SATISFACTION_DATA = [
  { rating: '5 Stars (Outstanding)', percent: 58, count: 55 },
  { rating: '4 Stars (Very Good)', percent: 26, count: 24 },
  { rating: '3 Stars (Acceptable)', percent: 10, count: 9 },
  { rating: '2 Stars (Below Standard)', percent: 4, count: 4 },
  { rating: '1 Star (Unsatisfactory)', percent: 2, count: 2 },
]

export function AnalyticsCharts({ posts }: AnalyticsChartsProps) {
  return (
    <div className="space-y-6">
      {/* Row 1: Category Volume & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Issues by Category & Resolution</CardTitle>
            <CardDescription className="text-xs">
              Comparison between total reported complaints vs resolved solutions by category.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="Total Reported" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend Area Chart */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Monthly Issue Inflow vs Resolution</CardTitle>
            <CardDescription className="text-xs">
              6-month velocity showing administrative turnaround and capacity.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="reported"
                    name="Reported"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorReported)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorResolved)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Department Distribution & Student Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Volume Pie Chart */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Departmental Breakdown</CardTitle>
            <CardDescription className="text-xs">
              Distribution of student voices across academic faculties & central facilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEPARTMENT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {DEPARTMENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Student Satisfaction Ratings */}
        <Card className="shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Student Satisfaction Breakdown</CardTitle>
            <CardDescription className="text-xs">
              Verified feedback submitted by students following issue resolution.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            {SATISFACTION_DATA.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">{item.rating}</span>
                  <span className="text-muted-foreground font-medium">
                    {item.percent}% ({item.count} votes)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 0
                        ? 'bg-emerald-500'
                        : i === 1
                        ? 'bg-blue-500'
                        : i === 2
                        ? 'bg-amber-500'
                        : 'bg-destructive'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t mt-4 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Overall Campus CSAT: <strong>92.8% positive</strong></span>
              <span>Audit Source: Post-resolution survey prompt</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
