"use client"

import { GraduationCap } from "lucide-react"

export default function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-lg w-full">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl w-fit">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          Student Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          View available quizzes and track your progress for your preferred teacher
        </p>
      </div>
    </div>
  )
}
