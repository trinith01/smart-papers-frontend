"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, BarChart3 } from "lucide-react"

export default function PerformanceGraphs({ unitSummaries }) {
  const getWorstPerformingUnits = () => {
    return unitSummaries
      .sort((a, b) => b.totalIncorrect - a.totalIncorrect)
      .slice(0, 5)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Worst Performing Units */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-50/50 to-orange-50/50 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            Worst Performing Units
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Units with highest incorrect question counts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {getWorstPerformingUnits().map((unit, index) => (
              <div
                key={unit.unitNumber}
                className="space-y-3 p-3 sm:p-4 bg-white/60 rounded-xl border border-gray-200/50"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 break-words">
                    #{index + 1} Unit {unit.unitName}
                  </span>
                  <Badge variant="destructive" className="font-medium">
                    {unit.totalIncorrect}
                  </Badge>
                </div>
                <Progress
                  value={(unit.reviewedCount / unit.totalIncorrect) * 100}
                  className="h-3"
                />
                <div className="text-xs text-gray-600">
                  {unit.totalIncorrect} incorrect questions • reviewed:{" "}
                  {unit.reviewedCount}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Progress */}
      
    </div>
  )
}
