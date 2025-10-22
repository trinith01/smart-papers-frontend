"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto p-3 sm:p-6">
        <Card className="border-red-200/50 bg-red-50/50 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100/50 rounded-full blur-xl"></div>
              <AlertTriangle className="relative h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4 sm:mb-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-3">
              Error Loading Data
            </h3>
            <p className="text-red-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
              {error}
            </p>
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
