"use client"

import { Brain } from "lucide-react"

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex justify-center items-center">
      <div className="text-center space-y-4 p-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sm:p-8 shadow-xl">
            <Brain className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-600 mb-4" />
            <span className="text-base sm:text-lg text-gray-600 font-medium">Loading user data...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
