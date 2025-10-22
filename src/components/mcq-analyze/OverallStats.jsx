"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Target } from "lucide-react"

export default function OverallStats({ analysisData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Total Incorrect
          </CardTitle>
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-red-600">
            {analysisData?.totalIncorrect || 0}
          </div>
          <p className="text-xs text-gray-500">questions to review</p>
        </CardContent>
      </Card>
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Reviewed
          </CardTitle>
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {analysisData?.reviewed || 0}
          </div>
          <p className="text-xs text-gray-500">reviewed questions</p>
        </CardContent>
      </Card>
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Pending
          </CardTitle>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Clock className="h-4 w-4 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">
            {analysisData?.pendingReview || 0}
          </div>
          <p className="text-xs text-gray-500">needs attention</p>
        </CardContent>
      </Card>
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Review Progress
          </CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {analysisData?.totalIncorrect
              ? Math.round(
                  (analysisData.reviewed / analysisData.totalIncorrect) * 100
                )
              : 0}
            %
          </div>
          <p className="text-xs text-gray-500">completion rate</p>
        </CardContent>
      </Card>
    </div>
  )
}
