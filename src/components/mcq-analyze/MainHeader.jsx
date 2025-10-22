"use client"

export default function MainHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-lg w-full">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          MCQ Performance Analysis
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Click on any unit to review incorrect questions
        </p>
      </div>
    </div>
  )
}
