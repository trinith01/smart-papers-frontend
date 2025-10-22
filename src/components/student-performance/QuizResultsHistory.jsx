"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Trophy, Eye } from "lucide-react"

export default function QuizResultsHistory({ results, selectedCategory }) {
  const getRankBadge = (rank) => {
    if (rank === 1) return <Badge className="bg-yellow-500">🥇 1st</Badge>
    if (rank === 2) return <Badge className="bg-gray-400">🥈 2nd</Badge>
    if (rank === 3) return <Badge className="bg-amber-600">🥉 3rd</Badge>
    return <Badge variant="outline">#{rank}</Badge>
  }

  // Always show all results - users should see their complete quiz history
  // regardless of the currently selected category filter
  const finalResults = results

  if (finalResults.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-600" />
            </div>
            Quiz Results History
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Your complete quiz history across all categories
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-yellow-100/50 rounded-full blur-xl"></div>
              <Trophy className="relative h-12 w-12 sm:h-16 sm:w-16 mx-auto text-yellow-400" />
            </div>
            <p className="text-base sm:text-lg font-medium mb-2 text-gray-700">No Results Yet</p>
            <p className="text-gray-600 text-sm sm:text-base">Complete some quizzes to see your results here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-gray-800 text-lg sm:text-xl">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Trophy className="h-5 w-5 text-yellow-600" />
          </div>
          Quiz Results History
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          Your past quiz performances and rankings
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {finalResults.map((result) => (
              <Card key={result._id} className="bg-white/80 border-gray-200/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 text-sm break-words flex-1 mr-2">
                      {result.paperTitle}
                    </h3>
                    <Badge
                      variant={result.status === "done" ? "default" : "outline"}
                      className={`text-xs ${result.status === "done" ? "bg-green-100 text-green-700 border-green-200" : ""}`}
                    >
                      {result.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score:</span>
                      <span className={`font-medium ${
                        parseFloat(result.score) >= 90 ? 'text-green-600' :
                        parseFloat(result.score) >= 80 ? 'text-blue-600' :
                        parseFloat(result.score) >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {result.score}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="text-gray-600">{result.totalQuestions}</span>
                    </div>
                  </div>
                  

                  
                  {(result.islandRank || result.districtRank) && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {result.islandRank && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Island:</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                            #{result.islandRank}
                          </Badge>
                        </div>
                      )}
                      {result.districtRank && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">District:</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                            #{result.districtRank}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-600">{new Date(result.submittedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <Link to={`/student-review/${result._id}`} state={{ result }} className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white/80 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50/80 to-gray-100/80">
                    <TableHead className="font-semibold text-gray-700">Quiz Title</TableHead>
                    <TableHead className="font-semibold text-gray-700">Score</TableHead>
                    <TableHead className="font-semibold text-gray-700">Questions</TableHead>
                    <TableHead className="font-semibold text-gray-700">Island Rank</TableHead>
                    <TableHead className="font-semibold text-gray-700">District Rank</TableHead>
                    <TableHead className="font-semibold text-gray-700">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalResults.map((result) => (
                    <TableRow key={result._id} className="hover:bg-blue-50/50 transition-colors duration-200">
                      <TableCell className="font-medium text-gray-800 max-w-[200px]">
                        <div className="break-words">{result.paperTitle}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            parseFloat(result.score) >= 90 ? 'text-green-600' :
                            parseFloat(result.score) >= 80 ? 'text-blue-600' :
                            parseFloat(result.score) >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {result.score}%
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round((parseFloat(result.score) / 100) * result.totalQuestions)}/{result.totalQuestions}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {result.totalQuestions}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {result.islandRank ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            #{result.islandRank}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Not ranked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.districtRank ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            #{result.districtRank}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Not ranked</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={result.status === "done" ? "default" : "outline"}
                          className={
                            result.status === "done" ? "bg-green-100 text-green-700 border-green-200" : ""
                          }
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
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
