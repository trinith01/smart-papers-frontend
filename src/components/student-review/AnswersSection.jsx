"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import AnswerCard from "./AnswerCard"

export default function AnswersSection({ 
  answers, 
  isCorrect, 
  onReviewClick 
}) {
  const title = isCorrect ? "Correct Answers" : "Incorrect Answers"
  const count = answers.length
  const icon = isCorrect ? CheckCircle : XCircle
  const titleColor = isCorrect ? "text-green-600" : "text-red-600"
  const description = isCorrect 
    ? "Questions you answered correctly" 
    : "Questions that need review - click Review to see the solution method"

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${titleColor} text-lg sm:text-xl`}>
          <icon className="h-5 w-5" />
          {title} ({count})
        </CardTitle>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {answers.map((answer, idx) => (
            <AnswerCard
              key={answer._id}
              answer={answer}
              index={idx}
              isCorrect={isCorrect}
              onReviewClick={onReviewClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
