"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import ImageUploadField from "./ImageUploadField"
import FormFields from "./FormFields"

export default function UploadForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    questionImage: "",
    answerImage: "",
    category: "",
    difficulty: "",
    unitName: "",
    subunitName: "",
  })

  const [questionImagePreview, setQuestionImagePreview] = useState("")
  const [answerImagePreview, setAnswerImagePreview] = useState("")

  const handleQuestionImageChange = (result) => {
    setQuestionImagePreview(result)
    setFormData((prev) => ({ ...prev, questionImage: result }))
  }

  const handleAnswerImageChange = (result) => {
    setAnswerImagePreview(result)
    setFormData((prev) => ({ ...prev, answerImage: result }))
  }

  const handleQuestionImageRemove = () => {
    setQuestionImagePreview("")
    setFormData((prev) => ({ ...prev, questionImage: "" }))
  }

  const handleAnswerImageRemove = () => {
    setAnswerImagePreview("")
    setFormData((prev) => ({ ...prev, answerImage: "" }))
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData, () => {
      setFormData({
        questionImage: "",
        answerImage: "",
        category: "",
        difficulty: "",
        unitName: "",
        subunitName: "",
      })
      setQuestionImagePreview("")
      setAnswerImagePreview("")
    })
  }

  return (
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
            <ImageUploadField
              id="questionImage"
              label="Question Image"
              preview={questionImagePreview}
              onImageChange={handleQuestionImageChange}
              onImageRemove={handleQuestionImageRemove}
              required={true}
            />

            <ImageUploadField
              id="answerImage"
              label="Answer Image"
              preview={answerImagePreview}
              onImageChange={handleAnswerImageChange}
              onImageRemove={handleAnswerImageRemove}
              required={true}
            />
          </div>

          {/* Form Fields Row */}
          <FormFields formData={formData} onInputChange={handleInputChange} />
        </form>
      </CardContent>
    </Card>
  )
}
