"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, Trash2, Edit, X, Plus } from "lucide-react"

export default function UnitCard({ 
  unit, 
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
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-6 space-y-4">
        {/* Unit Header */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium text-slate-700">Label</Label>
            <Input
              value={editingUnit === unit.label ? editValues.label : unit.label}
              onChange={(e) => onEditValuesChange({ ...editValues, label: e.target.value })}
              className="border-slate-200"
              readOnly={editingUnit !== unit.label}
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium text-slate-700">Value</Label>
            <Input
              value={editingUnit === unit.label ? editValues.value : unit.value}
              onChange={(e) => onEditValuesChange({ ...editValues, value: e.target.value })}
              className="border-slate-200"
              readOnly={editingUnit !== unit.label}
            />
          </div>
        </div>

        {/* Unit Actions */}
        <div className="flex flex-wrap gap-2">
          {editingUnit === unit.label ? (
            <>
              <Button
                size="sm"
                onClick={() => onUpdateUnit(unit.label)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancelEditingUnit}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartEditingUnit(unit.label)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeleteUnit(unit.label)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
          {!newSubunitInputs[unit.label]?.show && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onShowNewSubunitInputs(unit.label)}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Subunit
            </Button>
          )}
        </div>

        {newSubunitInputs[unit.label]?.show && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-green-800">Add New Subunit</Label>
              <Badge variant="outline" className="text-xs text-green-700">
                Current: {unit.subunits?.length || 0} subunits
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-green-700">Subunit Label</Label>
                <Input
                  placeholder="Enter subunit label..."
                  value={newSubunitInputs[unit.label]?.label || ""}
                  onChange={(e) => onNewSubunitChange(unit.label, "label", e.target.value)}
                  className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-green-700">Subunit Value</Label>
                <Input
                  placeholder="Enter subunit value..."
                  value={newSubunitInputs[unit.label]?.value || ""}
                  onChange={(e) => onNewSubunitChange(unit.label, "value", e.target.value)}
                  className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onAddSubunit(unit.label)}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!newSubunitInputs[unit.label]?.label || !newSubunitInputs[unit.label]?.value}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Subunit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onHideNewSubunitInputs(unit.label)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
            <p className="text-xs text-green-600 italic">
              You can add multiple subunits by clicking "Add Subunit" again after adding each one.
            </p>
          </div>
        )}

        {/* Subunits */}
        {unit.subunits && unit.subunits.length > 0 && (
          <div className="space-y-3">
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                Subunits
                <Badge variant="outline" className="text-xs">
                  {unit.subunits.length}
                </Badge>
              </Label>
              {unit.subunits.map((sub) => {
                const isEditing = editingSubunit === `${unit.label}-${sub.label}`
                return (
                  <div
                    key={sub.label}
                    className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        value={isEditing ? editValues.label : sub.label}
                        onChange={(e) => onEditValuesChange({ ...editValues, label: e.target.value })}
                        className="flex-1 text-sm bg-white"
                        placeholder="Subunit label"
                        readOnly={!isEditing}
                      />
                      <Input
                        value={isEditing ? editValues.value : sub.value}
                        onChange={(e) => onEditValuesChange({ ...editValues, value: e.target.value })}
                        className="flex-1 text-sm bg-white"
                        placeholder="Subunit value"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => onUpdateSubunit(unit.label, sub.label)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={onCancelEditingSubunit}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onStartEditingSubunit(unit.label, sub.label)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteSubunit(unit.label, sub.label)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
