"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, GraduationCap, Save, X } from "lucide-react"
import { toast } from "sonner"
import api from "@/services/api"



export default function ProfileInformation({ student, updateStudent }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: student?.name || "",
    year: student?.year || "",
    barcode: student?.barcode || "",
  })

  // Handle preferred followed teacher change
  const handlePreferredFollowedTeacherChange = (e) => {
    const idx = Number(e.target.value)
    updateStudent({
      ...student,
      preferredFollowedTeacher: idx,
    })
  }

  // Save only profile attributes
  const handleSaveProfile = async () => {
    if (!formData) return

    const yearNum = Number(formData.year)
    const minYear = new Date().getFullYear() - 10
    const maxYear = new Date().getFullYear() + 5

    if (isNaN(yearNum) || yearNum < minYear || yearNum > maxYear) {
      toast.error(`Year must be between ${minYear} and ${maxYear}`)
      return
    }

    const updatedProfile = {
      name: formData.name,
      year: formData.year,
      barcode: formData.barcode,
      preferredFollowedTeacher: student.preferredFollowedTeacher, // this is a number (index)
    }

    try {
      const res = await api.put(`/api/students/${student._id}`, updatedProfile)
      // Use the response from backend as the new source of truth
      updateStudent(res.data.data) // updateStudent updates both state and localStorage
      setIsEditing(false)
      toast("Profile Updated Successfully: Your profile information has been saved.")
    } catch (err) {
      toast.error("Failed to update profile: " + err.message)
    }
  }

  const handleCancelEdit = () => {
    if (!student) return
    setFormData({
      name: student.name || "",
      year: student.year || "",
      barcode: student.barcode || "",
    })
    setIsEditing(false)
  }

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white shadow-lg">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
            <AvatarFallback className="text-lg sm:text-xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-white">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl sm:text-2xl text-slate-900">{student.name}</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <Badge variant="secondary" className="font-mono text-xs w-fit bg-slate-100">
                {student.uuid}
              </Badge>
              <span className="text-xs sm:text-sm text-slate-500">Student ID</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <GraduationCap className="h-4 w-4" />
              <span>{student.year} Student</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator className="bg-slate-200" />
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
                  disabled={!isEditing}
                />
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-12 flex items-center text-slate-900">
                  {student.name}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="year" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <GraduationCap className="h-4 w-4" />
                Academic Year
              </Label>
              {isEditing ? (
                <Input
                  id="year"
                  type="number"
                  min={new Date().getFullYear() - 10}
                  max={new Date().getFullYear() + 5}
                  value={formData.year}
                  onChange={(e) => {
                    setFormData({ ...formData, year: e.target.value })
                  }}
                  placeholder={`Enter year (${new Date().getFullYear() - 10} - ${new Date().getFullYear() + 5})`}
                  className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
                  disabled={!isEditing}
                />
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-12 flex items-center text-slate-900">
                  {student.year}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Badge className="h-4 w-4" />
                Student ID
              </Label>
              <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-200 h-12 flex items-center text-slate-500">
                {student.uuid} (Read-only)
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="barcode" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Badge className="h-4 w-4" />
                Barcode
              </Label>
              {isEditing ? (
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="Enter your barcode"
                  className="h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
                  disabled={!isEditing}
                />
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-12 flex items-center text-slate-900">
                  {student.barcode || "Not set"}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {/* Preferred Followed Teacher Selector */}
            {student.followedTeachers && student.followedTeachers.length > 0 && (
              <div className="mb-4">
                <Label htmlFor="preferredFollowedTeacher" className="text-sm font-medium">
                  Preferred Teacher
                </Label>
                <select
                  id="preferredFollowedTeacher"
                  value={typeof student.preferredFollowedTeacher === "number" ? student.preferredFollowedTeacher : 0}
                  onChange={handlePreferredFollowedTeacherChange}
                  className="block w-full mt-1 border rounded p-2"
                  disabled={!isEditing}
                >
                  {student.followedTeachers.map((ft, idx) => (
                    <option key={ft.teacher._id} value={idx}>
                      {ft.teacher.name} ({ft.institute.name}-{ft.institute.location})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {isEditing ? (
              <>
                <Button onClick={handleSaveProfile} className="flex items-center justify-center gap-2 h-12">
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center gap-2 h-12 bg-white"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 h-12">
                <User className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
