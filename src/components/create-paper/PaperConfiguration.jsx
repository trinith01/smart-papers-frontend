"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function PaperConfiguration({
  paperTitle,
  setPaperTitle,
  subject,
  setSubject,
  paperCategory,
  setPaperCategory,
  year,
  setYear,
  questionCount,
  handleQuestionCountChange,
  questions,
  initializeQuestions,
  isSubmitting,
  minYear,
  maxYear
}) {
  const subjectOptions = [{ value: "Physics", label: "Physics" }]

  const paperCategoryOptions = [
    { value: "theory", label: "📚 Theory" },
    { value: "revision", label: "🔄 Revision" },
    { value: "paper", label: "📝 Paper" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Paper Configuration
        </CardTitle>
        <CardDescription>
          Set up your MCQ paper details and question count
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Paper Title</Label>
            <Input
              id="title"
              placeholder="Enter paper title"
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject || ""} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((subj) => (
                  <SelectItem key={subj.value} value={subj.value}>
                    {subj.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paperCategory">Paper Category</Label>
            <Select
              value={paperCategory || "theory"}
              onValueChange={setPaperCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {paperCategoryOptions.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              min={minYear}
              max={maxYear}
              placeholder="Enter year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Year must be between {minYear} and {maxYear}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="questions">Number of Questions</Label>
          <Select onValueChange={handleQuestionCountChange} defaultValue="15">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select question count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="1" value="1">
                1 Questions
              </SelectItem>
              <SelectItem key="5" value="5">
                5 Questions
              </SelectItem>
              <SelectItem key="15" value="15">
                15 Questions
              </SelectItem>
              <SelectItem key="25" value="25">
                25 Questions
              </SelectItem>
              <SelectItem key="50" value="50">
                50 Questions
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {questions.length === 0 && (
          <Button
            onClick={() => initializeQuestions(questionCount)}
            className="w-full"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Initialize Questions
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
