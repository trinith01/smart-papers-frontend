"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Users } from "lucide-react"

export default function BulkUnitsForm({ 
  bulkUnits, 
  onBulkUnitChange, 
  onSubunitChange, 
  onAddBulkUnit, 
  onAddSubunitToBulk, 
  onBulkAdd 
}) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Bulk Add Units
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {bulkUnits.map((unit, uIdx) => (
          <div
            key={uIdx}
            className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Unit {uIdx + 1}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Unit Label</Label>
                <Input
                  placeholder="Unit label..."
                  value={unit.label}
                  onChange={(e) => onBulkUnitChange(uIdx, "label", e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Unit Value</Label>
                <Input
                  placeholder="Unit value..."
                  value={unit.value}
                  onChange={(e) => onBulkUnitChange(uIdx, "value", e.target.value)}
                  className="border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">Subunits</Label>
              {unit.subunits.map((sub, sIdx) => (
                <div
                  key={sIdx}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-slate-200"
                >
                  <Input
                    placeholder="Subunit label..."
                    value={sub.label}
                    onChange={(e) => onSubunitChange(uIdx, sIdx, "label", e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Subunit value..."
                    value={sub.value}
                    onChange={(e) => onSubunitChange(uIdx, sIdx, "value", e.target.value)}
                    className="text-sm"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddSubunitToBulk(uIdx)}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Subunit
              </Button>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={onAddBulkUnit}
            className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Unit
          </Button>
          <Button onClick={onBulkAdd} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5">
            Submit All Units
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
