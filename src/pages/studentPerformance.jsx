"use client"

import { useEffect, useState } from "react"
import api from "@/services/api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import MarksComparisonChart from "@/components/marks-comparison"
import LoadingState from "@/components/student-performance/LoadingState"
import PageHeader from "@/components/student-performance/PageHeader"
import TeacherCategorySelector from "@/components/student-performance/TeacherCategorySelector"
import OverallStats from "@/components/student-performance/OverallStats"
import AvailableQuizzes from "@/components/student-performance/AvailableQuizzes"
import QuizResultsHistory from "@/components/student-performance/QuizResultsHistory"

export default function StudentResultsPage() {
  const [followedTeachers, setFollowedTeachers] = useState([])
  // Remove teacher select, always use preferred followed teacher
  const [selectedCategory, setSelectedCategory] = useState("")
  const [availableQuizzes, setAvailableQuizzes] = useState([])
  const [currentPapers, setCurrentPapers] = useState([])
  const [futurePapers, setFuturePapers] = useState([])
  const [results, setResults] = useState([])
  const [donePapers, setDonePapers] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [graphData, setGraphData] = useState([])

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

  useEffect(() => {
    const getAveragedScores = async () => {
      try {
        const res = await api.get(`/api/submissions/scoresWithAverages/${loggedInUser?._id}`)
        console.log("Averaged scores response:", res.data)
        setGraphData(res.data)
      } catch (error) {
        console.error("Error fetching averaged scores:", error)
      }
    }
    if (loggedInUser && loggedInUser._id) {
      getAveragedScores()
    }
  }, [loggedInUser])

  const getDonePapers = async () => {
    if (!loggedInUser || !loggedInUser._id) return

    try {
      console.log("logged in user  form get done papers", loggedInUser)
      const res = await api.get(`/api/submissions/done/${loggedInUser?._id}`)
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
      console.log("Fetching available quizzes for teacherId:", teacherId, "instituteId:", instituteId, "category:", selectedCategory, "year:", loggedInUser.year)

      const res = await api.get(
        `/api/papers/available?teacherId=${teacherId}&category=${selectedCategory}&year=${loggedInUser.year}&instituteId=${instituteId}`,
      )

      if (res.status === 200) {
        console.log("Available quizzes response:", res.data)
        // Store both current and future papers separately and combined
        const currentQuizzes = res.data.currentPapers || []
        const futureQuizzes = res.data.futurePapers || []
        const allAvailableQuizzes = [...currentQuizzes, ...futureQuizzes]
        
        setCurrentPapers(currentQuizzes)
        setFuturePapers(futureQuizzes)
        setAvailableQuizzes(allAvailableQuizzes)
        toast.success(`Found ${allAvailableQuizzes.length} available quizzes (${currentQuizzes.length} current, ${futureQuizzes.length} upcoming)`)
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
    console.log("preferred teacher id", preferred);
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



  const calculateOverallStats = () => {
    const totalQuizzes = results.length
    const averageScore =
      totalQuizzes > 0 ? results.reduce((sum, result) => sum + result.score, 0) / totalQuizzes : 0
    const bestScore = totalQuizzes > 0 ? Math.max(...results.map((r) => r.score)) : 0

    return { totalQuizzes, averageScore, bestScore }
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
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
        <PageHeader />

        <TeacherCategorySelector 
          preferredTeacher={getPreferredFollowedTeacher()}
          availableCategories={getAvailableCategories()}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <OverallStats 
          stats={stats}
          followedTeachersCount={followedTeachers.length}
        />
        
        <MarksComparisonChart data={graphData} />

        <AvailableQuizzes 
          availableQuizzes={availableQuizzes}
          donePapers={donePapers}
          selectedCategory={selectedCategory}
          preferredTeacher={getPreferredFollowedTeacher()}
          loading={loading}
        />

        <QuizResultsHistory 
          results={results}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  )
}
