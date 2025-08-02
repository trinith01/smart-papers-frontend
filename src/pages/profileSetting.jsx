"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Users, Settings } from "lucide-react"
import ProfileInformation from "@/components/profile-information"
import FollowedTeachers from "@/components/follwed-teachers"

export default function ProfileSettings() {
  const [student, setStudent] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("userData")
    const parsedUser = storedUser ? JSON.parse(storedUser) : null
    setStudent(parsedUser)
    setLoading(false)
  }, [])

  const updateStudent = (newStudent) => {
    setStudent(newStudent)
    localStorage.setItem("userData", JSON.stringify(newStudent))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-screen">
          <span className="text-lg text-red-500">{error}</span>
        </div>
      ) : !student ? (
        <div className="flex justify-center items-center h-screen">
          <span className="text-lg text-gray-500">No student data found.</span>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Student Profile</h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1">Manage your profile and academic preferences</p>
              </div>
            </div>
          </div>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-white shadow-sm border">
              <TabsTrigger value="profile" className="flex items-center gap-2 text-sm sm:text-base">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile Information</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
              {/* <TabsTrigger value="teachers" className="flex items-center gap-2 text-sm sm:text-base">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Followed Teachers</span>
                <span className="sm:hidden">Teachers</span>
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="profile" className="space-y-6">
              <ProfileInformation student={student} updateStudent={updateStudent} />
            </TabsContent>
            {/* <TabsContent value="teachers" className="space-y-6">
              <FollowedTeachers student={student} updateStudent={updateStudent} />
            </TabsContent> */}
          </Tabs>
        </div>
      )}
    </div>
  )
}
