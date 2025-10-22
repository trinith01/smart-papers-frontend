"use client"

import { Loader2 } from "lucide-react"

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto p-3 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sm:p-8 shadow-xl">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600 mt-4 font-medium text-sm sm:text-base">
                Loading your MCQ analysis...
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">
                Analyzing your performance data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
