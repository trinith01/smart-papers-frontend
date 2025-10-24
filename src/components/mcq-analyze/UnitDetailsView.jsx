"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Target, Eye } from "lucide-react"
import { getImageUrl } from "@/lib/utils"

const answerOptions = ["1", "2", "3", "4", "5"]

export default function UnitDetailsView({ 
  selectedUnit, 
  selectedUnitData, 
  unitQuestions, 
  onBackToUnits, 
  onReviewQuestion, 
  isReviewDialogOpen, 
  setIsReviewDialogOpen, 
  selectedQuestion 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            onClick={onBackToUnits}
            className="bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-white hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Units
          </Button>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-lg">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent break-words">
              Unit {selectedUnit}: {selectedUnitData?.unitName}
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              {unitQuestions.length} incorrect questions •{" "}
              {selectedUnitData?.reviewedCount} reviewed
            </p>
          </div>
        </div>

        {/* Unit Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Incorrect
              </CardTitle>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {selectedUnitData?.totalIncorrect}
              </div>
              <p className="text-xs text-gray-500">questions in this unit</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Reviewed
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {selectedUnitData?.reviewedCount}
              </div>
              <p className="text-xs text-gray-500">reviewed questions</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Error Rate
              </CardTitle>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                {selectedUnitData?.totalIncorrect
                  ? Math.round(
                      (selectedUnitData.reviewedCount /
                        selectedUnitData.totalIncorrect) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-gray-500">out of total questions</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Review Progress
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {selectedUnitData?.totalIncorrect
                  ? Math.round(
                      (selectedUnitData.reviewedCount /
                        selectedUnitData.totalIncorrect) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-gray-500">completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              Incorrect Questions
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Review each question and mark as studied when completed
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ScrollArea className="h-[500px] sm:h-[600px] pr-2 sm:pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {unitQuestions.map((question) => (
                  <Card
                    key={question._id}
                    className="border-l-4 border-l-red-400 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                            <Badge
                              variant="secondary"
                              className="bg-purple-50 text-purple-700 w-fit"
                            >
                              {question.paperTitle}
                            </Badge>
                          </div>
                          <div className="w-full max-w-[600px] mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200/50 shadow-inner p-4">
                            <img
                              src={
                                getImageUrl(question.questionImage) || "/placeholder.svg"
                              }
                              alt={`ප්‍රශ්න ${question.questionId}`}
                              className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 text-sm">
                            <span className="flex flex-col sm:flex-row sm:items-center bg-red-50 px-3 py-2 rounded-lg">
                              <span className="sm:mr-2">Your Answer:</span>
                              <Badge
                                variant="destructive"
                                className="mt-1 sm:mt-0 w-fit"
                              >
                                {answerOptions[question.selectedAnswer]}
                              </Badge>
                            </span>
                            <span className="flex flex-col sm:flex-row sm:items-center bg-green-50 px-3 py-2 rounded-lg">
                              <span className="sm:mr-2">Correct Answer:</span>
                              <Badge
                                variant="outline"
                                className="mt-1 sm:mt-0 border-green-500 text-green-700 bg-green-50 w-fit"
                              >
                                {answerOptions[question.correctAnswer]}
                              </Badge>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 lg:ml-4">
                          {question.reviewed ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 px-4 py-2"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reviewed
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onReviewQuestion(question)}
                              className="bg-white/80 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 w-full sm:w-auto"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog
          open={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
        >
          <DialogContent className="w-full max-w-5xl max-h-[95vh] overflow-auto bg-white/95 backdrop-blur-xl border-gray-200/50">
            <DialogHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 -m-6 p-4 sm:p-6 rounded-t-xl mb-4 sm:mb-6">
              <DialogTitle className="text-gray-800 text-lg sm:text-xl">
                Question Review
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                {selectedQuestion?.paperTitle} - Question{" "}
                {selectedQuestion?.questionId}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(95vh-150px)] pr-2 sm:pr-4">
              {selectedQuestion && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Question Image */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-800 text-base sm:text-lg">
                      Question:
                    </h3>
                    <div className="w-full h-auto max-h-[60vh] object-contain rounded-lg">
                      <img
                        src={
                          getImageUrl(selectedQuestion.questionImage) || "/placeholder.svg"
                        }
                        alt={`ප්‍රශ්න ${selectedQuestion.questionId}`}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                  {/* Answer Comparison */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-800 text-base sm:text-lg">
                      Answer Comparison:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 sm:p-6 border-2 border-red-200 bg-red-50/80 backdrop-blur-sm rounded-xl">
                        <h4 className="font-medium text-red-700 mb-3 text-sm sm:text-base">
                          Your Answer
                        </h4>
                        <Badge
                          variant="destructive"
                          className="text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3"
                        >
                          {answerOptions[selectedQuestion.selectedAnswer]}
                        </Badge>
                      </div>
                      <div className="p-4 sm:p-6 border-2 border-green-200 bg-green-50/80 backdrop-blur-sm rounded-xl">
                        <h4 className="font-medium text-green-700 mb-3 text-sm sm:text-base">
                          Correct Answer
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 border-green-500 text-green-700 bg-green-50"
                        >
                          {answerOptions[selectedQuestion.correctAnswer]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {/* Solution Method */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-800 text-base sm:text-lg">
                      Solution Method:
                    </h3>
                    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200/50 shadow-inner">
                      <img
                        src={
                          getImageUrl(selectedQuestion.answerReviewImage) ||
                          "/placeholder.svg"
                        }
                        alt={`ප්‍රශ්න ${selectedQuestion.questionId} සඳහා විසඳුම`}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-gray-200/50">
              <Button
                variant="outline"
                onClick={() => setIsReviewDialogOpen(false)}
                className="bg-white/80 hover:bg-gray-50 w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
