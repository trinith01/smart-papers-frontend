"use client"

import { HelpCircle } from "lucide-react"

export default function PageHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              QuizMaster AI - Question Bank
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">SL</span>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Sujith Liyanage</div>
              <div className="text-gray-500">Teacher</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
