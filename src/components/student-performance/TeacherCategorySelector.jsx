"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen } from "lucide-react"

export default function TeacherCategorySelector({ 
  preferredTeacher, 
  availableCategories, 
  selectedCategory, 
  onCategorySelect 
}) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          Preferred Teacher & Category
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          Your preferred teacher and their categories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:gap-8 lg:space-y-0">
          <div className="w-full space-y-3">
            <label className="text-sm font-medium block text-gray-700">Teacher</label>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 min-h-[48px] flex items-center text-gray-900 font-medium shadow-inner text-sm sm:text-base">
              <span className="break-words">
                {preferredTeacher?.teacher?.name}{" "}
                <span className="mx-2 text-gray-400 hidden sm:inline">|</span>
                <span className="block sm:inline mt-1 sm:mt-0 text-gray-600 text-xs sm:text-sm">
                  {preferredTeacher?.institute?.name}
                </span>
              </span>
            </div>
          </div>
          <div className="w-full space-y-3">
            <label className="text-sm font-medium block text-gray-700">Category</label>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {availableCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => onCategorySelect(category)}
                  className={`capitalize transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4 py-2 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                      : "bg-white/80 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
        {selectedCategory && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">Selected:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="text-gray-800 break-words">{preferredTeacher?.teacher.name}</span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-blue-600 font-medium">{selectedCategory}</span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-gray-800 break-words">{preferredTeacher?.institute.name}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
