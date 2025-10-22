"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import UnitCard from "./UnitCard"

export default function CurrentUnitsList({ 
  units, 
  editingUnit, 
  editValues, 
  newSubunitInputs, 
  editingSubunit, 
  onEditValuesChange, 
  onStartEditingUnit, 
  onCancelEditingUnit, 
  onUpdateUnit, 
  onDeleteUnit, 
  onShowNewSubunitInputs, 
  onHideNewSubunitInputs, 
  onNewSubunitChange, 
  onAddSubunit, 
  onStartEditingSubunit, 
  onCancelEditingSubunit, 
  onUpdateSubunit, 
  onDeleteSubunit 
}) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Current Units
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {units.length} units
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[800px] overflow-y-auto">
        {units.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium">No units yet</p>
            <p className="text-sm">Add your first unit to get started</p>
          </div>
        ) : (
          units.map((unit) => (
            <UnitCard
              key={unit.label}
              unit={unit}
              editingUnit={editingUnit}
              editValues={editValues}
              newSubunitInputs={newSubunitInputs}
              editingSubunit={editingSubunit}
              onEditValuesChange={onEditValuesChange}
              onStartEditingUnit={onStartEditingUnit}
              onCancelEditingUnit={onCancelEditingUnit}
              onUpdateUnit={onUpdateUnit}
              onDeleteUnit={onDeleteUnit}
              onShowNewSubunitInputs={onShowNewSubunitInputs}
              onHideNewSubunitInputs={onHideNewSubunitInputs}
              onNewSubunitChange={onNewSubunitChange}
              onAddSubunit={onAddSubunit}
              onStartEditingSubunit={onStartEditingSubunit}
              onCancelEditingSubunit={onCancelEditingSubunit}
              onUpdateSubunit={onUpdateSubunit}
              onDeleteSubunit={onDeleteSubunit}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}
