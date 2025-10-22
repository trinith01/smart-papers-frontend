"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Target } from "lucide-react"

export default function PerformanceSummary({ review }) {
  const getScoreColor = (score, total) => {
    const percent = (score / total) * 100
    if (percent >= 90) return "text-green-600"
    if (percent >= 80) return "text-blue-600"
    if (percent >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Final Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(review.score, review.answers.length)}`}>
            {review.score}%
          </div>
          <p className="text-xs text-muted-foreground">
            {`${Math.round((review.score / 100) * review.answers.length)} is correct out of ${review.answers.length}`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold capitalize">{review.status}</div>
          <p className="text-xs text-muted-foreground">Quiz status</p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Date</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{new Date(review.submittedAt).toLocaleDateString()}</div>
          <p className="text-xs text-muted-foreground">Submitted</p>
        </CardContent>
      </Card>
    </div>
  )
}
