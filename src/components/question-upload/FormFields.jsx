"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, BarChart3, BookOpen, Upload } from "lucide-react"

export default function FormFields({ formData, onInputChange }) {
  return (
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
          onValueChange={(value) => onInputChange("category", value)}
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
          onValueChange={(value) => onInputChange("difficulty", value)}
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
          onValueChange={(value) => onInputChange("unitName", value)}
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
          htmlFor="subunitName"
          className="text-sm font-medium text-gray-700 flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-purple-600" />
          SubUnit Name
        </Label>
        <Select
          value={formData.subunitName}
          onValueChange={(value) => onInputChange("subunitName", value)}
        >
          <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
            <SelectValue placeholder="Select a subunit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SubUnit 1">SubUnit 1</SelectItem>
            <SelectItem value="SubUnit 2">SubUnit 2</SelectItem>
            <SelectItem value="SubUnit 3">SubUnit 3</SelectItem>
            <SelectItem value="SubUnit 4">SubUnit 4</SelectItem>
            <SelectItem value="SubUnit 5">SubUnit 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 lg:col-span-2 space-y-2">
        <Label className="text-sm font-medium text-gray-700">Action</Label>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 text-sm font-medium rounded-md transition-colors"
        >
          <Upload className="w-4 h-4 mr-2 inline" />
          Upload Question
        </button>
      </div>
    </div>
  )
}
