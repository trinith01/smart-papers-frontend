"use client"

import { BookOpen } from "lucide-react"

export default function PageHeader() {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
        <BookOpen className="h-10 w-10 text-blue-600" />
        Teacher Units Manager
      </h1>
      <p className="text-slate-600 text-lg">Organize and manage your educational units efficiently</p>
    </div>
  )
}
