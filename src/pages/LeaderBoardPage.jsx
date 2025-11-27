import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Medal, TrendingDown, Users, BookOpen, Target, AlertCircle, Loader2, Award, Clock, BarChart3, Crown, Star, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import api from '@/services/api';
import { useParams } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';

// Sample data for demonstration


export default function LeaderBoardPage() {
  const {paperId} = useParams();
  const [paperStats, setPaperStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsNotReady, setStatsNotReady] = useState(false);
  const [paperInfo, setPaperInfo] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openImageDialog = (imageSrc, imageTitle) => {
    setSelectedImage({ src: getImageUrl(imageSrc), title: imageTitle });
    setIsDialogOpen(true);
  };

  const closeImageDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        if (!autoRefresh) setLoading(true);
        setError(null);
        setStatsNotReady(false);
        
        const response = await api.get(`/api/paperStats/${paperId}`);
        console.log("Paper ID:", paperId);
        console.log("API Response:", response);
        const result = response.data;
        
        // Handle case when stats are not ready
        if (result.statsNotReady) {
          setStatsNotReady(true);
          setPaperInfo(result.data);
          setAutoRefresh(true);
        } else if (result.ok && result.data) {
          setPaperStats(result.data);
          setAutoRefresh(false);
        } else {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
      } catch (err) {
        setError(err.message);
        setAutoRefresh(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [paperId]);

  // Auto-refresh effect when stats are not ready
  useEffect(() => {
    let interval;
    let countdownInterval;
    
    if (statsNotReady && paperInfo?.statsAvailableAt) {
      const availableTime = new Date(paperInfo.statsAvailableAt).getTime();
      
      // Update countdown every second
      const updateCountdown = () => {
        const now = new Date().getTime();
        const timeDiff = availableTime - now;
        
        if (timeDiff <= 0) {
          setCountdown("Available now! Refreshing...");
          setTimeout(() => window.location.reload(), 1000);
          return;
        }
        
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        if (minutes > 0) {
          setCountdown(`Available in ${minutes}m ${seconds}s`);
        } else {
          setCountdown(`Available in ${seconds}s`);
        }
      };
      
      // Initial countdown update
      updateCountdown();
      
      // Update countdown every second
      countdownInterval = setInterval(updateCountdown, 1000);
      
      // Check for availability every 5 seconds
      interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeRemaining = availableTime - currentTime;
        
        if (timeRemaining <= 0) {
          window.location.reload();
        }
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [statsNotReady, paperInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="h-20 w-20 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-20 animate-ping"></div>
              <Loader2 className="h-20 w-20 animate-spin text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Loading Leaderboard</h3>
            <p className="text-slate-600">Fetching the latest rankings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-2xl shadow-xl">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Error Loading Leaderboard</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (statsNotReady && paperInfo) {
    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };



    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Leaderboard Processing
              </CardTitle>
              <CardDescription className="text-base text-slate-600 space-y-2">
                <div>{paperInfo.paper?.title}</div>
                {paperInfo.paper?.is_paid && (
                  <Badge variant="default" className="bg-yellow-600">Paid Paper</Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-800 font-semibold">
                  Stats Not Ready Yet
                </AlertTitle>
                <AlertDescription className="text-blue-700 mt-2">
                  {paperInfo.message}
                </AlertDescription>
              </Alert>
              
              {paperInfo.paperEndTime && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-slate-200 bg-slate-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Paper Ended At
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-semibold text-slate-800">
                          {formatTime(paperInfo.paperEndTime)}
                        </p>
                      </CardContent>
                    </Card>
                    
                    {paperInfo.statsAvailableAt && (
                      <Card className="border-green-200 bg-green-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-green-600 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Stats Available
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p className="text-lg font-semibold text-green-800">
                          {countdown || "Calculating..."}
                        </p>
                          <p className="text-sm text-green-600 mt-1">
                            {formatTime(paperInfo.statsAvailableAt)}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
                >
                  Refresh Page
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!paperStats) return null;

  const { paper, questionResultsSorted, overallLeaderboard, instituteLeaderboards } = paperStats;

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-sm font-bold text-slate-600">#{rank}</span>;
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "text-green-600 font-bold";
    if (percentage >= 75) return "text-blue-600 font-bold";
    if (percentage >= 50) return "text-orange-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const chartData = questionResultsSorted.slice(0, 10).map(q => ({
    question: `Q${q.questionIndex + 1}`,
    incorrect: q.totalIncorrect,
  }));

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16'];

  const avgScore = (overallLeaderboard.reduce((acc, s) => acc + s.score, 0) / overallLeaderboard.length).toFixed(1);
  const perfectScores = overallLeaderboard.filter(s => s.score === paper.questionsCount).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-12 text-white">
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-10 w-10 text-yellow-300" />
                  <h1 className="text-5xl font-bold">{paper.title}</h1>
                </div>
                <div className="flex items-center gap-6 text-blue-100 flex-wrap">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    <BookOpen className="h-5 w-5" />
                    <span className="font-medium">{paper.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Target className="h-5 w-5" />
                    <span className="font-medium">{paper.questionsCount} Questions</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{overallLeaderboard.length} Participants</span>
                  </div>
                  {paper.is_paid && (
                    <div className="flex items-center gap-2 bg-yellow-400/20 px-4 py-2 rounded-full backdrop-blur-sm border border-yellow-400/30">
                      <span className="font-medium">Paid Paper</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge className="bg-yellow-400 text-yellow-900 px-6 py-3 text-lg font-bold border-0 hover:bg-yellow-300">
                Live Rankings
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-slate-600">Total Submissions</CardDescription>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {overallLeaderboard.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-slate-600">Institutes</CardDescription>
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {instituteLeaderboards.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-slate-600">Average Score</CardDescription>
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {avgScore}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-yellow-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium text-slate-600">Perfect Scores</CardDescription>
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {perfectScores}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Question Analysis Chart */}
         <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                  Most Challenging Questions
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  Questions with highest incorrect answer rates
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-xl border-0 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                      <th className="px-6 py-4 text-left font-semibold">Question</th>
                      <th className="px-6 py-4 text-left font-semibold">Category</th>
                      <th className="px-6 py-4 text-center font-semibold">Correct Answer</th>
                      <th className="px-6 py-4 text-center font-semibold">Incorrect Count</th>
                      <th className="px-6 py-4 text-center font-semibold">Images</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {questionResultsSorted.map((question, index) => (
                      <tr 
                        key={question.questionId} 
                        className="border-b border-slate-100 hover:bg-red-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 text-lg">
                            Q{question.questionIndex?.questionIndex + 1 || index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <Badge className="bg-blue-100 text-blue-800 border-0 font-medium">
                              {question.questionIndex?.category || 'N/A'}
                            </Badge>
                            {question.questionIndex?.subcategory && (
                              <div className="text-sm text-slate-600 font-medium">
                                {question.questionIndex.subcategory}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge className="bg-green-100 text-green-800 border-0 font-semibold text-base px-3 py-1">
                            Option {(question.questionIndex?.correctAnswer ?? 0) + 1}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 font-semibold text-base px-4 py-2">
                            {question.totalIncorrect}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-3 justify-center items-center">
                            {question.questionIndex?.questionImage && (
                              <div className="relative group">
                                <img 
                                  src={getImageUrl(question.questionIndex.questionImage)}
                                  alt="Question"
                                  className="w-12 h-12 object-cover rounded-lg border-2 border-purple-200 cursor-pointer hover:border-purple-400 transition-colors"
                                  onClick={() => openImageDialog(question.questionIndex.questionImage, `Question ${question.questionIndex?.questionIndex + 1 || index + 1} - Question Image`)}
                                />
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Question Image
                                </div>
                              </div>
                            )}
                            {question.questionIndex?.answerReviewImage && (
                              <div className="relative group">
                                <img 
                                  src={getImageUrl(question.questionIndex.answerReviewImage)}
                                  alt="Answer Review"
                                  className="w-12 h-12 object-cover rounded-lg border-2 border-orange-200 cursor-pointer hover:border-orange-400 transition-colors"
                                  onClick={() => openImageDialog(question.questionIndex.answerReviewImage, `Question ${question.questionIndex?.questionIndex + 1 || index + 1} - Answer Review`)}
                                />
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Answer Review
                                </div>
                              </div>
                            )}
                            {!question.questionIndex?.questionImage && !question.questionIndex?.answerReviewImage && (
                              <span className="text-slate-400 text-sm">No images</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

      

        {/* Leaderboard Section */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="h-7 w-7 text-yellow-600" />
              <div>
                <CardTitle className="text-2xl">Competition Rankings</CardTitle>
                <CardDescription className="text-base mt-1">
                  View rankings by overall performance or by institute
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overall" className="w-full">
              <TabsList className="grid w-full bg-slate-100 p-1 rounded-xl" style={{ gridTemplateColumns: `repeat(${instituteLeaderboards.length + 1}, minmax(0, 1fr))` }}>
                <TabsTrigger value="overall" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold">
                  Overall
                </TabsTrigger>
                {instituteLeaderboards.map((inst) => (
                  <TabsTrigger key={inst.instituteId} value={inst.instituteId} className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold">
                    {inst.instituteName}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Overall Leaderboard */}
              <TabsContent value="overall" className="mt-6">
                <div className="rounded-xl border-0 overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                          <th className="px-6 py-4 text-left font-semibold">Rank</th>
                          <th className="px-6 py-4 text-left font-semibold">Student Name</th>
                          <th className="px-6 py-4 text-left font-semibold">Institute</th>
                          <th className="px-6 py-4 text-center font-semibold">Score</th>
                          <th className="px-6 py-4 text-center font-semibold">Institute Rank</th>
                          <th className="px-6 py-4 text-right font-semibold">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {overallLeaderboard.map((student, index) => (
                          <tr 
                            key={student.studentId} 
                            className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${
                              index < 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : ''
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {getRankBadge(student.overallRank)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-800">{student.studentName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 font-medium">
                                {student.instituteName}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`text-lg ${getScoreColor(student.score, paper.questionsCount)}`}>
                                {student.score}/{paper.questionsCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 font-semibold">
                                #{student.instituteRank}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">
                                  {new Date(student.submittedAt).toLocaleString()}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* Institute Leaderboards */}
              {instituteLeaderboards.map((institute) => (
                <TabsContent key={institute.instituteId} value={institute.instituteId} className="mt-6">
                  <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">{institute.instituteName}</h3>
                      <p className="text-slate-600 mt-1 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {institute.leaderboard.length} students participated
                      </p>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base px-6 py-3 border-0">
                      Institute Ranking
                    </Badge>
                  </div>
                  
                  <div className="rounded-xl border-0 overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                            <th className="px-6 py-4 text-left font-semibold">Institute Rank</th>
                            <th className="px-6 py-4 text-left font-semibold">Student Name</th>
                            <th className="px-6 py-4 text-center font-semibold">Score</th>
                            <th className="px-6 py-4 text-center font-semibold">Overall Rank</th>
                            <th className="px-6 py-4 text-right font-semibold">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {institute.leaderboard.map((student, index) => (
                            <tr 
                              key={student.studentId} 
                              className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${
                                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : ''
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {getRankBadge(student.instituteRank)}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-800">{student.studentName}</div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`text-lg ${getScoreColor(student.score, paper.questionsCount)}`}>
                                  {student.score}/{paper.questionsCount}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 font-semibold">
                                  #{student.overallRank}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-slate-600">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm">
                                    {new Date(student.submittedAt).toLocaleString()}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

      </div>

      {/* Image Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                {selectedImage?.title}
              </DialogTitle>
              <button
                onClick={closeImageDialog}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="flex justify-center items-center p-4">
            {selectedImage && (
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}