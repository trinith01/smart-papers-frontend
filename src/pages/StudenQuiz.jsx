"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, CheckCircle, ImageIcon, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useLocation } from "react-router-dom"
import api from "@/services/api"
import { getImageUrl } from "@/lib/utils"

const answerOptions = ["1", "2", "3", "4", "5"]
const answerLabels = ["1", "2", "3", "4", "5"]

export default function StudentQuizPage() {
  const location = useLocation()
  const [mockQuiz, setMockQuiz] = useState({})
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0) // Start with 0
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const timerRef = useRef(null)
  const [accessAllowed, setAccessAllowed] = useState(false)
  const [accessMessage, setAccessMessage] = useState("")
  const [quizEndTime, setQuizEndTime] = useState(null)
  const [quizStartTime, setQuizStartTime] = useState(null)

  // Helper: unique localStorage key per quiz
  const getLocalStorageKey = (quizId) => `studentAnswers_${quizId}`

  // Set mockQuiz from location.state and check access window
  useEffect(() => {
    if (location.state) {
      const startTime = new Date(location.state.startTime).getTime()
      const endTime = new Date(location.state.endTime).getTime()
      setQuizStartTime(startTime)
      setQuizEndTime(endTime)
      setMockQuiz({
        id: location.state.quizId,
        title: location.state.title,
        subject: location.state.subject,
        totalQuestions: location.state.totalQuestions,
        timeLimit: location.state.timeLimit,
        questions: location.state.questions,
      })

      const now = Date.now()
      if (now < startTime) {
        setAccessAllowed(false)
        setAccessMessage(`The quiz will be available at ${new Date(startTime).toLocaleString()}.`)
      } else if (now > endTime) {
        setAccessAllowed(false)
        setAccessMessage("This quiz has ended.")
      } else {
        setAccessAllowed(true)
        setAccessMessage("")
      }
    }
  }, [location.state])

  // Set timeLeft when mockQuiz.timeLimit or quizEndTime changes
  useEffect(() => {
    if (mockQuiz.timeLimit && quizEndTime) {
      // If quiz already started, use remaining time
      if (isQuizStarted) {
        const now = Date.now()
        const remaining = Math.max(0, Math.floor((quizEndTime - now) / 1000))
        setTimeLeft(remaining)
      } else {
        setTimeLeft(mockQuiz.timeLimit * 60)
      }
    }
  }, [mockQuiz.timeLimit, quizEndTime, isQuizStarted])

  // Load saved answers from localStorage when quiz loads
  useEffect(() => {
    if (mockQuiz.id && mockQuiz.questions && mockQuiz.questions.length > 0) {
      const savedAnswers = localStorage.getItem(getLocalStorageKey(mockQuiz.id))
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers))
      }
    }
  }, [mockQuiz.id, mockQuiz.questions])

  // Cleanup: On unmount, clear saved answers if quiz not completed
  useEffect(() => {
    return () => {
      if (mockQuiz.id && !isQuizCompleted) {
        localStorage.removeItem(getLocalStorageKey(mockQuiz.id))
      }
    }
  }, [mockQuiz.id, isQuizCompleted])

  // Timer effect: start/stop interval
  useEffect(() => {
    if (isQuizStarted && !isQuizCompleted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(timerRef.current)
    } else {
      clearInterval(timerRef.current)
    }
  }, [isQuizStarted, isQuizCompleted])

  // Auto-submit when timeLeft reaches 0
  useEffect(() => {
    if (isQuizStarted && !isQuizCompleted && timeLeft === 0) {
      const unansweredCount = mockQuiz.totalQuestions - getAnsweredCount()
      if (unansweredCount > 0) {
        toast.error(`Time's up! Auto-submitting quiz with ${unansweredCount} unanswered question(s) marked as option 1.`, {
          duration: 5000
        })
      } else {
        toast.info("Time's up! Auto-submitting your quiz.", {
          duration: 3000
        })
      }
      handleSubmitQuiz(true) // Pass true to indicate this is a timeout submission
    }
  }, [isQuizStarted, isQuizCompleted, timeLeft, mockQuiz.totalQuestions, answers])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Save answer to state and localStorage
  const handleAnswerChange = (questionId, answerId) => {
    if (isQuizCompleted) return
    const updatedAnswers = {
      ...answers,
      [questionId]: answerId,
    }
    setAnswers(updatedAnswers)
    if (mockQuiz.id) {
      localStorage.setItem(getLocalStorageKey(mockQuiz.id), JSON.stringify(updatedAnswers))
    }
  }

  // Submit quiz: prevent duplicate submissions, clear localStorage
  const handleSubmitQuiz = async (isTimeOut = false) => {
    if (isQuizCompleted) return // prevent multiple submissions

    const storedUser = localStorage.getItem("userData")
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null

    // For manual submission, check if all questions are answered
    const unansweredCount = mockQuiz.totalQuestions - getAnsweredCount()
    if (!isTimeOut && unansweredCount > 0) {
      toast.error(`Please answer all questions before submitting. You have ${unansweredCount} unanswered question(s).`, {
        duration: 4000
      })
      setShowConfirmDialog(false)
      return // Don't submit if questions are unanswered and it's not a timeout
    }

    setIsQuizCompleted(true)
    setShowConfirmDialog(false)

    // Clear localStorage after submission
    if (mockQuiz.id) {
      localStorage.removeItem(getLocalStorageKey(mockQuiz.id))
    }

    // Map answers - for timeout, use default answer 0 for unanswered questions
    const answersArray = mockQuiz.questions.map((q) => {
      const ans = answers[q._id || q.id] || null
      // For manual submission: use actual answers (all should be answered by now)
      // For timeout: use actual answers or default to index 0 for unanswered
      const answerIndex = ans ? answerOptions.indexOf(ans) : (isTimeOut ? 0 : null)
      return {
        questionId: q._id || q.id,
        answer: answerIndex,
      }
    })

    const submission = {
      paperId: mockQuiz.id,
      studentId: loggedInUser?._id,
      answers: answersArray,
    }

    try {
      const res = await api.post("/api/submissions", submission)
      if (res.status === 200) {
        toast.success("Quiz Submitted: Your answers have been submitted successfully!")
      }
    } catch (err) {
      toast.error("Failed to submit quiz. Please try again.")
    }
  }

  // Update startQuiz to set timer to remaining time
  const startQuiz = () => {
    if (quizEndTime) {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((quizEndTime - now) / 1000))
      if (remaining <= 0) {
        toast.error("Quiz time has expired.")
        return
      }
      setTimeLeft(remaining)
      setIsQuizStarted(true)
      toast.success(`Quiz Started: You have ${Math.floor(remaining / 60)} minutes to complete this quiz.`)
    }
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  // Only allow access if accessAllowed
  if (!accessAllowed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Quiz Unavailable</CardTitle>
              <CardDescription className="text-lg mt-2">{accessMessage}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-2">{mockQuiz.title}</CardTitle>
              <CardDescription className="text-xl text-gray-600">{mockQuiz.subject}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center">
                  <div className="text-4xl font-bold text-blue-700 mb-2">{mockQuiz.totalQuestions}</div>
                  <div className="text-sm font-medium text-blue-600 uppercase tracking-wide">Questions</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-center">
                  <div className="text-4xl font-bold text-green-700 mb-2">{mockQuiz.timeLimit}</div>
                  <div className="text-sm font-medium text-green-600 uppercase tracking-wide">Minutes</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Instructions
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      1
                    </span>
                    Mark your answers by selecting A, B, C, D, or E for each question
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      2
                    </span>
                    You can change your answers anytime before submitting
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      3
                    </span>
                    Make sure to answer all questions before time runs out
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      4
                    </span>
                    Click Submit when you're ready to finish the quiz
                  </li>
                </ul>
              </div>

              <Button
                onClick={startQuiz}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-2">Quiz Completed!</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Your answers have been submitted successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-center">
                  <div className="text-4xl font-bold text-green-700 mb-2">{getAnsweredCount()}</div>
                  <div className="text-sm font-medium text-green-600 uppercase tracking-wide">Questions Answered</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center">
                  <div className="text-4xl font-bold text-blue-700 mb-2">{mockQuiz.totalQuestions}</div>
                  <div className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Questions</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-gray-700 leading-relaxed">
                  Your results will be available shortly. You can view your performance and review answers in your
                  dashboard.
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/my-performance")}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                View Results Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockQuiz.title}</h1>
              <p className="text-gray-600 font-medium">{mockQuiz.subject}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant={timeLeft < 300 ? "destructive" : "outline"}
                className="flex items-center space-x-2 px-3 py-2 text-base font-semibold"
              >
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeLeft)}</span>
              </Badge>
              <Badge variant="secondary" className="px-3 py-2 text-base font-semibold">
                {getAnsweredCount()} / {mockQuiz.totalQuestions} Answered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-2xl font-bold text-gray-900">Answer Sheet</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Select your answer for each question by clicking on the corresponding option
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {mockQuiz.questions?.map((question, index) => {
                const questionNumber = index + 1
                const isAnswered = answers[question._id || question.id]

                return (
                  <div
                    key={question._id || question.id}
                    className={`border-2 rounded-xl p-6 transition-all duration-200 ${
                      isAnswered
                        ? "border-green-200 bg-green-50/50"
                        : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            isAnswered ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {questionNumber}
                        </div>
                        <span className="text-lg font-semibold text-gray-700">Question {questionNumber}</span>
                      </div>
                      {isAnswered && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Answered
                        </Badge>
                      )}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      {/* Question Image */}
                      <div className="flex justify-center">
                        <div className="w-full max-w-md">
                          {question.questionImage ? (
                            <div className="relative group">
                              <img
                                src={getImageUrl(question.questionImage) || "/placeholder.svg"}
                                alt={`Question ${questionNumber}`}
                                className="w-full h-auto max-h-80 object-contain rounded-lg border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200"
                              />
                              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1">
                                <ImageIcon className="w-4 h-4 text-gray-600" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                                <span className="text-sm">No Image Available</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Answer Options */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Select your answer:</h4>
                        <RadioGroup
                          value={answers[question._id || question.id] || ""}
                          onValueChange={(value) => handleAnswerChange(question._id || question.id, value)}
                          className="space-y-3"
                        >
                          {answerOptions.map((option, optionIndex) => {
                            const isSelected = answers[question._id || question.id] === option
                            return (
                              <div
                                key={option}
                                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 shadow-md"
                                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                                }`}
                                onClick={() => handleAnswerChange(question._id || question.id, option)}
                              >
                                <RadioGroupItem
                                  value={option}
                                  id={`${question._id || question.id}-${option}`}
                                  className="w-5 h-5"
                                />
                                <Label
                                  htmlFor={`${question._id || question.id}-${option}`}
                                  className="cursor-pointer flex items-center space-x-3 flex-1"
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                      isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                  >
                                    {answerLabels[optionIndex]}
                                  </div>
                                  <span className="text-lg font-medium">Option {answerLabels[optionIndex]}</span>
                                </Label>
                              </div>
                            )
                          })}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Submit Section */}
            <div className="mt-12 pt-8 border-t-2 border-gray-200">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                  <div className="text-center lg:text-left">
                    <div className="text-lg font-semibold text-gray-800 mb-2">Quiz Progress</div>
                    <div className="space-y-1 text-gray-600">
                      <p className="flex items-center justify-center lg:justify-start">
                        <span className="font-medium">Questions Answered:</span>
                        <span className="ml-2 font-bold text-blue-600">
                          {getAnsweredCount()} / {mockQuiz.totalQuestions}
                        </span>
                      </p>
                      <p className="flex items-center justify-center lg:justify-start">
                        <span className="font-medium">Time Remaining:</span>
                        <span className={`ml-2 font-bold ${timeLeft < 300 ? "text-red-600" : "text-green-600"}`}>
                          {formatTime(timeLeft)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowConfirmDialog(true)}
                    size="lg"
                    className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500"
                    disabled={getAnsweredCount() < mockQuiz.totalQuestions}
                  >
                    {getAnsweredCount() < mockQuiz.totalQuestions
                      ? `Answer ${mockQuiz.totalQuestions - getAnsweredCount()} More Questions`
                      : "Submit Quiz"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Submit Quiz?</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Are you sure you want to submit your quiz? You have answered{" "}
              <span className="font-semibold text-blue-600">{getAnsweredCount()}</span> out of{" "}
              <span className="font-semibold">{mockQuiz.totalQuestions}</span> questions.
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    All questions have been answered. Ready to submit!
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="px-6">
              Continue Quiz
            </Button>
            <Button
              onClick={() => handleSubmitQuiz(false)}
              className="px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Submit Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
