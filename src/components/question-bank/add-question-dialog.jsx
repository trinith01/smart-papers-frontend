"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, ImageIcon, Layers, BarChart3, BookOpen, FileImage } from "lucide-react"




export function AddQuestionDialog({ selectedBank, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    questionImage: "",
    answerImage: "",
    category: "",
    difficulty: "",
    unitName: "",
    subunitName: "",
    bankName: selectedBank?.name || "",
    bankId: selectedBank?._id || "",
   
  })

  const [questionImagePreview, setQuestionImagePreview] = useState("")
  const [answerImagePreview, setAnswerImagePreview] = useState("")

  const handleQuestionImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result 
        setQuestionImagePreview(result)
        setFormData((prev) => ({ ...prev, questionImage: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnswerImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        setAnswerImagePreview(result)
        setFormData((prev) => ({ ...prev, answerImage: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.questionImage ||
      !formData.answerImage ||
      !formData.category ||
      !formData.difficulty ||
      !formData.unitName ||
      !formData.subunitName ||
      !formData.bankName
    ) {
      alert("Please fill in all fields and upload both images")
      return
    }

    // TODO: Replace with actual API call
    
    // const response = await fetch('/api/questions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...formData, bankId: selectedBank?._id })
    // })

    onSubmit(formData)
    onClose()

    // Reset form
    setFormData({
      questionImage: "",
      answerImage: "",
      category: "",
      difficulty: "",
      unitName: "",
      subunitName: "",
      bankName: "",
      bankId: "",
    })
    setQuestionImagePreview("")
    setAnswerImagePreview("")
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{selectedBank ? `Add Question to ${selectedBank.name}` : "Upload New Question"}</DialogTitle>
        <DialogDescription>
          {selectedBank
            ? `Add a new question to the selected question bank`
            : "Add a new question to your question bank"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-8 p-1">
        {/* Bank Name Field */}
        <div className="space-y-3">
          <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">
            Question Bank Name
          </Label>
          <Input
            id="bankName"
            value={selectedBank?.name || formData.bankName}
            onChange={(e) => handleInputChange("bankName", e.target.value)}
            placeholder="Enter question bank name"
            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            disabled={!!selectedBank}
          />
          {selectedBank && <p className="text-sm text-gray-500">This question will be added to the selected bank</p>}
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Upload Images</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Question Image Upload */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                Question Image
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-400 transition-colors">
                <label
                  htmlFor="questionImageFile"
                  className="relative flex flex-col items-center justify-center w-full h-40 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors overflow-hidden"
                >
                  {questionImagePreview ? (
                    <>
                      <img
                        src={questionImagePreview || "/placeholder.svg"}
                        alt="Question preview"
                        className="absolute inset-0 object-cover w-full h-full rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          setQuestionImagePreview("")
                          setFormData((prev) => ({ ...prev, questionImage: "" }))
                        }}
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <FileImage className="w-12 h-12 mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600 text-center">
                        <span className="font-semibold text-purple-600">Click to upload</span>
                        <br />
                        question image
                      </p>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
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

            {/* Answer Image Upload */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                Answer Image
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-400 transition-colors">
                <label
                  htmlFor="answerImageFile"
                  className="relative flex flex-col items-center justify-center w-full h-40 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors overflow-hidden"
                >
                  {answerImagePreview ? (
                    <>
                      <img
                        src={answerImagePreview || "/placeholder.svg"}
                        alt="Answer preview"
                        className="absolute inset-0 object-cover w-full h-full rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          setAnswerImagePreview("")
                          setFormData((prev) => ({ ...prev, answerImage: "" }))
                        }}
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <FileImage className="w-12 h-12 mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600 text-center">
                        <span className="font-semibold text-purple-600">Click to upload</span>
                        <br />
                        answer image
                      </p>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
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

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Question Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calculation">Calculation</SelectItem>
                  <SelectItem value="theory">Theory</SelectItem>
                  <SelectItem value="logic">Logic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Difficulty
              </Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
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

            <div className="space-y-3">
              <Label htmlFor="unitName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Unit Name
              </Label>
              <Select value={formData.unitName} onValueChange={(value) => handleInputChange("unitName", value)}>
                <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i} value={`Unit ${i + 1}`}>
                      Unit {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="subunitName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                SubUnit Name
              </Label>
              <Input
                id="subunitName"
                value={formData.subunitName}
                onChange={(e) => handleInputChange("subunitName", e.target.value)}
                placeholder="Enter subunit name"
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            <Upload className="w-4 h-4 mr-2" />
            {selectedBank ? "Add Question" : "Upload Question"}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
