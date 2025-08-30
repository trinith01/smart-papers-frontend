"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingDown,
  BookOpen,
  Target,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Brain,
  Clock,
  GraduationCap,
  Lightbulb,
  Calendar,
  CheckSquare,
} from "lucide-react";
import api from "@/services/api";

// Answer options
const answerOptions = ["1", "2", "3", "4", "5"];

export default function MCQAnalysisPage() {
  const [analysisData, setAnalysisData] = useState(null);
  const [processedQuestions, setProcessedQuestions] = useState([]);
  const [unitSummaries, setUnitSummaries] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Study Plan States
  const [studyPlan, setStudyPlan] = useState(null);
  const [studyPlanLoading, setStudyPlanLoading] = useState(false);
  const [studyPlanError, setStudyPlanError] = useState(null);

  // Use Sinhala unit/category names from backend response
  const [unitNames, setUnitNames] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setLoggedInUser(user);
    }
  }, []);

  useEffect(() => {
    if (loggedInUser && loggedInUser._id) {
      fetchAnalysisData();
    }
    // eslint-disable-next-line
  }, [loggedInUser]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/api/submissions/incorrectSummery/${loggedInUser._id}`
      );
      const data = response.data;

      setAnalysisData(data);

      // Extract all unique unit/category names from all submissions
      const allUnits = new Set();
      data.submissions.forEach((submission) => {
        Object.keys(submission.categories).forEach((unit) => {
          allUnits.add(unit);
        });
      });
      setUnitNames(Array.from(allUnits));

      // Process the data for easier consumption
      const processed = processSubmissions(data.submissions);
      setProcessedQuestions(processed);

      const summaries = generateUnitSummaries(processed, Array.from(allUnits));
      console.log("summaries", summaries);
      setUnitSummaries(summaries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStudyPlan = async () => {
    try {
      setStudyPlanLoading(true);
      setStudyPlanError(null);
      const response = await api.post("/api/llm/getStudyPlan", {
        units: unitSummaries,
      });
      console.log("response", response);
      setStudyPlan(response.data.output);
    } catch (err) {
      setStudyPlanError(
        err instanceof Error ? err.message : "Failed to generate study plan"
      );
      console.error("Study plan error:", err);
    } finally {
      setStudyPlanLoading(false);
    }
  };

  // Process submissions to flat question list
  const processSubmissions = (submissions) => {
    const processed = [];
    submissions.forEach((submission) => {
      Object.entries(submission.categories).forEach(([unit, questions]) => {
        questions.forEach((questionData) => {
          processed.push({
            id: `${submission.submissionId}_${questionData.question._id}`,
            submissionId: submission.submissionId,
            questionId: questionData.question._id,
            paperTitle: questionData.paperTitle,
            unit: unit,
            unitName: unit, // Sinhala name from backend
            questionImage: questionData.question.questionImage,
            answerReviewImage: questionData.question.answerReviewImage,
            selectedAnswer: questionData.selectedAnswer,
            correctAnswer: questionData.question.correctAnswer,
            reviewed: questionData.reviewed,
          });
        });
      });
    });
    return processed;
  };

  // Generate summaries for each unit/category
  const generateUnitSummaries = (questions, allUnits) => {
    const unitMap = new Map();
    allUnits.forEach((unitName) => {
      unitMap.set(unitName, {
        unitNumber: unitName,
        unitName,
        totalIncorrect: 0,
        reviewedCount: 0,
        pendingCount: 0,
      });
    });

    questions.forEach((question) => {
      const unit = unitMap.get(question.unit);
      if (unit) {
        unit.totalIncorrect++;
        if (question.reviewed) {
          unit.reviewedCount++;
        } else {
          unit.pendingCount++;
        }
      }
    });

    return Array.from(unitMap.values()).filter(
      (unit) => unit.totalIncorrect > 0
    );
  };

  const markAsReviewed = async (question) => {
    try {
      await api.post("/student/mark-reviewed", {
        submissionId: question.submissionId,
        questionId: question.questionId,
      });

      setProcessedQuestions((prev) =>
        prev.map((q) => (q.id === question.id ? { ...q, reviewed: true } : q))
      );

      const updatedQuestions = processedQuestions.map((q) =>
        q.id === question.id ? { ...q, reviewed: true } : q
      );
      setUnitSummaries(generateUnitSummaries(updatedQuestions));

      if (analysisData) {
        setAnalysisData({
          ...analysisData,
          reviewed: analysisData.reviewed + 1,
          pendingReview: analysisData.pendingReview - 1,
        });
      }

      setIsReviewDialogOpen(false);
    } catch (error) {
      console.error("Failed to mark as reviewed:", error);
    }
  };

  const getQuestionsForUnit = (unitKey) => {
    return processedQuestions.filter((q) => q.unit === unitKey);
  };

  const handleUnitClick = (unitKey) => {
    setSelectedUnit(unitKey);
  };

  const handleBackToUnits = () => {
    setSelectedUnit(null);
  };

  const handleReviewQuestion = (question) => {
    setSelectedQuestion(question);
    setIsReviewDialogOpen(true);
  };

  const getWorstPerformingUnits = () => {
    console.log("unitSummaries", unitSummaries);
    return unitSummaries
      .sort((a, b) => b.totalIncorrect - a.totalIncorrect)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="container mx-auto p-3 sm:p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sm:p-8 shadow-xl">
                <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin mx-auto text-blue-600" />
                <p className="text-gray-600 mt-4 font-medium text-sm sm:text-base">
                  Loading your MCQ analysis...
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">
                  Analyzing your performance data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="container mx-auto p-3 sm:p-6">
          <Card className="border-red-200/50 bg-red-50/50 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-100/50 rounded-full blur-xl"></div>
                <AlertTriangle className="relative h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4 sm:mb-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-3">
                Error Loading Data
              </h3>
              <p className="text-red-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                {error}
              </p>
              <Button
                onClick={fetchAnalysisData}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return null;
  }

  if (!loggedInUser || !loggedInUser._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex justify-center items-center">
        <div className="text-center space-y-4 p-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sm:p-8 shadow-xl">
              <Brain className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-600 mb-4" />
              <span className="text-base sm:text-lg text-gray-600 font-medium">
                Loading user data...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If a unit is selected, show questions for that unit
  if (selectedUnit !== null) {
    const selectedUnitData = unitSummaries.find(
      (unit) => unit.unitNumber === selectedUnit
    );
    const unitQuestions = getQuestionsForUnit(selectedUnit);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
          {/* Header with Back Button */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              onClick={handleBackToUnits}
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
                              {/* <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 w-fit"
                              >
                                 Question {question.questionId} 
                              </Badge> */}
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
                                  question.questionImage || "/placeholder.svg"
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
                            {/* {question.reviewed && (
                              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg w-fit">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Reviewed
                              </div>
                            )} */}
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
                                onClick={() => handleReviewQuestion(question)}
                                className="bg-white/80 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 w-full sm:w-auto"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                
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
                            selectedQuestion.questionImage || "/placeholder.svg"
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
                            selectedQuestion.answerReviewImage ||
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
                {/* <Button
                  onClick={() =>
                    selectedQuestion && markAsReviewed(selectedQuestion)
                  }
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg w-full sm:w-auto"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Reviewed
                </Button> */}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Main units overview page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-lg w-full">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              MCQ Performance Analysis
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Click on any unit to review incorrect questions
            </p>
          </div>
        </div>

        {/* Overall Statistics */}
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
                {analysisData?.totalIncorrect || 0}
              </div>
              <p className="text-xs text-gray-500">questions to review</p>
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
                {analysisData?.reviewed || 0}
              </div>
              <p className="text-xs text-gray-500">reviewed questions</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Pending
              </CardTitle>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                {analysisData?.pendingReview || 0}
              </div>
              <p className="text-xs text-gray-500">needs attention</p>
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
                {analysisData?.totalIncorrect
                  ? Math.round(
                      (analysisData.reviewed / analysisData.totalIncorrect) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-gray-500">completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Worst Performing Units */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50/50 to-orange-50/50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                Worst Performing Units
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Units with highest incorrect question counts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {getWorstPerformingUnits().map((unit, index) => (
                  <div
                    key={unit.unitNumber}
                    className="space-y-3 p-3 sm:p-4 bg-white/60 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800 break-words">
                        #{index + 1} Unit {unit.unitName}
                      </span>
                      <Badge variant="destructive" className="font-medium">
                        {unit.totalIncorrect}
                      </Badge>
                    </div>
                    <Progress
                      value={(unit.reviewedCount / unit.totalIncorrect) * 100}
                      className="h-3"
                    />
                    <div className="text-xs text-gray-600">
                      {unit.totalIncorrect} incorrect questions • reviewed:{" "}
                      {unit.reviewedCount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Progress */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                </div>
                Review Progress by Unit
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Number of questions you've reviewed per unit
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {unitSummaries.map((unit) => (
                  <div
                    key={unit.unitNumber}
                    className="space-y-3 p-3 sm:p-4 bg-white/60 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800 break-words">
                        Unit {unit.unitName}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {unit.reviewedCount}/{unit.totalIncorrect}
                      </span>
                    </div>
                    <Progress
                      value={(unit.reviewedCount / unit.totalIncorrect) * 100}
                      className="h-3"
                    />
                    <div className="text-xs text-gray-600">
                      {Math.round(
                        (unit.reviewedCount / unit.totalIncorrect) * 100
                      )}
                      % reviewed
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        

        {/* Unit Performance Cards */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              Unit Performance Overview
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Click on any unit to review incorrect questions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {unitSummaries.map((unit) => (
                <Card
                  key={unit.unitNumber}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white/80 backdrop-blur-sm border-gray-200/50 ${
                    unit.totalIncorrect > 0
                      ? "hover:border-red-300"
                      : "hover:border-green-300"
                  }`}
                  onClick={() =>
                    unit.totalIncorrect > 0 && handleUnitClick(unit.unitNumber)
                  }
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center justify-between text-gray-800">
                      <span className="break-words">{unit.unitName}</span>
                      {unit.totalIncorrect > 0 && (
                        <Badge variant="destructive" className="shadow-sm ml-2">
                          {unit.totalIncorrect}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600">
                      {unit.unitNumber}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Incorrect:</span>
                        <span className="font-medium text-red-600">
                          {unit.totalIncorrect}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Reviewed:</span>
                        <span className="font-medium text-green-600">
                          {unit.reviewedCount}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Pending:</span>
                        <span className="font-medium text-yellow-600">
                          {unit.pendingCount}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Progress:</span>
                          <span className="font-medium text-blue-600">
                            {unit.totalIncorrect > 0
                              ? Math.round(
                                  (unit.reviewedCount / unit.totalIncorrect) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            unit.totalIncorrect > 0
                              ? (unit.reviewedCount / unit.totalIncorrect) * 100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                    {unit.totalIncorrect > 0 && (
                      <div className="text-xs text-center text-gray-500 pt-3 border-t border-gray-200/50">
                        Click to review questions
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
