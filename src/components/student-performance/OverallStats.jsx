"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Target, Trophy, Users } from "lucide-react"

export default function OverallStats({ stats, followedTeachersCount }) {
  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Total Quizzes</CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalQuizzes}</div>
          <p className="text-xs text-gray-500">Completed assessments</p>
        </CardContent>
      </Card>
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Average Score</CardTitle>
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
            {stats.averageScore.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-500">Overall performance</p>
        </CardContent>
      </Card>
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Best Score</CardTitle>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Trophy className="h-4 w-4 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(stats.bestScore)}`}>
            {stats.bestScore}%
          </div>
          <p className="text-xs text-gray-500">Highest achievement</p>
        </CardContent>
      </Card>
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Followed Teachers</CardTitle>
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-purple-600">{followedTeachersCount}</div>
          <p className="text-xs text-gray-500">Active connections</p>
        </CardContent>
      </Card>
    </div>
  )
}
