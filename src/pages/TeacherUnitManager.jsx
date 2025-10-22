"use client"

import { useState, useEffect } from "react"
import api from "@/services/api"
import PageHeader from "@/components/teacher-unit-manager/PageHeader"
import SingleUnitForm from "@/components/teacher-unit-manager/SingleUnitForm"
import BulkUnitsForm from "@/components/teacher-unit-manager/BulkUnitsForm"
import CurrentUnitsList from "@/components/teacher-unit-manager/CurrentUnitsList"
import ApiResponse from "@/components/teacher-unit-manager/ApiResponse"

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
        <PageHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Add Units */}
          <div className="space-y-6">
            <SingleUnitForm 
              newUnit={newUnit}
              onUnitChange={handleNewUnitChange}
              onAddUnit={addUnit}
            />
            
            <BulkUnitsForm 
              bulkUnits={bulkUnits}
              onBulkUnitChange={handleBulkUnitChange}
              onSubunitChange={handleSubunitChange}
              onAddBulkUnit={addBulkUnit}
              onAddSubunitToBulk={addSubunitToBulk}
              onBulkAdd={bulkAdd}
            />
          </div>

          {/* Right Column - Current Units */}
          <div className="space-y-6">
            <CurrentUnitsList 
              units={units}
              editingUnit={editingUnit}
              editValues={editValues}
              newSubunitInputs={newSubunitInputs}
              editingSubunit={editingSubunit}
              onEditValuesChange={setEditValues}
              onStartEditingUnit={startEditingUnit}
              onCancelEditingUnit={cancelEditingUnit}
              onUpdateUnit={updateUnit}
              onDeleteUnit={deleteUnit}
              onShowNewSubunitInputs={showNewSubunitInputs}
              onHideNewSubunitInputs={hideNewSubunitInputs}
              onNewSubunitChange={handleNewSubunitChange}
              onAddSubunit={addSubunit}
              onStartEditingSubunit={startEditingSubunit}
              onCancelEditingSubunit={cancelEditingSubunit}
              onUpdateSubunit={updateSubunit}
              onDeleteSubunit={deleteSubunit}
            />
          </div>
        </div>

        <ApiResponse response={response} />
      </div>
    </div>
  )
}
