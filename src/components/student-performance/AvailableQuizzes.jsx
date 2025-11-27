"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { Calendar, BookOpen, Clock, Star, AlertCircle } from "lucide-react"

export default function AvailableQuizzes({ 
  availableQuizzes, 
  donePapers, 
  selectedCategory, 
  preferredTeacher, 
  loading 
}) {
  // Get logged-in user's institute ID from their first followed teacher
  const getLoggedUserInstituteId = () => {
    const storedUser = localStorage.getItem("userData")
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null
    return loggedInUser?.followedTeachers?.[0]?.institute?._id || loggedInUser?.followedTeachers?.[0]?.institute
  }

  // Find availability for the logged-in user's institute
  const getAvailabilityForUserInstitute = (quiz) => {
    const userInstituteId = getLoggedUserInstituteId()
    if (!userInstituteId || !quiz.availability) return null
    
    return quiz.availability.find(avail => 
      avail.institute === userInstituteId || avail.institute?._id === userInstituteId
    )
  }
  // Categorize quizzes based on their availability
  const categorizeQuizzes = () => {
    const now = new Date()
    const current = []
    const future = []
    
    availableQuizzes.forEach(quiz => {
      const userAvailability = getAvailabilityForUserInstitute(quiz)
      if (userAvailability) {
        const start = new Date(userAvailability.startTime)
        const end = new Date(userAvailability.endTime)
        
        if (now >= start && now <= end) {
          current.push(quiz)
        } else if (now < start) {
          future.push(quiz)
        }
      }
    })
    
    return { current, future }
  }

  const getQuizStatus = (quiz) => {
    const now = new Date()
    const isDone = donePapers.includes(quiz._id)
    
    if (isDone) {
      return { 
        disabled: true, 
        label: "✓ Completed", 
        variant: "completed",
        canStart: false 
      }
    }
    
    const userAvailability = getAvailabilityForUserInstitute(quiz)
    if (userAvailability) {
      const start = new Date(userAvailability.startTime)
      const end = new Date(userAvailability.endTime)
      
      if (now < start) {
        return { 
          disabled: true, 
          label: "Quiz Not Started", 
          variant: "pending",
          canStart: false 
        }
      } else if (now > end) {
        return { 
          disabled: true, 
          label: "Quiz Ended", 
          variant: "ended",
          canStart: false 
        }
      } else {
        return { 
          disabled: false, 
          label: "Start Quiz", 
          variant: "available",
          canStart: true 
        }
      }
    }
    
    return { 
      disabled: false, 
      label: "Start Quiz", 
      variant: "available",
      canStart: true 
    }
  }

  if (!selectedCategory) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-t-xl">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-800 text-lg sm:text-xl">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              Available Quizzes
            </div>
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Select a category to view available quizzes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-xl"></div>
              <BookOpen className="relative h-12 w-12 sm:h-16 sm:w-16 mx-auto text-blue-400" />
            </div>
            <p className="text-base sm:text-lg font-medium mb-2 text-gray-700">No Selection Made</p>
            <p className="text-gray-600 text-sm sm:text-base">
              Please select a category above to view available quizzes
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-t-xl">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-800 text-lg sm:text-xl">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              Available Quizzes
            </div>
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            {selectedCategory
              ? `Quizzes available for ${preferredTeacher?.teacher?.name} - ${selectedCategory}`
              : "Select a category to view available quizzes"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12">
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-xl"></div>
              <div className="relative animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            </div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Loading available quizzes...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (availableQuizzes.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-t-xl">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-800 text-lg sm:text-xl">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              Available Quizzes
            </div>
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            {selectedCategory
              ? `Quizzes available for ${preferredTeacher?.teacher?.name} - ${selectedCategory}`
              : "Select a category to view available quizzes"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gray-100/50 rounded-full blur-xl"></div>
              <Calendar className="relative h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" />
            </div>
            <p className="text-base sm:text-lg font-medium mb-2 text-gray-700">No Quizzes Available</p>
            <p className="text-gray-600 text-sm sm:text-base">
              There are no quizzes available for this teacher and category combination
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { current, future } = categorizeQuizzes()

  const renderQuizCard = (quiz) => {
    const status = getQuizStatus(quiz)
    
    return (
      <Card
        key={quiz._id}
        className={`transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200/50 ${
          status.disabled
            ? "opacity-75"
            : "hover:shadow-lg hover:scale-105 cursor-pointer"
        }`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg text-gray-800 flex items-start gap-2">
            <div className="p-1 bg-blue-100 rounded flex-shrink-0 mt-1">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <span className="break-words">{quiz.title}</span>
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm break-words">{quiz.subject}</CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
              {quiz.category}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {quiz.year}
            </Badge>
            {status.variant === "completed" && (
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                Completed
              </Badge>
            )}
            {quiz.is_paid && (
              <Badge variant="default" className="bg-yellow-600 text-white text-xs">
                Paid
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm bg-gray-50/80 p-3 rounded-lg">
            <span className="text-gray-600">Questions:</span>
            <span className="font-medium text-gray-800">{quiz.questions.length}</span>
          </div>
          {quiz.availability && quiz.availability.length > 0 && (
            <div className={`text-xs p-3 rounded-lg border ${
              status.variant === "available" 
                ? "bg-green-50/80 border-green-200/50 text-green-700" 
                : status.variant === "pending"
                ? "bg-yellow-50/80 border-yellow-200/50 text-yellow-700"
                : "bg-red-50/80 border-red-200/50 text-red-700"
            }`}>
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="font-medium">
                  {status.variant === "available" ? "Available until:" : 
                   status.variant === "pending" ? "Starts at:" : "Ended at:"}
                </span>
              </div>
              <p className="break-words">
                {(() => {
                  const userAvailability = getAvailabilityForUserInstitute(quiz)
                  if (!userAvailability) return "Time not available"
                  
                  return status.variant === "pending" 
                    ? new Date(userAvailability.startTime).toLocaleString()
                    : new Date(userAvailability.endTime).toLocaleString()
                })()}
              </p>
            </div>
          )}
          <Button
            className={`w-full mt-4 transition-all duration-300 text-sm ${
              status.canStart
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                : status.variant === "completed"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-200 text-gray-500"
            }`}
            disabled={status.disabled}
            asChild={status.canStart}
          >
            {status.canStart ? (
              <Link
                to="/student-quiz"
                state={{
                  quizId: quiz._id,
                  title: quiz.title,
                  questions: quiz.questions,
                  timeLimit: (() => {
                    const userAvailability = getAvailabilityForUserInstitute(quiz)
                    return userAvailability 
                      ? Math.round((new Date(userAvailability.endTime) - new Date(userAvailability.startTime)) / 60000)
                      : 60
                  })(),
                  totalQuestions: quiz.questions.length,
                  subject: quiz.subject,
                  startTime: (() => {
                    const userAvailability = getAvailabilityForUserInstitute(quiz)
                    return userAvailability?.startTime
                  })(),
                  endTime: (() => {
                    const userAvailability = getAvailabilityForUserInstitute(quiz)
                    return userAvailability?.endTime
                  })(),
                }}
              >
                <Star className="h-4 w-4 mr-2" />
                {status.label}
              </Link>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {status.variant === "completed" && <Star className="h-4 w-4" />}
                {status.variant === "pending" && <AlertCircle className="h-4 w-4" />}
                {status.variant === "ended" && <Clock className="h-4 w-4" />}
                {status.label}
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-t-xl">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-800 text-lg sm:text-xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            Available Quizzes
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit">
            {availableQuizzes.length} total
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          {selectedCategory
            ? `Quizzes available for ${preferredTeacher?.teacher?.name} - ${selectedCategory}`
            : "Select a category to view available quizzes"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Current Quizzes Section */}
        {current.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-green-100 rounded">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Current Quizzes</h3>
              <Badge className="bg-green-100 text-green-700">{current.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {current.map(renderQuizCard)}
            </div>
          </div>
        )}

        {/* Future Quizzes Section */}
        {future.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-blue-100 rounded">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Quizzes</h3>
              <Badge className="bg-blue-100 text-blue-700">{future.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {future.map(renderQuizCard)}
            </div>
          </div>
        )}

        {/* No quizzes available message */}
        {current.length === 0 && future.length === 0 && availableQuizzes.length > 0 && (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gray-100/50 rounded-full blur-xl"></div>
              <AlertCircle className="relative h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" />
            </div>
            <p className="text-base sm:text-lg font-medium mb-2 text-gray-700">All Quizzes Ended</p>
            <p className="text-gray-600 text-sm sm:text-base">
              All available quizzes for this category have ended
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
