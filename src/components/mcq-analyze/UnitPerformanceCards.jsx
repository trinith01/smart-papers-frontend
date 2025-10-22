"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"

export default function UnitPerformanceCards({ unitSummaries, onUnitClick }) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
          <div className="p-2 bg-green-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-green-600" />
          </div>
          Unit Performance Overview
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          Click on any unit to review incorrect questions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {unitSummaries.map((unit) => (
            <Card
              key={unit.unitNumber}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white/80 backdrop-blur-sm border-gray-200/50 ${
                unit.totalIncorrect > 0
                  ? "hover:border-red-300"
                  : "hover:border-green-300"
              }`}
              onClick={() =>
                unit.totalIncorrect > 0 && onUnitClick(unit.unitNumber)
              }
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center justify-between text-gray-800">
                  <span className="break-words">{unit.unitName}</span>
                  {unit.totalIncorrect > 0 && (
                    <Badge variant="destructive" className="shadow-sm ml-2">
                      {unit.totalIncorrect}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600">
                  {unit.unitNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Incorrect:</span>
                    <span className="font-medium text-red-600">
                      {unit.totalIncorrect}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Reviewed:</span>
                    <span className="font-medium text-green-600">
                      {unit.reviewedCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-medium text-yellow-600">
                      {unit.pendingCount}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-medium text-blue-600">
                        {unit.totalIncorrect > 0
                          ? Math.round(
                              (unit.reviewedCount / unit.totalIncorrect) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        unit.totalIncorrect > 0
                          ? (unit.reviewedCount / unit.totalIncorrect) * 100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>
                {unit.totalIncorrect > 0 && (
                  <div className="text-xs text-center text-gray-500 pt-3 border-t border-gray-200/50">
                    Click to review questions
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
