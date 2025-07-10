"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import api from "@/services/api"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  FileText,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  PieChartIcon,
  Calendar,
  Award,
  Brain,
  Loader2,
  Filter,
  Activity,
} from "lucide-react"

const institutes = [
  { _id: "inst1", name: "Royal College" },
  { _id: "inst2", name: "Ananda College" },
  { _id: "inst3", name: "Visakha Vidyalaya" },
]

const COLORS = [
  "hsl(210, 100%, 56%)", // blue
  "hsl(48, 100%, 67%)", // yellow
  "hsl(171, 100%, 41%)", // green
  "hsl(348, 100%, 61%)", // red
  "hsl(286, 100%, 60%)", // purple
  "hsl(10, 80%, 50%)", // orange-red
]

export default function PaperAnalysisDashboard() {
  const [papers, setPapers] = useState([])
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [selectedPaper, setSelectedPaper] = useState("")
  const [selectedInstitute, setSelectedInstitute] = useState("all")
  const [selectedPaperId, setSelectedPaperId] = useState("")
  const [loading, setLoading] = useState(false)
  const [paperOverview, setPaperOverview] = useState({
    avgScore: 0,
    max: 0,
    min: 0,
    total: 0,
    difficulty: "N/A",
  })
  const [institutePerformance, setInstitutePerformance] = useState([])
  const [categoryAccuracy, setCategoryAccuracy] = useState([])
  const [submissionTimeline, setSubmissionTimeline] = useState([])
  const [questionWiseAccuracy, setQuestionWiseAccuracy] = useState([])
  const [trendN, setTrendN] = useState("10")
  const [trendData, setTrendData] = useState([])
  const [institutes, setInstitutes] = useState([])

  // 1. Fetch papers list for logged-in teacher
  useEffect(() => {
    const fetchPapers = async () => {
      const user = JSON.parse(localStorage.getItem("userData"))
      setLoggedInUser(user)
      try {
        const res = await api.get(`/api/analysis/papers/${user._id}`)
        setPapers(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        toast.error("Failed to fetch papers")
        console.error(err)
      }
    }
    fetchPapers()
  }, [])

  useEffect(() => {
    if (!selectedPaperId) return
    const fetchPaperOverview = async () => {
      try {
        setLoading(true)
        const [overviewRes, instituteStatsRes, categoryAccuracyRes, timelineRes, questionWiseRes] = await Promise.all([
          api.get(`/api/analysis/paper/${selectedPaperId}/overview`),
          api.get(`/api/analysis/paper/${selectedPaperId}/institute`),
          api.get(`/api/analysis/paper/${selectedPaperId}/category-accuracy`),
          api.get(`/api/analysis/paper/${selectedPaperId}/timeline`),
          api.get(`/api/analysis/paper/${selectedPaperId}/question-wise`),
        ])

        setPaperOverview(overviewRes.data)
        // Directly use the data as-is, parsing avgScore to number
        const rawStats = instituteStatsRes.data.map((item) => ({
          ...item,
          avgScore: Number.parseFloat(item.avgScore),
        }))
        console.log("✅ Mapped Institute Stats:", rawStats)
        setInstitutePerformance(rawStats)

        const formattedCategoryAccuracy = categoryAccuracyRes.data.map((item, i) => ({
          category: item.category,
          accuracy: Number.parseFloat(item.accuracy),
          fill: COLORS[i % COLORS.length],
        }))
        console.log("✅ Mapped Category Stats:", formattedCategoryAccuracy)
        setCategoryAccuracy(formattedCategoryAccuracy)

        console.log("✅ Submission Timeline:", timelineRes.data)
        setSubmissionTimeline(timelineRes.data)

        const formattedQuestionWise = questionWiseRes.data.map((q, idx) => ({
          ...q,
          index: idx + 1,
          accuracy: Number.parseFloat(q.accuracy),
        }))
        console.log("✅ Mapped question-wise data:", formattedQuestionWise)
        setQuestionWiseAccuracy(formattedQuestionWise)
      } catch (err) {
        toast.error("Failed to fetch paper analytics")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPaperOverview()
  }, [selectedPaperId])

  useEffect(() => {
    const fetchTrendData = async () => {
      if (!loggedInUser?._id) return
      try {
        const res = await api.get(`/api/analysis/paper/recent-category-analysis/${loggedInUser._id}?limit=${trendN}`)
        setInstitutes(loggedInUser.institute)
        setTrendData(res.data)
      } catch (error) {
        console.error("Failed to fetch recent category analysis:", error)
        toast.error("Failed to load category performance trend")
      }
    }
    fetchTrendData()
  }, [trendN, loggedInUser])

  // Example handler to change selected paper
  const handlePaperSelect = (event) => {
    setSelectedPaperId(event.target.value) // assuming you have a dropdown
  }

  // To confirm paper state actually updated
  useEffect(() => {
    console.log("Papers state updated:", papers)
  }, [papers])

  useEffect(() => {
    console.log("📄 Selected Paper ID Changed:", selectedPaperId)
  }, [selectedPaperId])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500 text-white"
      case "moderate":
        return "bg-yellow-500 text-white"
      case "hard":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const filteredInstitutePerformance =
    selectedInstitute === "all"
      ? institutePerformance
      : institutePerformance.filter((inst) => inst.instituteId === selectedInstitute)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              Paper Analysis Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive analytics for paper performance and insights</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
              Analysis Filters
            </CardTitle>
            <CardDescription className="text-gray-600">
              Select paper and institute to view detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paper Select */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Select a Paper</label>
                <Select
                  value={selectedPaper}
                  onValueChange={(value) => {
                    setSelectedPaper(value)
                    setSelectedPaperId(value)
                  }}
                >
                  <SelectTrigger className="bg-white/80 border-gray-300/50 hover:bg-white hover:border-blue-300 transition-all duration-300 rounded-xl h-12">
                    <SelectValue placeholder="Choose a paper..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-xl rounded-xl">
                    {papers.map((paper) => (
                      <SelectItem key={paper._id} value={paper._id} className="hover:bg-blue-50/80">
                        {paper.title} ({paper.subject})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Institute Select */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Filter by Institute (Optional)</label>
                <Select value={selectedInstitute} onValueChange={setSelectedInstitute}>
                  <SelectTrigger className="bg-white/80 border-gray-300/50 hover:bg-white hover:border-blue-300 transition-all duration-300 rounded-xl h-12">
                    <SelectValue placeholder="All Institutes" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-xl rounded-xl">
                    <SelectItem value="all" className="hover:bg-blue-50/80">
                      All Institutes
                    </SelectItem>
                    {institutes.map((institute) => (
                      <SelectItem key={institute._id} value={institute._id} className="hover:bg-blue-50/80">
                        {institute.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-xl">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                  <p className="text-gray-600 mt-4 font-medium">Loading analytics...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paper Overview */}
        {selectedPaperId && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Average Score</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{paperOverview.avgScore}</div>
                <p className="text-xs text-gray-500">out of {paperOverview.max}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Attempts</CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{paperOverview.total}</div>
                <p className="text-xs text-gray-500">student submissions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Highest Score</CardTitle>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{paperOverview.max}</div>
                <p className="text-xs text-gray-500">best performance</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Lowest Score</CardTitle>
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{paperOverview.min}</div>
                <p className="text-xs text-gray-500">needs improvement</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Difficulty</CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <Badge className={`${getDifficultyColor(paperOverview.difficulty)} shadow-sm`}>
                  {paperOverview.difficulty}
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Row 1 */}
        {selectedPaperId && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Institute-Wise Performance */}
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  Institute-Wise Performance
                </CardTitle>
                <CardDescription className="text-gray-600">Average scores by institute</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ChartContainer
                  config={{
                    avgScore: {
                      label: "Average Score",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredInstitutePerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="instituteId" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Category-Wise Accuracy */}
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PieChartIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  Category-Wise Accuracy
                </CardTitle>
                <CardDescription className="text-gray-600">Performance breakdown by category</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ChartContainer
                  config={{
                    accuracy: {
                      label: "Accuracy %",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryAccuracy}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, accuracy }) => `${category}: ${accuracy.toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="accuracy"
                      >
                        {categoryAccuracy.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submission Timeline */}
        {selectedPaperId && !loading && (
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                Submission Timeline
              </CardTitle>
              <CardDescription className="text-gray-600">Daily submission count over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer
                config={{
                  count: {
                    label: "Submissions",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={submissionTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="var(--color-count)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-count)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Question-Wise Accuracy Table */}
        {selectedPaperId && !loading && (
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50/50 to-yellow-50/50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
                Question-Wise Accuracy
              </CardTitle>
              <CardDescription className="text-gray-600">
                Detailed breakdown of each question's performance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50/80 to-gray-100/80">
                      <TableHead className="font-semibold text-gray-700">Question #</TableHead>
                      <TableHead className="font-semibold text-gray-700">Category</TableHead>
                      <TableHead className="font-semibold text-gray-700">Total Attempts</TableHead>
                      <TableHead className="font-semibold text-gray-700">Correct</TableHead>
                      <TableHead className="font-semibold text-gray-700">Accuracy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionWiseAccuracy.map((question) => (
                      <TableRow
                        key={question.questionId}
                        className="hover:bg-blue-50/50 transition-colors duration-200"
                      >
                        <TableCell className="font-medium text-gray-800">{question.index}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {question.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">{question.total}</TableCell>
                        <TableCell className="text-gray-700">{question.correct}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium px-2 py-1 rounded-lg text-sm ${
                                question.accuracy >= 70
                                  ? "text-green-700 bg-green-50"
                                  : question.accuracy >= 50
                                    ? "text-yellow-700 bg-yellow-50"
                                    : "text-red-700 bg-red-50"
                              }`}
                            >
                              {question.accuracy.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last N Papers Trend */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              Category Performance Trend
            </CardTitle>
            <CardDescription className="text-gray-600">
              Performance across last {trendN} papers (sorted by accuracy)
            </CardDescription>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-medium text-gray-700">Show last:</span>
              <Select value={trendN} onValueChange={setTrendN}>
                <SelectTrigger className="w-20 bg-white/80 border-gray-300/50 hover:bg-white hover:border-blue-300 transition-all duration-300 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-xl rounded-xl">
                  <SelectItem value="5" className="hover:bg-blue-50/80">
                    5
                  </SelectItem>
                  <SelectItem value="10" className="hover:bg-blue-50/80">
                    10
                  </SelectItem>
                  <SelectItem value="20" className="hover:bg-blue-50/80">
                    20
                  </SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">papers</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {trendData
                .sort((a, b) => Number.parseFloat(a.accuracy) - Number.parseFloat(b.accuracy))
                .map((category, index) => (
                  <div
                    key={category.category}
                    className="flex items-center justify-between p-6 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                          index === 0
                            ? "bg-red-100 text-red-800 border-2 border-red-200"
                            : index === 1
                              ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-200"
                              : "bg-green-100 text-green-800 border-2 border-green-200"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">{category.category}</h4>
                        <p className="text-sm text-gray-600">
                          {category.correct}/{category.total} correct answers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold mb-2 ${
                          Number.parseFloat(category.accuracy) >= 70
                            ? "text-green-600"
                            : Number.parseFloat(category.accuracy) >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {category.accuracy}%
                      </div>
                      <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full transition-all duration-500 ${
                            Number.parseFloat(category.accuracy) >= 70
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : Number.parseFloat(category.accuracy) >= 50
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                : "bg-gradient-to-r from-red-400 to-red-500"
                          }`}
                          style={{ width: `${category.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
