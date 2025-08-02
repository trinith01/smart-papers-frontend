"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Save, Search, PlusCircle, CheckCircle2, Building2, BookOpen, UserCheck } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import api from "@/services/api"



export default function FollowedTeachers({ student, updateStudent }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTeachers, setFilteredTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [selectedInstituteForTeacher, setSelectedInstituteForTeacher] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isFollowDialogOpen, setIsFollowDialogOpen] = useState(false)

  useEffect(() => {
    const getTeachers = async () => {
      try {
        const res = await api.get("api/teachers")
        console.log("res.data", res.data)
        setFilteredTeachers(res.data)
      } catch (err) {
        toast.error(err.message)
      }
    }

    getTeachers()
  }, [])

  // Filter teachers based on search and institute
  useEffect(() => {
    if (!student || !student.followedTeachers) return

    let filtered = filteredTeachers

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.uuid.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredTeachers(filtered)
  }, [searchQuery, student]) // Updated dependency array

  // For editing existing followed teachers
  const handleEditFollowedTeacher = (index, field, value) => {
    updateStudent((prev) => {
      const updated = { ...prev }
      updated.followedTeachers = [...(updated.followedTeachers || [])]
      if (field === "institute") {
        updated.followedTeachers[index] = {
          ...updated.followedTeachers[index],
          institute: value,
        }
      } else if (field === "category") {
        updated.followedTeachers[index] = {
          ...updated.followedTeachers[index],
          category: value,
        }
      }
      return updated
    })
  }

  // Save only followed teachers
  const handleSaveFollowedTeachers = async () => {
    const followedTeachersForBackend = (student?.followedTeachers || []).map((follow) => ({
      teacher: typeof follow.teacher === "object" ? follow.teacher._id : follow.teacher,
      institute: typeof follow.institute === "object" ? follow.institute._id : follow.institute,
      category: follow.category,
    }))

    try {
      const res = await api.put(`/api/students/${student._id}`, {
        followedTeachers: followedTeachersForBackend,
      })
      updateStudent(res.data.data) // Use backend response
      toast("Followed teachers updated successfully.")
    } catch (err) {
      toast.error("Failed to update followed teachers: " + err.message)
    }
  }

  // Define available categories for following a teacher
  const availableCategories = ["theory", "revision", "paper"]

  const handleFollowTeacher = () => {
    if (!selectedTeacher || !selectedInstituteForTeacher || selectedCategories.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select a teacher, an institute, and at least one category.",
        variant: "destructive",
      })
      return
    }

    // Prepare the new follow object for the backend
    const newFollowedTeacher = {
      teacher: (selectedTeacher )._id,
      institute: selectedInstituteForTeacher,
      category: selectedCategories,
    }

    // Console output before updating
    console.log("Will update student with new followed teacher:", newFollowedTeacher)

    // API call would go here
    updateStudent({
      ...student,
      followedTeachers: [
        ...(student?.followedTeachers || []),
        {
          teacher: {
            _id: (selectedTeacher )._id,
            name: (selectedTeacher ).name,
            uuid: (selectedTeacher ).uuid,
          },
          institute: (selectedTeacher ).institute.find((inst) => inst._id === selectedInstituteForTeacher),
          category: selectedCategories,
        },
      ],
    })

    toast.success(`You're now following ${(selectedTeacher ).name} for ${selectedCategories.join(", ")}.`)

    // Reset form
    setSelectedTeacher(null)
    setSelectedCategories([])
    setSelectedInstituteForTeacher("")
    setIsFollowDialogOpen(false)
  }

  const handleUnfollowTeacher = (teacherId, teacherName) => {
    if (!student || !student.followedTeachers) return

    const updatedFollowedTeachers = student.followedTeachers.filter((follow) => follow.teacher._id !== teacherId)

    updateStudent({
      ...student,
      followedTeachers: updatedFollowedTeachers,
    })

    toast({
      title: "Teacher Unfollowed",
      description: `You have unfollowed ${teacherName}.`,
    })
  }

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const resetFollowDialog = () => {
    setSelectedTeacher(null)
    setSelectedCategories([])
    setSearchQuery("")
    setSelectedInstituteForTeacher("")
  }

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
              <Users className="h-5 w-5" />
              Followed Teachers ({student.followedTeachers?.length || 0})
            </CardTitle>
            <CardDescription className="mt-1 text-slate-600">
              Manage your followed teachers and discover new ones
            </CardDescription>
          </div>
          <Dialog open={isFollowDialogOpen} onOpenChange={setIsFollowDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 h-12 w-full sm:w-auto" onClick={resetFollowDialog}>
                <PlusCircle className="h-4 w-4" />
                <span className="sm:hidden">Follow Teacher</span>
                <span className="hidden sm:inline">Follow New Teacher</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] p-0">
              <div className="p-6 pb-0">
                <DialogHeader>
                  <DialogTitle className="text-xl">Follow a New Teacher</DialogTitle>
                  <DialogDescription>
                    Search for teachers and select subjects you're interested in learning.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="px-6 py-4 space-y-4">
                {/* Search and Filter Section */}
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search" className="flex items-center gap-2 text-sm font-medium">
                      <Search className="h-4 w-4" />
                      Search Teachers
                    </Label>
                    <Input
                      id="search"
                      placeholder="Search by name, ID, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 bg-white"
                    />
                  </div>
                </div>
                {/* Teachers List */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Available Teachers ({filteredTeachers.length})
                  </Label>
                  <ScrollArea className="h-[200px] sm:h-[250px] border rounded-lg p-3 bg-slate-50/50">
                    {filteredTeachers.length > 0 ? (
                      <div className="space-y-3">
                        {filteredTeachers.map((teacher) => (
                          <div
                            key={teacher._id}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              (selectedTeacher )?._id === teacher._id
                                ? "bg-primary/10 border-2 border-primary/30 shadow-sm"
                                : "hover:bg-white border border-transparent bg-white/50"
                            }`}
                            onClick={() => setSelectedTeacher(teacher)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                  <AvatarFallback className="text-sm bg-gradient-to-br from-primary/20 to-primary/10">
                                    {getInitials(teacher.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm truncate">{teacher.name}</p>
                                  <p className="text-xs text-slate-600 truncate">
                                    {teacher.institute && Array.isArray(teacher.institute)
                                      ? teacher.institute.map((inst) => inst.name).join(", ")
                                      : ""}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                   
                                   
                                  </div>
                                </div>
                              </div>
                              {(selectedTeacher)?._id === teacher._id && (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Users className="h-12 w-12 mb-2 opacity-50" />
                        <p className="text-sm font-medium">No teachers found</p>
                        <p className="text-xs">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
                {/* Subject Selection */}
                {selectedTeacher && (
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm bg-primary/20">
                            {getInitials((selectedTeacher ).name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{(selectedTeacher ).name}</p>
                          <p className="text-xs text-slate-600">
                            {(selectedTeacher ).institute && Array.isArray((selectedTeacher ).institute)
                              ? (selectedTeacher).institute.map((ins) => inst.name).join(", ")
                              : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">★ {(selectedTeacher ).rating}</span>
                          </div>
                          <p className="text-xs text-slate-500">{(selectedTeacher).students} students</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{(selectedTeacher).bio}</p>
                    </div>
                    {/* Institute selection for this teacher */}
                    {(selectedTeacher ).institute && Array.isArray((selectedTeacher ).institute) && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <Building2 className="h-4 w-4" />
                          Select Institute
                        </Label>
                        <Select value={selectedInstituteForTeacher} onValueChange={setSelectedInstituteForTeacher}>
                          <SelectTrigger className="h-11 bg-white">
                            <SelectValue placeholder="Select an institute" />
                          </SelectTrigger>
                          <SelectContent>
                            {(selectedTeacher ).institute.map((inst) => (
                              <SelectItem key={inst._id} value={inst._id}>
                                {inst.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {/* Category selection for this teacher */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <BookOpen className="h-4 w-4" />
                        Select Categories
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-lg p-4 bg-white">
                        {availableCategories.map((cat) => (
                          <div key={cat} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`category-${cat}`}
                              checked={selectedCategories.includes(cat)}
                              onChange={() =>
                                setSelectedCategories((prev) =>
                                  prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
                                )
                              }
                            />
                            <label htmlFor={`category-${cat}`} className="text-sm leading-none cursor-pointer flex-1">
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="p-6 pt-0">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button variant="outline" onClick={() => setIsFollowDialogOpen(false)} className="h-12 bg-white">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFollowTeacher}
                    disabled={!selectedTeacher || !selectedInstituteForTeacher}
                    className="flex items-center justify-center gap-2 h-12"
                  >
                    <UserCheck className="h-4 w-4" />
                    Follow Teacher
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {student.followedTeachers?.length > 0 ? (
            student.followedTeachers.map((follow, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
                      <AvatarFallback className="text-sm bg-gradient-to-br from-primary/20 to-primary/10">
                        {getInitials(follow.teacher.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base sm:text-lg text-slate-900 truncate">
                        {follow.teacher.name}
                      </h4>
                      {/* Editable Institute Dropdown */}
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-3 w-3" />
                        <Select
                          value={typeof follow.institute === "object" ? follow.institute._id : follow.institute}
                          onValueChange={(val) => handleEditFollowedTeacher(index, "institute", val)}
                        >
                          <SelectTrigger className="h-8 bg-white border-slate-200">
                            <SelectValue placeholder="Select institute" />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              filteredTeachers.find(
                                (t) =>
                                  (typeof follow.teacher === "object" ? follow.teacher._id : follow.teacher) === t._id,
                              )?.institute || []
                            ).map((inst) => (
                              <SelectItem key={inst._id} value={inst._id}>
                                {inst.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-1">{follow.teacher.uuid}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnfollowTeacher(follow.teacher._id, follow.teacher.name)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 h-10 w-full sm:w-auto"
                  >
                    Unfollow
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Following for {follow.category.length} subject
                    {follow.category.length > 1 ? "s" : ""}:
                  </p>
                  {/* Editable Categories */}
                  <div className="flex flex-wrap gap-2">
                    {["theory", "revision", "paper"].map((cat) => (
                      <label key={cat} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={follow.category.includes(cat)}
                          onChange={(e) => {
                            const newCats = e.target.checked
                              ? [...follow.category, cat]
                              : follow.category.filter((c) => c !== cat)
                            handleEditFollowedTeacher(index, "category", newCats)
                          }}
                        />
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="p-4 bg-slate-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-900">No Teachers Followed Yet</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
                Start following teachers to get personalized content and updates from your favorite educators.
              </p>
              <Button
                onClick={() => {
                  resetFollowDialog()
                  setIsFollowDialogOpen(true)
                }}
                className="flex items-center gap-2 h-12"
              >
                <PlusCircle className="h-4 w-4" />
                Find Teachers to Follow
              </Button>
            </div>
          )}
          {/* Save Followed Teachers Button (now only in teachers tab) */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveFollowedTeachers}
              className="flex items-center justify-center gap-2 h-12 bg-blue-600 text-white"
            >
              <Save className="h-4 w-4" />
              Save Followed Teachers
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
