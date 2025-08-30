"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ChevronDown, ChevronRight, FileQuestion } from "lucide-react"

import { QuestionCard } from "./question-card"

export function UnitSection({
  unitName,
  unitQuestions,
  filteredQuestions,
  isExpanded,
  unitDifficultyFilter,
  unitCategoryFilter,
  onToggleExpansion,
  onSetDifficultyFilter,
  onSetCategoryFilter,
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Unit Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onToggleExpansion} className="p-1 h-8 w-8">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{unitName}</h3>
              <p className="text-sm text-gray-600">
                {filteredQuestions.length} of {unitQuestions.length} questions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Category:</span>
              <Select value={unitCategoryFilter} onValueChange={onSetCategoryFilter}>
                <SelectTrigger className="w-32 h-8 text-xs border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="calculation">Calculation</SelectItem>
                  <SelectItem value="theory">Theory</SelectItem>
                  <SelectItem value="logic">Logic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Difficulty:</span>
              <Select value={unitDifficultyFilter} onValueChange={onSetDifficultyFilter}>
                <SelectTrigger className="w-32 h-8 text-xs border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="text-xs">
              {unitQuestions.length} total
            </Badge>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileQuestion className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No questions match the current filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuestions.map((question, index) => (
                <QuestionCard key={question._id || index} question={question} index={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
