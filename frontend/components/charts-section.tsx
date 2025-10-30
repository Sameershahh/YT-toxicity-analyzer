"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ChartsSectionProps {
  data: any
}

export function ChartsSection({ data }: ChartsSectionProps) {
  // Accept either data.charts or the whole data object
  const charts = data?.charts ? data.charts : data ?? {}
  const sentimentDistribution = charts?.sentimentDistribution ?? []
  const toxicityCategories = charts?.toxicityCategories ?? charts?.toxicityOverTime ?? []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sentiment Distribution Pie Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {sentimentDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill ?? "#8884d8"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1c1c",
                    border: "1px solid #2a2a2a",
                    color: "#eaeaea",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-12">No sentiment data available yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Toxicity Categories Bar Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Toxicity Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {toxicityCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={toxicityCategories} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="name" stroke="#a0a0a0" style={{ fontSize: "12px" }} />
                <YAxis stroke="#a0a0a0" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1c1c",
                    border: "1px solid #2a2a2a",
                    color: "#eaeaea",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="value" fill="#ff0000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-12">No toxicity data available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
