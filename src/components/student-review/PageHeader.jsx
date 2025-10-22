"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function PageHeader({ paperTitle }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Link to="/my-performance">
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
        </Link>
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">{paperTitle}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Quiz Review</p>
        </div>
      </div>
    </div>
  )
}
