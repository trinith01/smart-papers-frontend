"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApiResponse({ response }) {
  if (!response) return null

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-800">API Response</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-sm text-slate-700 border border-slate-200">
          {JSON.stringify(response, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
