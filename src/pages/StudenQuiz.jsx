"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useLocation } from "react-router-dom"
import api from "@/services/api"
import axios from "axios"



// // Mock quiz data
// const mockQuiz = {
//   id: "quiz-1",
//   title: "Mathematics - Basic Quiz",
//   subject: "Mathematics",
//   totalQuestions: 4,
//   timeLimit: 60,
//   questions: Array.from({ length: 4 }, (_, i) => ({
//     id: `q${i + 1}`,
//     questionNumber: i + 1,
//   })),
// }

const answerOptions = ["1", "2", "3", "4", "5"]

export default function StudentQuizPage() {
  const location = useLocation()
  const [mockQuiz, setMockQuiz] = useState({})
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0) // Start with 0
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  

  // Set mockQuiz from location.state
  useEffect(() => {
    if (location.state) {
      console.log("Quiz data from state:", location.state)
      setMockQuiz({id: location.state.quizId, title: location.state.title, subject: location.state.subject, totalQuestions: location.state.totalQuestions, timeLimit: location.state.timeLimit, questions: location.state.questions })
      //quizId: quiz._id, title: quiz.title ,questions: quiz.questions, timeLimit:quiz.startTime-quiz.endTime,totalQuestions:quiz.questions.length
    }
  }, [location.state])

  // Set timeLeft when mockQuiz.timeLimit changes
  useEffect(() => {
    if (mockQuiz.timeLimit) {
      setTimeLeft(mockQuiz.timeLimit * 60)
    }
  }, [mockQuiz.timeLimit])

  // Timer effect
  useEffect(() => {
    if (isQuizStarted && !isQuizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isQuizStarted, isQuizCompleted, timeLeft])

  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId, answerId) => {
    if (isQuizCompleted) return; // Prevent marking after submission
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }))
  }

  const handleSubmitQuiz = async () => {
    const storedUser = localStorage.getItem("userData");
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
    setIsQuizCompleted(true)
    setShowConfirmDialog(false)
    // Convert answers object to array of { questionId, answerIndex }
    const answersArray = mockQuiz.questions.map((q) => {
      const ans = answers[q._id || q.id] || null;
      // Convert answer letter to index (A=0, B=1, ...)
      const answerIndex = ans ? answerOptions.indexOf(ans) : null;
      return {
        questionId: q._id || q.id,
        answer: answerIndex
      };
    });
    const submission = { paperId: mockQuiz.id, studentId:loggedInUser._id, answers: answersArray };
    const res = await api.post("/api/submissions", submission);
    if (res.status === 200) {
      toast.success("Quiz Submitted: Your answers have been submitted successfully!")
    }
    

  }

  const startQuiz = () => {
    setIsQuizStarted(true)
    toast.success(`Quiz Started: You have ${mockQuiz.timeLimit} minutes to complete this quiz.`)
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  if (!isQuizStarted) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{mockQuiz.title}</CardTitle>
              <CardDescription>{mockQuiz.subject}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockQuiz.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockQuiz.timeLimit}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Instructions:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Mark your answers by selecting A, B, C, D, or E for each question</li>
                  <li>• You can change your answers anytime before submitting</li>
                  <li>• Make sure to answer all questions before time runs out</li>
                  <li>• Click Submit when you're ready to finish the quiz</li>
                </ul>
              </div>

              <Button onClick={startQuiz} className="w-full" size="lg">
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isQuizCompleted) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              <CardDescription>Your answers have been submitted successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{getAnsweredCount()}</div>
                  <div className="text-sm text-muted-foreground">Questions Answered</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{mockQuiz.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                Your results will be available shortly. You can view your performance and review answers in your
                dashboard.
              </p>
              <Button onClick={() => (window.location.href = "/my-performance")} className="w-full">
                View Results Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Group questions into rows of 5 for better layout
  const questionRows = []
  for (let i = 0; i < mockQuiz.questions.length; i += 5) {
    questionRows.push(mockQuiz.questions.slice(i, i + 5))
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{mockQuiz.title}</h1>
            <p className="text-muted-foreground">{mockQuiz.subject}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </Badge>
            <Badge variant="secondary">
              Answered: {getAnsweredCount()} / {mockQuiz.totalQuestions}
            </Badge>
          </div>
        </div>
      </div>

      {/* Answer Sheet */}
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Answer Sheet</CardTitle>
          <CardDescription className="text-center">
            Mark your answers by selecting A, B, C, D, or E for each question
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questionRows.map((row, rowIndex) => (
              <div key={rowIndex} className="space-y-4">
                {row.map((question, index) => (
                  <div
                    key={question._id || question.id}
                    className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="w-12 text-center">
                      <Label className="font-semibold text-base">Q{index + 1}</Label>
                    </div>
                    <RadioGroup
                      value={answers[question._id || question.id] || ""}
                      onValueChange={(value) => handleAnswerChange(question._id || question.id, value)}
                      className="flex space-x-6"
                    >
                      {answerOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question._id || question.id}-${option}`} />
                          <Label htmlFor={`${question._id || question.id}-${option}`} className="cursor-pointer font-medium text-base">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {answers[question._id || question.id] && (
                      <div className="ml-auto">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          ✓
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <p>
                  Questions Answered: {getAnsweredCount()} / {mockQuiz.totalQuestions}
                </p>
                <p>Time Remaining: {formatTime(timeLeft)}</p>
              </div>
              <Button onClick={() => setShowConfirmDialog(true)} size="lg" className="px-8">
                Submit Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your quiz? You have answered {getAnsweredCount()} out of{" "}
              {mockQuiz.totalQuestions} questions.
              {getAnsweredCount() < mockQuiz.totalQuestions && (
                <span className="block mt-2 text-amber-600 font-medium">
                  Warning: You have {mockQuiz.totalQuestions - getAnsweredCount()} unanswered questions.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Continue Quiz
            </Button>
            <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
