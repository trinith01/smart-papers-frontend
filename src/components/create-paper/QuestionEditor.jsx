"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileText, Trash2, Save, ImageIcon } from "lucide-react"

export default function QuestionEditor({
  questions,
  updateQuestion,
  handleImageUpload,
  units,
  setQuestions,
  handleSubmit,
  isSubmitting
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Questions ({questions.length})
        </CardTitle>
        <CardDescription>
          Create your multiple choice questions with 5 options each
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Question {index + 1}
                    </Label>
                    <Badge
                      variant={
                        question.questionImage &&
                        question.answerReviewImage &&
                        question.correctAnswer !== "" &&
                        question.category
                          ? "success"
                          : "destructive"
                      }
                    >
                      {question.questionImage &&
                      question.answerReviewImage &&
                      question.correctAnswer !== "" &&
                      question.category
                        ? "Complete"
                        : "Incomplete"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Question Image Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Question Image
                      </Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(
                              question.id,
                              "questionImage",
                              e.target.files?.[0] || null
                            )
                          }
                          className="mb-2"
                        />
                        {question.questionImageLoading && (
                          <div className="text-center text-blue-500 text-sm mb-2">
                            Uploading...
                          </div>
                        )}
                        {question.questionImage && (
                          <div className="mt-2">
                            <img
                              src={
                                question.questionImage || "/placeholder.svg"
                              }
                              alt="Question"
                              className="max-w-full h-32 object-contain rounded border"
                            />
                          </div>
                        )}
                        {!question.questionImage && (
                          <div className="text-center text-muted-foreground">
                            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Upload question image</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Answer Review Image Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Answer Review Image (Method of Solving)
                      </Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(
                              question.id,
                              "answerReviewImage",
                              e.target.files?.[0] || null
                            )
                          }
                          className="mb-2"
                        />
                        {question.answerReviewImageLoading && (
                          <div className="text-center text-blue-500 text-sm mb-2">
                            Uploading...
                          </div>
                        )}
                        {question.answerReviewImage && (
                          <div className="mt-2">
                            <img
                              src={
                                question.answerReviewImage ||
                                "/placeholder.svg"
                              }
                              alt="Answer Review"
                              className="max-w-full h-32 object-contain rounded border"
                            />
                          </div>
                        )}
                        {!question.answerReviewImage && (
                          <div className="text-center text-muted-foreground">
                            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">
                              Upload solution method image
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-4">
                      {/* Category & Subcategory per Question */}
                      <div className="space-y-4">
                        {/* Category */}
                        <div>
                          <Label className="text-sm font-medium">
                            Category
                          </Label>
                          <Select
                            value={question.category || ""}
                            onValueChange={(value) => {
                              updateQuestion(
                                question.id,
                                "category",
                                value
                              );
                              updateQuestion(
                                question.id,
                                "subcategory",
                                ""
                              ); // reset subcategory
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem
                                  key={unit._id}
                                  value={unit.value}
                                >
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Subcategory */}
                        {question.category && (
                          <div>
                            <Label className="text-sm font-medium">
                              Subcategory
                            </Label>
                            <Select
                              value={question.subcategory || ""}
                              onValueChange={(value) =>
                                updateQuestion(
                                  question.id,
                                  "subcategory",
                                  value
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select subcategory" />
                              </SelectTrigger>
                              <SelectContent>
                                {(
                                  units.find(
                                    (u) => u.value === question.category
                                  )?.subunits || []
                                ).length > 0 ? (
                                  units
                                    .find(
                                      (u) => u.value === question.category
                                    )
                                    .subunits.map((sub) => (
                                      <SelectItem
                                        key={sub._id}
                                        value={sub.value}
                                      >
                                        {sub.label}
                                      </SelectItem>
                                    ))
                                ) : (
                                  <SelectItem disabled>
                                    No subcategories
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Correct Answer
                      </Label>
                      <RadioGroup
                        value={question.correctAnswer?.toString() || ""}
                        onValueChange={(value) =>
                          updateQuestion(
                            question.id,
                            "correctAnswer",
                            value
                          )
                        }
                        className="flex gap-4"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div
                            key={num}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={(num - 1).toString()}
                              id={`${question.id}-choice-${num}`}
                            />
                            <Label
                              htmlFor={`${question.id}-choice-${num}`}
                              className="text-sm font-medium"
                            >
                              {num}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <Separator className="my-6" />
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => setQuestions([])}
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Submit Paper
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
