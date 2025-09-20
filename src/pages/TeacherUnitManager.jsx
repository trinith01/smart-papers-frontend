"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, Trash2, BookOpen, Users, Edit, X } from "lucide-react"
import api from "@/services/api"

export default function TeacherUnitManager() {
  const [teacherId, setTeacherId] = useState("")
  const [units, setUnits] = useState([])
  const [newUnit, setNewUnit] = useState({ label: "", value: "" })
  const [bulkUnits, setBulkUnits] = useState([{ label: "", value: "", subunits: [{ label: "", value: "" }] }])
  const [response, setResponse] = useState(null)
  const [editingUnit, setEditingUnit] = useState(null)
  const [editingSubunit, setEditingSubunit] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [newSubunitInputs, setNewSubunitInputs] = useState({})

  const API_BASE = "http://localhost:5000/teacher-units"

  // ---------- HANDLERS ----------

  const handleNewUnitChange = (field, value) => setNewUnit({ ...newUnit, [field]: value })

  const handleBulkUnitChange = (index, field, value) => {
    const updated = [...bulkUnits]
    updated[index][field] = value
    setBulkUnits(updated)
  }

  const handleSubunitChange = (uIdx, sIdx, field, value) => {
    const updated = [...bulkUnits]
    updated[uIdx].subunits[sIdx][field] = value
    setBulkUnits(updated)
  }

  const addBulkUnit = () => {
    setBulkUnits([...bulkUnits, { label: "", value: "", subunits: [{ label: "", value: "" }] }])
  }

  const addSubunitToBulk = (uIdx) => {
    const updated = [...bulkUnits]
    updated[uIdx].subunits.push({ label: "", value: "" })
    setBulkUnits(updated)
  }

  const startEditingUnit = (unitLabel) => {
    const unit = units.find((u) => u.label === unitLabel)
    setEditingUnit(unitLabel)
    setEditValues({
      label: unit.label,
      value: unit.value,
    })
  }

  const cancelEditingUnit = () => {
    setEditingUnit(null)
    setEditValues({})
  }

  const startEditingSubunit = (unitLabel, subunitLabel) => {
    const unit = units.find((u) => u.label === unitLabel)
    const subunit = unit.subunits.find((s) => s.label === subunitLabel)
    setEditingSubunit(`${unitLabel}-${subunitLabel}`)
    setEditValues({
      label: subunit.label,
      value: subunit.value,
    })
  }

  const cancelEditingSubunit = () => {
    setEditingSubunit(null)
    setEditValues({})
  }

  const showNewSubunitInputs = (unitLabel) => {
    setNewSubunitInputs({
      ...newSubunitInputs,
      [unitLabel]: { label: "", value: "", show: true },
    })
  }

  const hideNewSubunitInputs = (unitLabel) => {
    const updated = { ...newSubunitInputs }
    delete updated[unitLabel]
    setNewSubunitInputs(updated)
  }

  const handleNewSubunitChange = (unitLabel, field, value) => {
    setNewSubunitInputs({
      ...newSubunitInputs,
      [unitLabel]: {
        ...newSubunitInputs[unitLabel],
        [field]: value,
      },
    })
  }

  const fetchUnits = async () => {
    if (!teacherId) return
    try {
      const res = await api.get(`/api/teacherUnits/${teacherId}/units`)
      setUnits(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const addUnit = async () => {
    try {
      const res = await api.post(`/api/teacherUnits/${teacherId}/units`, newUnit)
      setResponse(res.data)
      setNewUnit({ label: "", value: "" })
      fetchUnits()
    } catch (err) {
      setResponse(err.response?.data || err.message)
    }
  }

  const bulkAdd = async () => {
    try {
      const res = await api.post(`/api/teacherUnits/${teacherId}/units/bulk`, {
        units: bulkUnits,
      })
      setResponse(res.data)
      setBulkUnits([{ label: "", value: "", subunits: [{ label: "", value: "" }] }])
      fetchUnits()
    } catch (err) {
      setResponse(err.response?.data || err.message)
    }
  }

  const updateUnit = async (originalLabel) => {
    try {
      const res = await api.put(`/api/teacherUnits/${teacherId}/units/${originalLabel}`, {
        newLabel: editValues.label,
        newValue: editValues.value,
      })
      setResponse(res.data)
      setEditingUnit(null)
      setEditValues({})
      fetchUnits()
    } catch (err) {
      setResponse(err.response?.data || err.message)
    }
  }

  const deleteUnit = async (unitLabel) => {
    if (!confirm("Are you sure you want to delete this unit? This action cannot be undone.")) return
    try {
      const res = await api.delete(`/api/teacherUnits/${teacherId}/units/${unitLabel}`)
      setResponse(res.data)
      fetchUnits()
    } catch (err) {
      setResponse(err.response?.data || err.message)
    }
  }

  const addSubunit = async (unitLabel) => {
    const inputs = newSubunitInputs[unitLabel]
    if (!inputs || !inputs.label || !inputs.value) {
      setResponse({ error: "Please fill in both subunit label and value" })
      return
    }

    try {
      const res = await api.post(`/api/teacherUnits/${teacherId}/units/${unitLabel}/subunits`, {
        subunitLabel: inputs.label,
        subunitValue: inputs.value,
      })
      setResponse(res.data)
      hideNewSubunitInputs(unitLabel)
      fetchUnits()
    } catch (err) {
      setResponse(err.response?.data || err.message)
    }
  }

  const updateSubunit = async (unitLabel, originalSubunitLabel) => {
    try {
      const res = await api.put(`/api/teacherUnits/${teacherId}/units/${unitLabel}/subunits/${originalSubunitLabel}`, {
        newLabel: editValues.label,
        newValue: editValues.value,
      })
      setResponse(res.data)
      setEditingSubunit(null)
      setEditValues({})
      fetchUnits()
    } catch (err) {
      setResponse(err.response?.data || err.message)
    }
  }

  const deleteSubunit = async (unitLabel, subunitLabel) => {
    if (!confirm("Are you sure you want to delete this subunit? This action cannot be undone.")) return
    try {
      const res = await api.delete(`/api/teacherUnits/${teacherId}/units/${unitLabel}/subunits/${subunitLabel}`)
      setResponse(res.data)
      fetchUnits()
    } catch (err) {
      setResponse(err.response?.data || err.message)
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [teacherId])

  useEffect(() => {
    console.log("useEffect running")
    const userData = JSON.parse(localStorage.getItem("userData"))
    const role = localStorage.getItem("userRole")
    if (userData && role === "teacher") {
      console.log("loading user DATA")
      setTeacherId(userData._id)
    }
  }, [])

  // ---------- RENDER ----------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-blue-600" />
            Teacher Units Manager
          </h1>
          <p className="text-slate-600 text-lg">Organize and manage your educational units efficiently</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Add Units */}
          <div className="space-y-6">
            {/* Add Single Unit */}
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
                    onChange={(e) => handleNewUnitChange("label", e.target.value)}
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
                    onChange={(e) => handleNewUnitChange("value", e.target.value)}
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  onClick={addUnit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                  disabled={!newUnit.label || !newUnit.value}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit
                </Button>
              </CardContent>
            </Card>

            {/* Bulk Add Units */}
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
                          onChange={(e) => handleBulkUnitChange(uIdx, "label", e.target.value)}
                          className="border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Unit Value</Label>
                        <Input
                          placeholder="Unit value..."
                          value={unit.value}
                          onChange={(e) => handleBulkUnitChange(uIdx, "value", e.target.value)}
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
                            onChange={(e) => handleSubunitChange(uIdx, sIdx, "label", e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Subunit value..."
                            value={sub.value}
                            onChange={(e) => handleSubunitChange(uIdx, sIdx, "value", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSubunitToBulk(uIdx)}
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
                    onClick={addBulkUnit}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Unit
                  </Button>
                  <Button onClick={bulkAdd} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5">
                    Submit All Units
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Current Units */}
          <div className="space-y-6">
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
                    <Card key={unit.label} className="border border-slate-200 bg-white shadow-sm">
                      <CardContent className="p-6 space-y-4">
                        {/* Unit Header */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1 space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Label</Label>
                            <Input
                              value={editingUnit === unit.label ? editValues.label : unit.label}
                              onChange={(e) => setEditValues({ ...editValues, label: e.target.value })}
                              className="border-slate-200"
                              readOnly={editingUnit !== unit.label}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Value</Label>
                            <Input
                              value={editingUnit === unit.label ? editValues.value : unit.value}
                              onChange={(e) => setEditValues({ ...editValues, value: e.target.value })}
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
                                onClick={() => updateUnit(unit.label)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEditingUnit}
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
                              onClick={() => startEditingUnit(unit.label)}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteUnit(unit.label)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                          {!newSubunitInputs[unit.label]?.show && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => showNewSubunitInputs(unit.label)}
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
                                  onChange={(e) => handleNewSubunitChange(unit.label, "label", e.target.value)}
                                  className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-green-700">Subunit Value</Label>
                                <Input
                                  placeholder="Enter subunit value..."
                                  value={newSubunitInputs[unit.label]?.value || ""}
                                  onChange={(e) => handleNewSubunitChange(unit.label, "value", e.target.value)}
                                  className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => addSubunit(unit.label)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={!newSubunitInputs[unit.label]?.label || !newSubunitInputs[unit.label]?.value}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Subunit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => hideNewSubunitInputs(unit.label)}
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
                                        onChange={(e) => setEditValues({ ...editValues, label: e.target.value })}
                                        className="flex-1 text-sm bg-white"
                                        placeholder="Subunit label"
                                        readOnly={!isEditing}
                                      />
                                      <Input
                                        value={isEditing ? editValues.value : sub.value}
                                        onChange={(e) => setEditValues({ ...editValues, value: e.target.value })}
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
                                            onClick={() => updateSubunit(unit.label, sub.label)}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                          >
                                            <Save className="h-3 w-3 mr-1" />
                                            Save
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={cancelEditingSubunit}
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
                                          onClick={() => startEditingSubunit(unit.label, sub.label)}
                                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                        >
                                          <Edit className="h-3 w-3 mr-1" />
                                          Edit
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteSubunit(unit.label, sub.label)}
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
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Response */}
        {response && (
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
        )}
      </div>
    </div>
  )
}
