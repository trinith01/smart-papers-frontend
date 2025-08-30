"use client"

import { Badge } from "@/components/ui/badge"

export function QuestionCard({ question, index }) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
            ID: {question._id ? question._id.slice(-2) : `Q${index + 1}`}
          </span>
          <Badge
            variant={
              question.difficulty === "easy"
                ? "default"
                : question.difficulty === "medium"
                  ? "secondary"
                  : "destructive"
            }
            className="text-xs"
          >
            {question.difficulty}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Question:</p>
          <div className="bg-white rounded border p-2">
            <img
              src={question.questionImage || "/placeholder.svg"}
              alt="Question"
              className="w-full h-24 object-contain rounded"
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-1">Answer:</p>
          <div className="bg-white rounded border p-2">
            <img
              src={question.answerImage || "/placeholder.svg"}
              alt="Answer"
              className="w-full h-24 object-contain rounded"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{question.category}</span>
          <span>{question.subunitName}</span>
        </div>
      </div>
    </div>
  )
}
