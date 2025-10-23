"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, BookOpen, Eye, EyeOff, GraduationCap, Users } from "lucide-react"
import { auth } from "./firabase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { toast } from "sonner"
import api from "@/services/api"
import ReactSelect from "react-select"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
// const INSTITUTES = [
//   { name: "Viduna", location: "Galle", _id: "686914bf3700d5d526983c52" },
//   { name: "Vidarsha", location: "Galle", _id: "686914bf3700d5d526983c53" },
//   { name: "Tigma", location: "Galle", _id: "686914bf3700d5d526983c54" },
//   { name: "Dekma", location: "Matara", _id: "686914bf3700d5d526983c55" },
//   { name: "Apeiro", location: "Matara", _id: "686914bf3700d5d526983c56" },
// ]

const SUBJECT_OPTIONS = ["Physics", "Chemistry", "Pure-Maths", "Applied Maths", "Biology"]

const CATEGORY_OPTIONS = [


  { value: "paper", label: "📝 Paper" },
]

export default function Register() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState("student")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    year: "",
    category: "",
    teacher: "",
    subjects: "",
    institute: userType === "teacher" ? [] : "",
  })
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  const [studentFollowedTeachers, setStudentFollowedTeachers] = useState([
    { institute: "", teacher: "", category: [] }
  ])
  const [INSTITUTES, setINSTITUTES] = useState([])

  useEffect( ()=>{
    const fetchInstitutes = async () => {
      try {
        const response = await api.get("/api/institutes")
        console.log("Fetched institutes:", response.data)
        setINSTITUTES(response.data)
      } catch (error) {
        console.error("Error fetching institutes:", error)
      }
    }

    fetchInstitutes()
  } , [])
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true)
      try {
        const response = await api.get("/api/teachers")
        console.log("Fetched teachers:", response.data)
        setTeachers(response.data|| [])
      } catch (error) {
        console.error("Error fetching teachers:", error)
        toast.error("Failed to load teachers")
      } finally {
        setLoadingTeachers(false)
      }
    }

    fetchTeachers()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Reset teacher selection when institute changes for students
      if (field === "institute" && userType === "student") {
        newData.teacher = ""
      }

      return newData
    })

    // Clear errors when user starts typing/selecting
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (generalError) {
      setGeneralError("")
    }
  }

  const handleStudentFollowedTeacherChange = (idx, field, value) => {
    setStudentFollowedTeachers((prev) => {
      const updated = [...prev]
      updated[idx][field] = value
      // Reset teacher and category if institute changes
      if (field === "institute") {
        updated[idx]["teacher"] = ""
        updated[idx]["category"] = []
      }
      return updated
    })
  }

  const addFollowedTeacher = () => {
    setStudentFollowedTeachers((prev) => [...prev, { institute: "", teacher: "", category: [] }])
  }

  const removeFollowedTeacher = (idx) => {
    setStudentFollowedTeachers((prev) => prev.filter((_, i) => i !== idx))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    else if (formData.name.length < 4) newErrors.name = "Name must be at least 4 characters"
    else if (!/^[A-Za-z\s]+$/.test(formData.name)) newErrors.name = "Name can only contain letters and spaces"

    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"


    if (userType === "student") {
      if (!formData.year) newErrors.year = "Please select your academic year"
      else {
        const yearNum = Number(formData.year)
        const currentYear = new Date().getFullYear()
        if (isNaN(yearNum) || !Number.isInteger(yearNum)) newErrors.year = "Year must be a valid number"
        else if (yearNum < 0) newErrors.year = "Year cannot be negative"
        else if (yearNum < currentYear - 10 || yearNum > currentYear + 10)
          newErrors.year = `Year must be within 10 years of ${currentYear}`
      }
      studentFollowedTeachers.forEach((ft, idx) => {
        if (!ft.institute) newErrors[`followedTeachers_${idx}_institute`] = "Please select an institute"
        if (!ft.teacher) newErrors[`followedTeachers_${idx}_teacher`] = "Please select a teacher"
        if (!ft.category || ft.category.length === 0) newErrors[`followedTeachers_${idx}_category`] = "Please select at least one category"
      })
    } else if (userType === "teacher") {
      if (!formData.subjects || (Array.isArray(formData.subjects) && formData.subjects.length === 0))
        newErrors.subjects = "Please select the subjects you teach"
      if (!formData.institute || (Array.isArray(formData.institute) && formData.institute.length === 0))
        newErrors.institute = "Please select at least one institute"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setGeneralError("")
      try {
        console.log("Form submitted:", formData)
        await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        const user = auth.currentUser
        console.log("User created:", user)

        let payload
        if (userType === "student") {
          payload = {
            name: formData.name,
            uuid: user.uid,
            
            
            email: formData.email,
            year: formData.year,
            followedTeachers: studentFollowedTeachers.map(ft => ({
              teacher: ft.teacher,
              institute: ft.institute,
              category: ft.category
            }))
          }
        } else {
          payload = {
            name: formData.name,
            email: formData.email,
            uuid: user.uid,
            
            
            subjects:
              typeof formData.subjects === "string"
                ? formData.subjects
                : Array.isArray(formData.subjects)
                  ? formData.subjects.join(", ")
                  : "",
            institute: Array.isArray(formData.institute) ? formData.institute : [formData.institute],
          }
        }

        const endpoint = userType === "student" ? "/api/students" : "/api/teachers"
        console.log("Payload to send:", payload)
        const res = await api.post(endpoint, payload)
      
        const  respond = await api.post("/api/setUserRole", { uid: user.uid, role: userType })
        console.log("User role set response:", respond.data)

        toast.success("Account created successfully")
    
         navigate("/")
      } catch (error) {
        console.error("Registration error:", error)
        
        let errorMsg = "Something went wrong. Please try again."
        
        // Handle Firebase Auth errors
        if (error?.code) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMsg = "This email is already registered. Please use a different email or try signing in."
              break
            case 'auth/weak-password':
              errorMsg = "Password is too weak. Please choose a stronger password (at least 6 characters)."
              break
            case 'auth/invalid-email':
              errorMsg = "Please enter a valid email address."
              break
            case 'auth/operation-not-allowed':
              errorMsg = "Email/password accounts are not enabled. Please contact support."
              break
            case 'auth/network-request-failed':
              errorMsg = "Network error. Please check your internet connection and try again."
              break
            case 'auth/too-many-requests':
              errorMsg = "Too many unsuccessful attempts. Please wait a moment before trying again."
              break
            default:
              errorMsg = `Authentication error: ${error.message}`
              break
          }
        }
        // Handle API/Network errors
        else if (error?.response) {
          // API returned an error response
          const status = error.response.status
          const data = error.response.data
          
          if (status === 400) {
            errorMsg = data?.error || data?.message || "Invalid data provided. Please check your information and try again."
          } else if (status === 409) {
            errorMsg = data?.error || "This email or information is already registered. Please use different details."
          } else if (status === 422) {
            errorMsg = data?.error || "Please check all required fields and try again."
          } else if (status === 500) {
            errorMsg = "Server error. Please try again in a few moments."
          } else if (status >= 500) {
            errorMsg = "Server is temporarily unavailable. Please try again later."
          } else {
            errorMsg = data?.error || data?.message || `Error ${status}: Please try again.`
          }
        }
        // Handle network/connection errors
        else if (error?.request) {
          errorMsg = "Unable to connect to the server. Please check your internet connection and try again."
        }
        // Handle other errors
        else if (error?.message) {
          if (error.message.includes('Network Error')) {
            errorMsg = "Network error. Please check your internet connection and try again."
          } else if (error.message.includes('timeout')) {
            errorMsg = "Request timed out. Please check your connection and try again."
          } else {
            errorMsg = `Error: ${error.message}`
          }
        }

        if (!error?.code) {
          // non-Firebase errors. rollback user creation
          try {
            const user = auth.currentUser
            if (user) {
              await user.delete()
            }
          } catch {
            errorMsg = "Account creation failed failed. Please contact support."
          }
        }
        
        setGeneralError(errorMsg)
        toast.error(errorMsg, {
          duration: 6000,
          position: 'top-center',
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleUserTypeChange = (value) => {
    setUserType(value)
    setFormData((prev) => ({
      ...prev,
      institute: value === "teacher" ? [] : "",
      subjects: "",
      year: "",
      category: "",
      teacher: "",
    }))
    setErrors({})
    setGeneralError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Platform</h1>
          <p className="text-gray-600">Create your account and start learning today</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Choose your account type and fill in your details
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* General Error Alert */}
            {generalError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {generalError}
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        type="button"
                        onClick={() => setGeneralError("")}
                        className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                      >
                        <span className="sr-only">Dismiss</span>
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Type Selection */}
            <Tabs value={userType} onValueChange={handleUserTypeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student
                </TabsTrigger>
                {/* <TabsTrigger value="teacher" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Teacher
                </TabsTrigger> */}
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`transition-all duration-200 ${
                          errors.name ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
                        }`}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`transition-all duration-200 ${
                          errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
                        }`}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={`pr-10 transition-all duration-200 ${
                            errors.password ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className={`pr-10 transition-all duration-200 ${
                            errors.confirmPassword ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                <Separator />

           
                

                <Separator />

                {/* Role-specific fields */}
                <TabsContent value="student" className="space-y-4 mt-0">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                        Academic Year
                      </Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => handleInputChange("year", value)}
                      >
                        <SelectTrigger
                          className={`transition-all duration-200 ${
                            errors.year ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
                          }`}
                        >
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                        <SelectContent>
                         
                          <SelectItem value="2025">2025</SelectItem>
                   
                        </SelectContent>
                      </Select>
                      {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                    </div>
                     {/* <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Category (Select multiple)
                      </Label>
                      <ReactSelect
                        isMulti
                        name="category"
                        options={CATEGORY_OPTIONS}
                        value={CATEGORY_OPTIONS.filter(opt => formData.category && formData.category.includes(opt.value))}
                        onChange={selected => handleInputChange("category", selected ? selected.map(opt => opt.value) : [])}
                        classNamePrefix="react-select"
                        placeholder="Select categories..."
                        className={errors.category ? "border-red-500" : ""}
                      />
                      {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                    </div>  */}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Teacher</Label>
                    {studentFollowedTeachers.map((ft, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-2 items-center mb-2">
                        <div className="w-full md:w-1/3">
                          <Select
                            value={ft.institute}
                            onValueChange={value => handleStudentFollowedTeacherChange(idx, "institute", value)}
                          >
                            <SelectTrigger className={`transition-all duration-200 ${errors[`followedTeachers_${idx}_institute`] ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}>
                              <SelectValue placeholder="Select institute" />
                            </SelectTrigger>
                            <SelectContent>
                              {INSTITUTES.map(inst => (
                                <SelectItem key={inst._id} value={inst._id}>{inst.name} ({inst.location})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[`followedTeachers_${idx}_institute`] && <p className="text-xs text-red-500">{errors[`followedTeachers_${idx}_institute`]}</p>}
                        </div>
                        <div className="w-full md:w-1/3">
                          <Select
                            value={ft.teacher}
                            onValueChange={value => handleStudentFollowedTeacherChange(idx, "teacher", value)}
                            disabled={!ft.institute}
                          >
                            <SelectTrigger className={`transition-all duration-200 ${errors[`followedTeachers_${idx}_teacher`] ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}>
                              <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {teachers.filter(t =>
                                !ft.institute ||
                                (Array.isArray(t.institute) && t.institute.some(inst =>
                                  (typeof inst === 'object' && inst._id === ft.institute) ||
                                  (typeof inst === 'string' && inst === ft.institute)
                                ))
                              ).map(t => (
                                <SelectItem key={t._id} value={t._id}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{t.name}</span>
                                    <span className="text-xs text-gray-500">{t.subjects}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[`followedTeachers_${idx}_teacher`] && <p className="text-xs text-red-500">{errors[`followedTeachers_${idx}_teacher`]}</p>}
                        </div>
                        <div className="w-full md:w-1/3">
                          <ReactSelect
                            isMulti
                            name={`category_${idx}`}
                            options={CATEGORY_OPTIONS}
                            value={CATEGORY_OPTIONS.filter(opt => ft.category && ft.category.includes(opt.value))}
                            onChange={selected => handleStudentFollowedTeacherChange(idx, "category", selected ? selected.map(opt => opt.value) : [])}
                            classNamePrefix="react-select"
                            placeholder="Select categories..."
                            className={errors[`followedTeachers_${idx}_category`] ? "border-red-500" : ""}
                          />
                          {errors[`followedTeachers_${idx}_category`] && <p className="text-xs text-red-500">{errors[`followedTeachers_${idx}_category`]}</p>}
                        </div>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeFollowedTeacher(idx)} disabled={studentFollowedTeachers.length === 1} className="mt-2 md:mt-0">Remove</Button>
                      </div>
                    ))}
                    {/* <Button type="button" variant="outline" size="sm" onClick={addFollowedTeacher} className="mt-2">+ Add Institute/Teacher</Button> */}
                  </div>
                </TabsContent>

                <TabsContent value="teacher" className="space-y-4 mt-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Teacher Details</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjects" className="text-sm font-medium text-gray-700">
                      Subjects (Select multiple)
                    </Label>
                    <Select
                      multiple
                      value={formData.subjects}
                      onValueChange={(values) => handleInputChange("subjects", values)}
                    >
                      <SelectTrigger
                        className={`transition-all duration-200 ${
                          errors.subjects ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
                        }`}
                      >
                        <SelectValue placeholder="Select subjects you teach" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECT_OPTIONS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subjects && <p className="text-sm text-red-500">{errors.subjects}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institute" className="text-sm font-medium text-gray-700">
                      Institutes (Select multiple)
                    </Label>
                    <ReactSelect
                      isMulti
                      name="institute"
                      options={INSTITUTES.map(inst => ({
                        value: inst._id,
                        label: `${inst.name} (${inst.location})`
                      }))}
                      value={INSTITUTES.filter(inst => 
                        formData.institute && 
                        Array.isArray(formData.institute) && 
                        formData.institute.includes(inst._id)
                      ).map(inst => ({
                        value: inst._id,
                        label: `${inst.name} (${inst.location})`
                      }))}
                      onChange={(selected) => 
                        handleInputChange("institute", selected ? selected.map(opt => opt.value) : [])
                      }
                      classNamePrefix="react-select"
                      placeholder="Select institutes where you teach..."
                      className={errors.institute ? "border-red-500" : ""}
                    />
                    {errors.institute && <p className="text-sm text-red-500">{errors.institute}</p>}
                  </div>
                </TabsContent>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Tabs>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link  to = "/"className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}