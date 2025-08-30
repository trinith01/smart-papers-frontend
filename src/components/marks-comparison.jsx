"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"





export default function MarksComparisonChart({ data}) {

  // Transform data for the chart
  
  const chartData = data.map((item) => ({
    paperName: item.paperTitle || "Untitled",
    date: item.paperDate ? new Date(item.paperDate).toLocaleDateString() : "N/A",
    "Class Average": item.averageMarks,
    "Your Score": item.studentMarks,
    difference: item.studentMarks - item.averageMarks,
  }))

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Academic Performance Comparison</CardTitle>
        <CardDescription>Your marks vs class average across different papers</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            "Class Average": {
              label: "Class Average",
              color: "#3b82f6",
            },
            "Your Score": {
              label: "Your Score",
              color: "#10b981",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="paperName" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis domain={[0, 100]} label={{ value: "Marks", angle: -90, position: "insideLeft" }} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{label}</p>
                        <p className="text-sm text-muted-foreground mb-2">Date: {data.date}</p>
                        <div className="space-y-1">
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.name}: {entry.value}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm mt-2 font-medium">
                          Difference: {data.difference > 0 ? "+" : ""}
                          {data.difference} points
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Bar dataKey="Class Average" fill="#3b82f6" />
              <Bar dataKey="Your Score" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Overall Average</h3>
            <p className="text-2xl font-bold">
              {Math.round(chartData.reduce((sum, item) => sum + item["Your Score"], 0) / chartData.length)}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Best Performance</h3>
            <p className="text-2xl font-bold text-green-600">
              {Math.max(...chartData.map((item) => item["Your Score"]))}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Above Average</h3>
            <p className="text-2xl font-bold">
              {chartData.filter((item) => item.difference > 0).length}/{chartData.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
