"use client"

import { Plus } from "lucide-react"

export default function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Create MCQ Paper</h1>
        <p className="text-muted-foreground">
          Design and create multiple choice question papers
        </p>
      </div>
    </div>
  )
}
