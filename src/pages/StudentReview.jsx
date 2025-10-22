"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom"
import PageHeader from "@/components/student-review/PageHeader"
import PerformanceSummary from "@/components/student-review/PerformanceSummary"
import AnswersSection from "@/components/student-review/AnswersSection"
import ReviewDialog from "@/components/student-review/ReviewDialog"

export default function StudentReviewPage({ params }) {
  const location = useLocation()
  const review = location.state?.result
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  if (!review) return <div>No review data found.</div>

  // Prepare correct and incorrect questions
  const correctQuestions = review.answers.filter((a) => a.isCorrect)
  const incorrectQuestions = review.answers.filter((a) => !a.isCorrect)

  // Handle review click
  const handleReviewClick = (answer) => {
    setSelectedQuestion(answer)
    setIsReviewDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
      <PageHeader paperTitle={review.paperTitle} />
      
      <PerformanceSummary review={review} />
      
      <AnswersSection 
        answers={correctQuestions} 
        isCorrect={true} 
        onReviewClick={handleReviewClick} 
      />
      
      <AnswersSection 
        answers={incorrectQuestions} 
        isCorrect={false} 
        onReviewClick={handleReviewClick} 
      />
      
      <ReviewDialog 
        isOpen={isReviewDialogOpen} 
        onOpenChange={setIsReviewDialogOpen} 
        selectedQuestion={selectedQuestion} 
      />
    </div>
  )
}
