"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Trophy,
  Calendar,
  BarChart3,
  Users,
  BookOpen,
  GraduationCap,
  Target,
  Clock,
  Star,
  Brain,
} from "lucide-react"
import { Link } from "react-router-dom"
import api from "@/services/api"
import { toast } from "sonner"

export default function StudentResultsPage() {
  const [followedTeachers, setFollowedTeachers] = useState([])
  // Remove teacher select, always use preferred followed teacher
  const [selectedCategory, setSelectedCategory] = useState("")
  const [availableQuizzes, setAvailableQuizzes] = useState([])
  const [results, setResults] = useState([])
  const [donePapers, setDonePapers] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("userData")
    const parsedUser = storedUser ? JSON.parse(storedUser) : null
    setLoggedInUser(parsedUser)
    setFollowedTeachers(parsedUser?.followedTeachers || [])
    // Set default category to first available for preferred teacher
    if (parsedUser && typeof parsedUser.preferredFollowedTeacher === "number") {
      const preferred = parsedUser.followedTeachers?.[parsedUser.preferredFollowedTeacher]
      if (preferred && preferred.category && preferred.category.length > 0) {
        setSelectedCategory(preferred.category[0])
      }
    }
  }, [])

  useEffect(() => {
    if (!loggedInUser || !loggedInUser._id) return
    if (typeof loggedInUser.preferredFollowedTeacher === "number" && selectedCategory) {
      getAvailableQuizzes()
    } else {
      setAvailableQuizzes([])
    }
  }, [loggedInUser, selectedCategory])

  useEffect(() => {
    if (!loggedInUser || !loggedInUser._id) return
    getDonePapers()
    getResults()
  }, [loggedInUser])

  const getDonePapers = async () => {
    if (!loggedInUser || !loggedInUser._id) return
    try {
      console.log("logged in user  form get done papers", loggedInUser)
      const res = await api.get(`/api/submissions/done/${loggedInUser._id}`)
      console.log("Done papers response:", res)
      if (res.status === 200) {
        console.log("Done papers response:", res.data)
        setDonePapers(res.data.paperIds)
      }
    } catch (error) {
      console.error("Error fetching done papers:", error)
    }
  }

  const getResults = async () => {
    if (!loggedInUser || !loggedInUser._id) return
    try {
      const res = await api.get(`/api/submissions/questions/${loggedInUser._id}`)
      if (res.status === 200) {
        console.log("Results response:", res.data)
        setResults(res.data.submissions)
        toast.success("Results fetched successfully")
      }
    } catch (error) {
      console.error("Error fetching results:", error)
      toast.error("Failed to fetch results")
    }
  }

  const getAvailableQuizzes = async () => {
    try {
      setLoading(true)
      const teacherId = getPreferredTeacherId()
      const instituteId = getPreferredInstituteId()
      if (!teacherId || !instituteId) {
        alert("Preferred teacher or institute is missing. Please reload.")
        return
      }
      const res = await api.get(
        `/api/papers/available?teacherId=${teacherId}&category=${selectedCategory}&year=${loggedInUser.year}&instituteId=${instituteId}`,
      )
      if (res.status === 200) {
        setAvailableQuizzes(res.data.papers)
        toast.success(`Found ${res.data.papers.length} available quizzes`)
      }
    } catch (error) {
      console.error("Error fetching available quizzes:", error)
      toast.error("Failed to fetch available quizzes")
    } finally {
      setLoading(false)
    }
  }

  // Always use preferred followed teacher
  const getPreferredFollowedTeacher = () => {
    if (!loggedInUser || typeof loggedInUser.preferredFollowedTeacher !== "number") return null
    // console.log("followed teachers", followedTeachers);
    // console.log("preferred followed teacher", followedTeachers[loggedInUser.preferredFollowedTeacher]);
    return followedTeachers[loggedInUser.preferredFollowedTeacher] || null
  }

  const getPreferredTeacherId = () => {
    const preferred = getPreferredFollowedTeacher()
    // console.log("preferred teacher id", preferred);
    return preferred?.teacher?._id
  }

  const getPreferredInstituteId = () => {
    const preferred = getPreferredFollowedTeacher()
    return preferred?.institute?._id
  }

  const getAvailableCategories = () => {
    const preferred = getPreferredFollowedTeacher()
    return preferred?.category || []
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (percentage) => {
    if (percentage >= 90) return "default"
    if (percentage >= 80) return "secondary"
    if (percentage >= 70) return "outline"
    return "destructive"
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return <Badge className="bg-yellow-500">🥇 1st</Badge>
    if (rank === 2) return <Badge className="bg-gray-400">🥈 2nd</Badge>
    if (rank === 3) return <Badge className="bg-amber-600">🥉 3rd</Badge>
    return <Badge variant="outline">#{rank}</Badge>
  }

  const calculateOverallStats = () => {
    const totalQuizzes = results.length
    const averageScore =
      totalQuizzes > 0 ? results.reduce((sum, result) => sum + result.percentage, 0) / totalQuizzes : 0
    const bestScore = totalQuizzes > 0 ? Math.max(...results.map((r) => r.percentage)) : 0
    const topRanks = results.filter((r) => r.rank <= 3).length
    return { totalQuizzes, averageScore, bestScore, topRanks }
  }

  const stats = calculateOverallStats()

  const isPaperAvailable = (paper) => {
    const now = new Date()
    return paper.availability?.some((avail) => {
      const start = new Date(avail.startTime)
      const end = new Date(avail.endTime)
      //return now >= start && now <= end;
      return now < start
    })
  }

  if (!loggedInUser || !loggedInUser._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-xl">
              <Brain className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <span className="text-lg text-gray-600 font-medium">Loading user data...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              Student Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              View available quizzes and track your progress for your preferred teacher
            </p>
          </div>
        </div>

        {/* Preferred Teacher and Category Switcher */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              Preferred Teacher & Category
            </CardTitle>
            <CardDescription className="text-gray-600">Your preferred teacher and their categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:gap-8">
              <div className="w-full space-y-3">
                <label className="text-sm font-medium block text-gray-700">Teacher</label>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 h-12 flex items-center text-gray-900 font-medium shadow-inner">
                  {getPreferredFollowedTeacher()?.teacher?.name} <span className="mx-2 text-gray-400">|</span>{" "}
                  {getPreferredFollowedTeacher()?.institute?.name}
                </div>
              </div>
              <div className="w-full space-y-3">
                <label className="text-sm font-medium block text-gray-700">Category</label>
                <div className="flex gap-3 flex-wrap">
                  {getAvailableCategories().map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className={`capitalize transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                          : "bg-white/80 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {selectedCategory && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-gray-200/50">
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-1 bg-blue-100 rounded">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Selected:</span>
                  <span className="text-gray-800">{getPreferredFollowedTeacher()?.teacher.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-600 font-medium">{selectedCategory}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-800">{getPreferredFollowedTeacher()?.institute.name}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Quizzes</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalQuizzes}</div>
              <p className="text-xs text-gray-500">Completed assessments</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Average Score</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500">Overall performance</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Best Score</CardTitle>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.bestScore)}`}>{stats.bestScore}%</div>
              <p className="text-xs text-gray-500">Highest achievement</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Followed Teachers</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{followedTeachers.length}</div>
              <p className="text-xs text-gray-500">Active connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Available New Quizzes */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              Available Quizzes
              {selectedCategory && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                  {availableQuizzes.length} available
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {selectedCategory
                ? `Quizzes available for ${getPreferredFollowedTeacher()?.teacher?.name} - ${selectedCategory}`
                : "Select a category to view available quizzes"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!selectedCategory ? (
              <div className="text-center py-12 text-gray-500">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-xl"></div>
                  <BookOpen className="relative h-16 w-16 mx-auto text-blue-400" />
                </div>
                <p className="text-lg font-medium mb-2 text-gray-700">No Selection Made</p>
                <p className="text-gray-600">Please select a category above to view available quizzes</p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-xl"></div>
                  <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading available quizzes...</p>
              </div>
            ) : availableQuizzes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gray-100/50 rounded-full blur-xl"></div>
                  <Calendar className="relative h-16 w-16 mx-auto text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2 text-gray-700">No Quizzes Available</p>
                <p className="text-gray-600">
                  There are no quizzes available for this teacher and category combination
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableQuizzes.map((quiz) => {
                  const isDone = donePapers.includes(quiz._id)
                  const isAvailable = isPaperAvailable(quiz)
                  return (
                    <Card
                      key={quiz._id}
                      className={`transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200/50 ${
                        isDone || !isAvailable
                          ? "opacity-50 pointer-events-none"
                          : "hover:shadow-lg hover:scale-105 cursor-pointer"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                          <div className="p-1 bg-blue-100 rounded">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                          {quiz.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">{quiz.subject}</CardDescription>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {quiz.category}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {quiz.year}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm bg-gray-50/80 p-3 rounded-lg">
                          <span className="text-gray-600">Questions:</span>
                          <span className="font-medium text-gray-800">{quiz.questions.length}</span>
                        </div>
                        {quiz.availability && quiz.availability.length > 0 && (
                          <div className="text-xs text-gray-500 bg-yellow-50/80 p-3 rounded-lg border border-yellow-200/50">
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3" />
                              <span className="font-medium">Available until:</span>
                            </div>
                            <p className="text-gray-700">{new Date(quiz.availability[0].endTime).toLocaleString()}</p>
                          </div>
                        )}
                        <Button
                          className={`w-full mt-4 transition-all duration-300 ${
                            !isDone && isAvailable
                              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                              : "bg-gray-200 text-gray-500"
                          }`}
                          disabled={isDone || !isAvailable}
                          asChild={!isDone && isAvailable}
                        >
                          {!isDone && isAvailable ? (
                            <Link
                              to="/student-quiz"
                              state={{
                                quizId: quiz._id,
                                title: quiz.title,
                                questions: quiz.questions,
                                timeLimit: Math.round((new Date(quiz.endTime) - new Date(quiz.startTime)) / 60000),
                                totalQuestions: quiz.questions.length,
                                subject: quiz.subject,
                              }}
                            >
                              <Star className="h-4 w-4 mr-2" />
                              Start Quiz
                            </Link>
                          ) : (
                            <span>{isDone ? "✓ Completed" : !isAvailable ? "⏰ Not Available" : "Start Quiz"}</span>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Results */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              Quiz Results History
            </CardTitle>
            <CardDescription className="text-gray-600">Your past quiz performances and rankings</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {(() => {
              const filteredResults = results.filter((result) => result.category === selectedCategory)
              if (filteredResults.length === 0) {
                return (
                  <div className="text-center py-12 text-gray-500">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-yellow-100/50 rounded-full blur-xl"></div>
                      <Trophy className="relative h-16 w-16 mx-auto text-yellow-400" />
                    </div>
                    <p className="text-lg font-medium mb-2 text-gray-700">No Results Yet</p>
                    <p className="text-gray-600">Complete some quizzes to see your results here</p>
                  </div>
                )
              }
              return (
                <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50/80 to-gray-100/80">
                        <TableHead className="font-semibold text-gray-700">Quiz Title</TableHead>
                        <TableHead className="font-semibold text-gray-700">Score</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResults.map((result) => (
                        <TableRow key={result._id} className="hover:bg-blue-50/50 transition-colors duration-200">
                          <TableCell className="font-medium text-gray-800">{result.paperTitle}</TableCell>
                          <TableCell>
                            <div className="text-gray-600 font-medium">{"dummy score"}</div>
                            {/* <div className="flex flex-col">
                              <span className="font-bold">
                                {result.score}/{result.answers.length}
                              </span>
                              <span
                                className={`text-sm ${getScoreColor(
                                  result.percentage
                                )}`}
                              >
                                {result.percentage.toFixed(1)}%
                              </span>
                            </div> */}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={result.status === "done" ? "default" : "outline"}
                              className={result.status === "done" ? "bg-green-100 text-green-700 border-green-200" : ""}
                            >
                              {result.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link to={`/student-review/${result._id}`} state={{ result }}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/80 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
