"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export default function SingleUnitForm({ 
  newUnit, 
  onUnitChange, 
  onAddUnit 
}) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
          <Plus className="h-5 w-5 text-green-600" />
          Add Single Unit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="unit-label" className="text-sm font-medium text-slate-700">
            Unit Label
          </Label>
          <Input
            id="unit-label"
            placeholder="Enter unit label..."
            value={newUnit.label}
            onChange={(e) => onUnitChange("label", e.target.value)}
            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit-value" className="text-sm font-medium text-slate-700">
            Unit Value
          </Label>
          <Input
            id="unit-value"
            placeholder="Enter unit value..."
            value={newUnit.value}
            onChange={(e) => onUnitChange("value", e.target.value)}
            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Button
          onClick={onAddUnit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
          disabled={!newUnit.label || !newUnit.value}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </CardContent>
    </Card>
  )
}
