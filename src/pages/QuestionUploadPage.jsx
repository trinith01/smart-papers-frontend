"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  HelpCircle,
  ImageIcon,
  BookOpen,
  Layers,
  BarChart3,
  ArrowRight,
  FileImage,
} from "lucide-react";
import api from "@/services/api";

export default function QuestionUploadPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    questionImage: "",
    answerImage: "",
    category: "",
    difficulty: "",
    unitName: "",
    subunitName: "",
  });

  const [questionImageFile, setQuestionImageFile] = useState(null);
  const [answerImageFile, setAnswerImageFile] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState("");
  const [answerImagePreview, setAnswerImagePreview] = useState("");

  const [questionSets, setQuestionSets] = useState([
    {
      _id: "1",
      author: "Sujith Liyanage",
      questions: [
        {
          _id: "q1",
          questionImage:
            "/placeholder.svg?height=200&width=400&text=Physics+Question+1",
          answerImage:
            "/placeholder.svg?height=200&width=400&text=Physics+Answer+1",
          category: "Physics",
          difficulty: "easy",
          unitName: "Mechanics",
          subunitName: "Newton's Laws",
        },
        {
          _id: "q2",
          questionImage:
            "/placeholder.svg?height=200&width=400&text=Physics+Question+2",
          answerImage:
            "/placeholder.svg?height=200&width=400&text=Physics+Answer+2",
          category: "Physics",
          difficulty: "medium",
          unitName: "Mechanics",
          subunitName: "Forces",
        },
        {
          _id: "q3",
          questionImage:
            "/placeholder.svg?height=200&width=400&text=Physics+Question+3",
          answerImage:
            "/placeholder.svg?height=200&width=400&text=Physics+Answer+3",
          category: "Physics",
          difficulty: "hard",
          unitName: "Mechanics",
          subunitName: "Energy",
        },
        {
          _id: "q4",
          questionImage:
            "/placeholder.svg?height=200&width=400&text=Math+Question+1",
          answerImage:
            "/placeholder.svg?height=200&width=400&text=Math+Answer+1",
          category: "Mathematics",
          difficulty: "easy",
          unitName: "Calculus",
          subunitName: "Derivatives",
        },
        {
          _id: "q5",
          questionImage:
            "/placeholder.svg?height=200&width=400&text=Math+Question+2",
          answerImage:
            "/placeholder.svg?height=200&width=400&text=Math+Answer+2",
          category: "Mathematics",
          difficulty: "medium",
          unitName: "Calculus",
          subunitName: "Integrals",
        },
        {
          _id: "q6",
          questionImage:
            "/placeholder.svg?height=200&width=400&text=Chemistry+Question+1",
          answerImage:
            "/placeholder.svg?height=200&width=400&text=Chemistry+Answer+1",
          category: "Chemistry",
          difficulty: "hard",
          unitName: "Organic Chemistry",
          subunitName: "Reactions",
        },
      ],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
  ]);

  // Handle file selection and preview
  const handleQuestionImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuestionImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setQuestionImagePreview(result);
        setFormData((prev) => ({ ...prev, questionImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnswerImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setAnswerImagePreview(result);
        setFormData((prev) => ({ ...prev, answerImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (
      !formData.questionImage ||
      !formData.answerImage ||
      !formData.category ||
      !formData.difficulty ||
      !formData.unitName ||
      !formData.subunitName
    ) {
      alert("Please fill in all fields and upload both images");
      return;
    }

    const newQuestion = {
      ...formData,
      difficulty: formData.difficulty,
     
    };

    const res  = await api.post(`/api/questionBank/${JSON.parse(localStorage.getItem("userData"))._id}` , newQuestion)
    
    if(res.data.success){
      alert("Question added successfully")

    }

    console.log(newQuestion);

    
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //   const handleUnitCardClick = (unitName) => {
  //     // Navigate to unit preview page
  //     router.push(`/questions/unit/${encodeURIComponent(unitName)}`)
  //   }

  // Calculate unit statistics
  const allQuestions = questionSets.flatMap((set) => set.questions);
  const unitStatistics = Object.entries(
    allQuestions.reduce((acc, question) => {
      if (!acc[question.unitName]) {
        acc[question.unitName] = {
          unitName: question.unitName,
          totalQuestions: 0,
          easy: 0,
          medium: 0,
          hard: 0,
          questions: [],
        };
      }
      acc[question.unitName].totalQuestions++;
      acc[question.unitName][question.difficulty]++;
      acc[question.unitName].questions.push(question);
      return acc;
    }, {})
  ).map(([_, stats]) => stats);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                QuizMaster AI - Question Bank
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SL</span>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Sujith Liyanage</div>
                <div className="text-gray-500">Teacher</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Form - First Row (Horizontal) */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Upload New Question
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Add questions with images to your question bank
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Question Image Upload */}
                <div className="space-y-2">
                  <Label
                    htmlFor="questionImage"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    Question Image
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="questionImageFile"
                        className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden"
                      >
                        {questionImagePreview ? (
                          <>
                            <img
                              src={questionImagePreview}
                              alt="Question preview"
                              className="absolute inset-0 object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuestionImageFile(null);
                                setQuestionImagePreview("");
                                setFormData((prev) => ({
                                  ...prev,
                                  questionImage: "",
                                }));
                              }}
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                            <FileImage className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              question image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or JPEG (MAX. 10MB)
                            </p>
                          </div>
                        )}
                        <input
                          id="questionImageFile"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleQuestionImageChange}
                          required={!questionImagePreview}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Answer Image Upload */}
                <div className="space-y-2">
                  <Label
                    htmlFor="answerImage"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    Answer Image
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="answerImageFile"
                        className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden"
                      >
                        {answerImagePreview ? (
                          <>
                            <img
                              src={answerImagePreview}
                              alt="Answer preview"
                              className="absolute inset-0 object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnswerImageFile(null);
                                setAnswerImagePreview("");
                                setFormData((prev) => ({
                                  ...prev,
                                  answerImage: "",
                                }));
                              }}
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                            <FileImage className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              answer image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or JPEG (MAX. 10MB)
                            </p>
                          </div>
                        )}
                        <input
                          id="answerImageFile"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAnswerImageChange}
                          required={!answerImagePreview}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-purple-600" />
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calulation">Calculation</SelectItem>
                      <SelectItem value="logic">Theory</SelectItem>
                      <SelectItem value="logic">Logic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="difficulty"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    Difficulty
                  </Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      handleInputChange("difficulty", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="unitName"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Unit Name
                  </Label>
                  <Select
                    value={formData.unitName}
                    onValueChange={(value) =>
                      handleInputChange("unitName", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unit 1">Unit 1</SelectItem>
                      <SelectItem value="Unit 2">Unit 2</SelectItem>
                      <SelectItem value="Unit 3">Unit 3</SelectItem>
                      <SelectItem value="Unit 4">Unit 4</SelectItem>
                      <SelectItem value="Unit 5">Unit 5</SelectItem>
                      <SelectItem value="Unit 6">Unit 6</SelectItem>
                      <SelectItem value="Unit 7">Unit 7</SelectItem>
                      <SelectItem value="Unit 8">Unit 8</SelectItem>
                      <SelectItem value="Unit 9">Unit 9</SelectItem>
                      <SelectItem value="Unit 10">Unit 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="unitName"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    SubUnit Name
                  </Label>
                  <Select
                    value={formData.unitName}
                    onValueChange={(value) =>
                      handleInputChange("subunitName", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unit 1">Unit 1</SelectItem>
                      <SelectItem value="Unit 2">Unit 2</SelectItem>
                      <SelectItem value="Unit 3">Unit 3</SelectItem>
                      <SelectItem value="Unit 4">Unit 4</SelectItem>
                      <SelectItem value="Unit 5">Unit 5</SelectItem>
                      <SelectItem value="Unit 6">Unit 6</SelectItem>
                      <SelectItem value="Unit 7">Unit 7</SelectItem>
                      <SelectItem value="Unit 8">Unit 8</SelectItem>
                      <SelectItem value="Unit 9">Unit 9</SelectItem>
                      <SelectItem value="Unit 10">Unit 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 lg:col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Action
                  </Label>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 text-sm font-medium"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Question
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

    {/* Unit Cards with Statistics 
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Question Bank by Units
              </h2>
              <p className="text-gray-600 mt-1">
                Click on a unit card to view all questions
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              {allQuestions.length} total question
              {allQuestions.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {unitStatistics.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No questions uploaded yet
                </h3>
                <p className="text-gray-500">
                  Start by uploading your first question using the form above.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unitStatistics.map((unit) => (
                <Card
                  key={unit.unitName}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
                  onClick={() => handleUnitCardClick(unit.unitName)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                  
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {unit.unitName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {unit.totalQuestions} questions
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>

                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="w-full h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-xl font-bold text-green-700">
                              {unit.easy}
                            </span>
                          </div>
                          <span className="text-xs text-green-700 font-medium">
                            Easy
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="w-full h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-xl font-bold text-yellow-700">
                              {unit.medium}
                            </span>
                          </div>
                          <span className="text-xs text-yellow-700 font-medium">
                            Medium
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="w-full h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-xl font-bold text-red-700">
                              {unit.hard}
                            </span>
                          </div>
                          <span className="text-xs text-red-700 font-medium">
                            Hard
                          </span>
                        </div>
                      </div>

                      
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-center text-sm text-purple-600 font-medium">
                          <span>Click to view questions</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
         End of Unit Cards with Statistics */}
      </main>
    </div>
  );
}
