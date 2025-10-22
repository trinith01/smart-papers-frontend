"use client";

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import api from "@/services/api";
import LoadingState from "@/components/mcq-analyze/LoadingState";
import ErrorState from "@/components/mcq-analyze/ErrorState";
import MainHeader from "@/components/mcq-analyze/MainHeader";
import OverallStats from "@/components/mcq-analyze/OverallStats";
import PerformanceGraphs from "@/components/mcq-analyze/PerformanceGraphs";
import UnitPerformanceCards from "@/components/mcq-analyze/UnitPerformanceCards";
import UnitDetailsView from "@/components/mcq-analyze/UnitDetailsView";

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
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchAnalysisData} />;
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
      <UnitDetailsView
        selectedUnit={selectedUnit}
        selectedUnitData={selectedUnitData}
        unitQuestions={unitQuestions}
        onBackToUnits={handleBackToUnits}
        onReviewQuestion={handleReviewQuestion}
        isReviewDialogOpen={isReviewDialogOpen}
        setIsReviewDialogOpen={setIsReviewDialogOpen}
        selectedQuestion={selectedQuestion}
      />
    );
  }

  // Main units overview page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
        <MainHeader />
        {/* <OverallStats analysisData={analysisData} /> */}
        <PerformanceGraphs unitSummaries={unitSummaries} />
        <UnitPerformanceCards 
          unitSummaries={unitSummaries} 
          onUnitClick={handleUnitClick} 
        />
      </div>
    </div>
  );
}
