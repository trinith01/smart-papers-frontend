"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Calendar, Clock, AlertCircle, BookOpen, ArrowRight, FileText } from "lucide-react"
import api from "@/services/api"

export default function PaperAnalysisDashboard() {
  const navigate = useNavigate();

  const [pastPapers, setPastPapers] = useState([]);
  const [upcomingPapers, setUpcomingPapers] = useState([]);
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("userData"));
      console.log("Logged in user:", loggedInUser);

      try {
        const papersRes = await api.get(
          `/api/papers/author/${loggedInUser._id}`
        );
        console.log("Fetched papers:", papersRes.data.papers);
        if (papersRes.status === 200) {
          setPastPapers(papersRes.data.papers);
          
          // Filter and sort future papers
          const now = new Date();
          const futurePapers = papersRes.data.papers
            .filter(paper => {
              if (!paper.availability || paper.availability.length === 0) return false;
              const startTime = new Date(paper.availability[0].startTime);
              return startTime > now;
            })
            .sort((a, b) => {
              const dateA = new Date(a.availability[0].startTime);
              const dateB = new Date(b.availability[0].startTime);
              return dateA - dateB;
            })
            .slice(0, 3);
          
          setUpcomingPapers(futurePapers);
          toast.success("Data loaded successfully");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {};
      upcomingPapers.forEach(paper => {
        if (paper.availability && paper.availability[0]) {
          const startTime = new Date(paper.availability[0].startTime);
          const now = new Date();
          const diff = startTime - now;

          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            newCountdowns[paper._id] = { days, hours, minutes, seconds, total: diff };
          } else {
            newCountdowns[paper._id] = { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
          }
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingPapers]);

  const getUrgencyColor = (totalMs) => {
    const hours = totalMs / (1000 * 60 * 60);
    if (hours < 24) return "text-red-600 border-red-600";
    if (hours < 72) return "text-orange-600 border-orange-600";
    return "text-blue-600 border-blue-600";
  };

  const getUrgencyBadge = (totalMs) => {
    const hours = totalMs / (1000 * 60 * 60);
    if (hours < 24) return <Badge variant="destructive" className="ml-2">Urgent</Badge>;
    if (hours < 72) return <Badge variant="outline" className="ml-2 border-orange-600 text-orange-600">Soon</Badge>;
    return <Badge variant="outline" className="ml-2">Upcoming</Badge>;
  };

  const handlePaperClick = (paperId) => {
    navigate(`/papers/${paperId}`);
    console.log("Navigate to paper details for ID:", paperId);
  };

  const getPaperStatus = (paper) => {
    if (!paper.availability || paper.availability.length === 0) {
      return { status: "No Schedule", variant: "secondary" };
    }
    
    const now = new Date();
    const startTime = new Date(paper.availability[0].startTime);
    const endTime = new Date(paper.availability[0].endTime);
    
    if (now < startTime) {
      return { status: "Upcoming", variant: "default" };
    } else if (now >= startTime && now <= endTime) {
      return { status: "Active", variant: "destructive" };
    } else {
      return { status: "Completed", variant: "secondary" };
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Countdown Section */}
      {upcomingPapers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Upcoming Paper Countdown</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {upcomingPapers.map((paper) => {
              const countdown = countdowns[paper._id] || { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
              const avail = paper.availability[0];
              const urgencyColor = getUrgencyColor(countdown.total);

              return (
                <Card 
                  key={paper._id} 
                  className={`border-2 ${urgencyColor} transition-all hover:shadow-lg cursor-pointer`}
                  onClick={() => handlePaperClick(paper._id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <CardTitle className="text-lg">{paper.title}</CardTitle>
                      </div>
                      {getUrgencyBadge(countdown.total)}
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        <span>{paper.year}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold">{paper.subject}</span>
                      </div>
                      <div className="text-xs mt-1 text-muted-foreground">
                        {avail?.institute?.name || "Institute"}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-2xl font-bold">{countdown.days}</div>
                          <div className="text-xs text-muted-foreground">Days</div>
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-2xl font-bold">{countdown.hours}</div>
                          <div className="text-xs text-muted-foreground">Hours</div>
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-2xl font-bold">{countdown.minutes}</div>
                          <div className="text-xs text-muted-foreground">Min</div>
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-2xl font-bold">{countdown.seconds}</div>
                          <div className="text-xs text-muted-foreground">Sec</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Start Time:</span>
                          <span className="font-medium">
                            {new Date(avail.startTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">End Time:</span>
                          <span className="font-medium">
                            {new Date(avail.endTime).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Papers Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-8 w-8 text-slate-600" />
          <h2 className="text-3xl font-bold">All Papers</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pastPapers.map((paper) => {
            const { status, variant } = getPaperStatus(paper);
            const avail = paper.availability && paper.availability[0];

            return (
              <Card 
                key={paper._id} 
                className="transition-all hover:shadow-lg cursor-pointer hover:border-blue-500"
                onClick={() => handlePaperClick(paper._id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2">{paper.title}</CardTitle>
                    <Badge variant={variant} className="ml-2 shrink-0">
                      {status}
                    </Badge>
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{paper.year}</span>
                    </div>
                    <div className="text-xs font-medium">{paper.subject}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  {avail ? (
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{avail.institute?.name || "Institute"}</span>
                      </div>
                      <div className="text-xs">
                        <div>Start: {new Date(avail.startTime).toLocaleDateString()}</div>
                        <div>End: {new Date(avail.endTime).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">No schedule available</div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaperClick(paper._id);
                    }}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {pastPapers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No papers found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}