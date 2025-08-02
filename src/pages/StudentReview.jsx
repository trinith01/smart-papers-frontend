"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Eye, ArrowLeft, Clock, Target } from "lucide-react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

export default function StudentReviewPage({ params }) {
  const location = useLocation()
  const review = location.state?.result
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  if (!review) return <div>No review data found.</div>

  // Prepare correct and incorrect questions
  const correctQuestions = review.answers.filter((a) => a.isCorrect)
  const incorrectQuestions = review.answers.filter((a) => !a.isCorrect)

  // Helper for answer label (A, B, C, D, E)
  const getAnswerLabel = (idx) => String.fromCharCode(65 + idx)

  // Score color
  const getScoreColor = (score, total) => {
    const percent = (score / total) * 100
    if (percent >= 90) return "text-green-600"
    if (percent >= 80) return "text-blue-600"
    if (percent >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  // Handle review click
  const handleReviewClick = (answer) => {
    setSelectedQuestion(answer)
    setIsReviewDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Link to="/my-performance">
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
          </Link>
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">{review.paperTitle}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Quiz Review</p>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Final Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(review.score, review.answers.length)}`}>
              {review.score}/{review.answers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((review.score / review.answers.length) * 100).toFixed(1)}% correct
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

      {/* Correct Answers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 text-lg sm:text-xl">
            <CheckCircle className="h-5 w-5" />
            Correct Answers ({correctQuestions.length})
          </CardTitle>
          <CardDescription className="text-sm">Questions you answered correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {correctQuestions.map((answer, idx) => (
              <Card key={answer._id} className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Question {idx + 1}
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={answer.question.questionImage || "/placeholder.svg"}
                      alt={`Question ${idx + 1}`}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                      Your Answer: {getAnswerLabel(answer.selectedAnswer)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReviewClick(answer)}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Incorrect Answers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 text-lg sm:text-xl">
            <XCircle className="h-5 w-5" />
            Incorrect Answers ({incorrectQuestions.length})
          </CardTitle>
          <CardDescription className="text-sm">
            Questions that need review - click Review to see the solution method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {incorrectQuestions.map((answer, idx) => (
              <Card key={answer._id} className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Question {idx + 1}
                    <XCircle className="h-4 w-4 text-red-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={answer.question.questionImage || "/placeholder.svg"}
                      alt={`Question ${idx + 1}`}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
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
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleReviewClick(answer)} className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Solution
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Question Review</DialogTitle>
            <DialogDescription className="text-sm">
              {selectedQuestion?.isCorrect ? "Correct Answer" : "Solution Method"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] sm:h-[70vh] pr-2 sm:pr-4">
            {selectedQuestion && (
              <div className="space-y-4 sm:space-y-6">
                {/* Question */}
                <div>
                  <h3 className="font-semibold mb-3 text-base sm:text-lg">Question:</h3>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={selectedQuestion.question.questionImage || "/placeholder.svg"}
                      alt={`Question`}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                </div>
                <Separator />
                {/* Solution Method */}
                <div>
                  <h3 className="font-semibold mb-3 text-base sm:text-lg">Solution Method:</h3>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={selectedQuestion.question.answerReviewImage || "/placeholder.svg"}
                      alt={`Solution for Question`}
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
