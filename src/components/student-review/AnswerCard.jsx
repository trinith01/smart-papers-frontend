"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Eye } from "lucide-react"

export default function AnswerCard({ 
  answer, 
  index, 
  isCorrect, 
  onReviewClick 
}) {
  const getAnswerLabel = (idx) => String.fromCharCode(65 + idx)

  return (
    <Card className={isCorrect ? "border-green-200" : "border-red-200"}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          Question {index + 1}
          {isCorrect ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <img
            src={answer.question.questionImage || "/placeholder.svg"}
            alt={`Question ${index + 1}`}
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
        
        {isCorrect ? (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
              Your Answer: {getAnswerLabel(answer.selectedAnswer)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReviewClick(answer)}
              className="w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 mr-1" />
              Review
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
              <span className="text-sm text-muted-foreground">Your Answer:</span>
              <Badge variant="destructive" className="text-xs">
                {getAnswerLabel(answer.selectedAnswer)}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
              <span className="text-sm text-muted-foreground">Correct Answer:</span>
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                {getAnswerLabel(answer.question.correctAnswer)}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => onReviewClick(answer)} className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Review Solution
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
