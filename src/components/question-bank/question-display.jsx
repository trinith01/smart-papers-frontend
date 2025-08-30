"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

import { FilterControls } from "./filter-controls"
import { UnitSection } from "./unit-section"
import { AddQuestionDialog } from "./add-question-dialog"



export function QuestionDisplay({
  selectedBank,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  expandedUnits,
  unitDifficultyFilters,
  unitCategoryFilters,
  isUploadDialogOpen,
  setIsUploadDialogOpen,
  onToggleUnitExpansion,
  onSetUnitDifficultyFilter,
  onSetUnitCategoryFilter,
  onSubmitQuestion,
}) {
  const groupQuestionsByUnit = (questions) => {
    return questions.reduce(
      (acc, question) => {
        if (!acc[question.unitName]) {
          acc[question.unitName] = []
        }
        acc[question.unitName].push(question)
        return acc
      },
      {} 
    )
  }

  const getFilteredQuestionsForUnit = (questions, unitName) => {
    const unitDifficultyFilter = unitDifficultyFilters[unitName] || "all"
    const unitCategoryFilter = unitCategoryFilters[unitName] || "all"

    return questions.filter((question) => {
      const matchesSearch =
  (question.unitName || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
  (question.subunitName || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
  (question.category || "").toLowerCase().includes((searchTerm || "").toLowerCase())
      const matchesCategory = filterCategory === "all" || question.category === filterCategory
      const matchesDifficulty = unitDifficultyFilter === "all" || question.difficulty === unitDifficultyFilter
      const matchesUnitCategory = unitCategoryFilter === "all" || question.category === unitCategoryFilter

      return matchesSearch && matchesCategory && matchesDifficulty && matchesUnitCategory
    })
  }

  if (!selectedBank) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Select a question bank to view questions</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{selectedBank.name}</h2>
          <p className="text-gray-600">{selectedBank.questions.length} questions organized by units</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <AddQuestionDialog
              selectedBank={selectedBank}
              onSubmit={onSubmitQuestion}
              onClose={() => setIsUploadDialogOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      <FilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />

      <div className="space-y-6">
        {Object.entries(groupQuestionsByUnit(selectedBank.questions)).map(([unitName, unitQuestions]) => {
          const filteredQuestions = getFilteredQuestionsForUnit(unitQuestions, unitName)
          const isExpanded = expandedUnits[unitName] ?? true
          const unitDifficultyFilter = unitDifficultyFilters[unitName] || "all"
          const unitCategoryFilter = unitCategoryFilters[unitName] || "all"

          return (
            <UnitSection
              key={unitName}
              unitName={unitName}
              unitQuestions={unitQuestions}
              filteredQuestions={filteredQuestions}
              isExpanded={isExpanded}
              unitDifficultyFilter={unitDifficultyFilter}
              unitCategoryFilter={unitCategoryFilter}
              onToggleExpansion={() => onToggleUnitExpansion(unitName)}
              onSetDifficultyFilter={(difficulty) => onSetUnitDifficultyFilter(unitName, difficulty)}
              onSetCategoryFilter={(category) => onSetUnitCategoryFilter(unitName, category)}
            />
          )
        })}
      </div>
    </div>
  )
}
