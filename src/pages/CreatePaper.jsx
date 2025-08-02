"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Plus,
  Save,
  Trash2,
  Calendar,
  FileText,
  ImageIcon,
  X,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import api from "@/services/api";
import { z } from "zod";

const QuestionSchema = z.object({
  questionImage: z.string().url(),
  answerReviewImage: z.string().url(),
  correctAnswer: z.union([z.number(), z.string().regex(/^\d$/)]),
  category: z.string().min(1),
});

const subjectOptions = [
  { value: "Physics", label: "Physics" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "History", label: "History" },
  { value: "General", label: "General" },
];

const categoryOptions = {
  Physics: [
    "මිනුම්",
    "යාන්ත්‍ර විද්‍යාව",
    "ආලෝකය",
    "තාපය",
    "ගුරුත්වාකර්ශන ක්ෂේත්‍ර",
    "විද්‍යුත් ක්ෂේත්‍රය",
    "චුම්බක ක්ෂේත්‍රය",
    "ධාරා විද්‍යුතය",
    "ඉලෙක්ට්‍රොනික විද්‍යාව",
    "පදාර්ථයේ ගුණ",
    "පදාර්ථ හා විකිරණය",
  ],
  Mathematics: ["Algebra", "Geometry", "Calculus", "Statistics"],
  History: ["Ancient", "Medieval", "Modern"],
  General: ["GeneralCat"],
};

const paperCategoryOptions = [
  { value: "theory", label: "📚 Theory" },
  { value: "revision", label: "🔄 Revision" },
  { value: "paper", label: "📝 Paper" },
];

export default function CreateMCQPage() {
  const [paperTitle, setPaperTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [paperCategory, setPaperCategory] = useState("theory");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [questionCount, setQuestionCount] = useState(15);
  const [questions, setQuestions] = useState([]);
  const [pastPapers, setPastPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [institutes, setInstitutes] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate year range
  const currentYear = new Date().getFullYear();
  const minYear = currentYear;
  const maxYear = currentYear + 10;

  // Fetch institutes and papers on component mount
  useEffect(() => {
    const fetchData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("userData"));
      console.log("Logged in user:", loggedInUser);
      setLoggedInUser(loggedInUser);

      try {
        // Fetch institutes

        setInstitutes(loggedInUser.institute || []);

        // Fetch papers
        const papersRes = await api.get(
          `/api/papers/author/${loggedInUser._id}`
        );
        console.log("Fetched papers:", papersRes.data.papers);
        if (papersRes.status === 200) {
          setPastPapers(papersRes.data.papers);
          toast.success("Data loaded successfully");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const initializeQuestions = (count) => {
    const newQuestions = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      questionImage: null,
      answerReviewImage: null,
      correctAnswer: "",
      category: "GeneralCat",
      subcategory: "",
      questionImageLoading: false,
      answerReviewImageLoading: false,
    }));
    setQuestions(newQuestions);
  };

  const handleQuestionCountChange = (count) => {
    const numCount = Number.parseInt(count);
    setQuestionCount(numCount);
    initializeQuestions(numCount);
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q))
    );
  };

  const handleImageUpload = async (questionId, field, file) => {
    if (!file) return;
    // Set loading state
    const loadingField =
      field === "questionImage"
        ? "questionImageLoading"
        : "answerReviewImageLoading";
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, [loadingField]: true } : q
      )
    );

    // Convert file to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    let base64String = null;
    try {
      base64String = await toBase64(file);
    } catch (err) {
      console.error("Base64 conversion failed:", err);
      toast.error("Failed to process image");
    }

    if (base64String) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, [field]: base64String } : q))
      );
    }
    // Unset loading state
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, [loadingField]: false } : q
      )
    );
  };

  const addAvailabilitySlot = () => {
    setAvailability([
      ...availability,
      {
        id: Date.now(),
        institute: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const updateAvailability = (id, field, value) => {
    setAvailability((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  };

  const removeAvailabilitySlot = (id) => {
    setAvailability((prev) => prev.filter((slot) => slot.id !== id));
  };
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!paperTitle.trim() || !subject.trim() || !year.trim()) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Validate year
      const yearNum = Number(year);
      if (isNaN(yearNum) || yearNum < minYear || yearNum > maxYear) {
        toast.error(`Year must be between ${minYear} and ${maxYear}`);
        setIsSubmitting(false);
        return;
      }

      if (availability.length === 0) {
        toast.error("Please add at least one availability slot");
        setIsSubmitting(false);
        return;
      }

      // Check availability slot completeness
      const invalidSlots = availability.filter(
        (slot) => !slot.institute || !slot.startTime || !slot.endTime
      );
      if (invalidSlots.length > 0) {
        toast.error("Please complete all availability slots");
        setIsSubmitting(false);
        return;
      }

      // ✅ Validate each question with Zod
      const invalidQuestions = questions.filter((q) => {
        try {
          QuestionSchema.parse({
            questionImage: q.questionImage,
            answerReviewImage: q.answerReviewImage,
            correctAnswer: Number(q.correctAnswer),
            category: q.category,
          });
          return false; // valid
        } catch {
          return true; // invalid
        }
      });

      if (invalidQuestions.length > 0) {
        toast.error("Please complete all questions before submitting");
        setIsSubmitting(false);
        return;
      }

      // Build final payload
      const paperObject = {
        title: paperTitle,
        subject: subject,
        author: loggedInUser._id,
        questions: questions.map((q) => ({
          questionImage: q.questionImage,
          answerReviewImage: q.answerReviewImage,
          correctAnswer: Number(q.correctAnswer),
          category: q.category,
          subcategory: q.subcategory || undefined,
        })),
        year: year,
        category: paperCategory,
        availability: availability.map((slot) => ({
          institute: slot.institute,
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
        })),
      };

      const res = await api.post("/api/papers", paperObject);
      if (res.status === 201) {
        toast.success(res.data.message);
        // Reset form
        setPaperTitle("");
        setSubject("");
        setPaperCategory("theory");
        setYear(currentYear.toString());
        setQuestions([]);
        setAvailability([]);

        const papersRes = await api.get("/api/papers");
        if (papersRes.status === 200) {
          setPastPapers(papersRes.data.papers);
        }
      }
    } catch (error) {
      console.error("Error creating paper:", error);
      toast.error("Failed to create paper");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handlePreview = (paper) => {
    setSelectedPaper(paper);
    setIsPreviewOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create MCQ Paper</h1>
          <p className="text-muted-foreground">
            Design and create multiple choice question papers
          </p>
        </div>
      </div>

      {/* Paper Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Paper Configuration
          </CardTitle>
          <CardDescription>
            Set up your MCQ paper details and question count
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Paper Title</Label>
              <Input
                id="title"
                placeholder="Enter paper title"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject || ""} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((subj) => (
                    <SelectItem key={subj.value} value={subj.value}>
                      {subj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paperCategory">Paper Category</Label>
              <Select
                value={paperCategory || "theory"}
                onValueChange={setPaperCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {paperCategoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                min={minYear}
                max={maxYear}
                placeholder="Enter year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Year must be between {minYear} and {maxYear}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questions">Number of Questions</Label>
            <Select onValueChange={handleQuestionCountChange} defaultValue="15">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select question count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="1" value="1">
                  1 Questions
                </SelectItem>
                <SelectItem key="5" value="5">
                  5 Questions
                </SelectItem>
                <SelectItem key="15" value="15">
                  15 Questions
                </SelectItem>
                <SelectItem key="25" value="25">
                  25 Questions
                </SelectItem>
                <SelectItem key="50" value="50">
                  50 Questions
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

      {questions.length === 0 && (
        <Button
          onClick={() => initializeQuestions(questionCount)}
          className="w-full"
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Initialize Questions
        </Button>
      )}
        </CardContent>
      </Card>

      {/* Availability Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Institute Availability
          </CardTitle>
          <CardDescription>
            Set availability times for different institutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availability.map((slot) => (
            <Card key={slot.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Institute</Label>
                  <Select
                    value={slot.institute || ""}
                    onValueChange={(value) =>
                      updateAvailability(slot.id, "institute", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institute" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutes.map((institute) => (
                        <SelectItem key={institute._id} value={institute._id}>
                          {institute.name} - {institute.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="datetime-local"
                    value={slot.startTime}
                    onChange={(e) =>
                      updateAvailability(slot.id, "startTime", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="datetime-local"
                    value={slot.endTime}
                    onChange={(e) =>
                      updateAvailability(slot.id, "endTime", e.target.value)
                    }
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAvailabilitySlot(slot.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
      <Button onClick={addAvailabilitySlot} variant="outline" disabled={isSubmitting}>
        <Plus className="h-4 w-4 mr-2" />
        Add Institute Availability
      </Button>
        </CardContent>
      </Card>

      {/* Questions */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Questions ({questions.length})
            </CardTitle>
            <CardDescription>
              Create your multiple choice questions with 5 options each
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Question {index + 1}
                        </Label>
                        <Badge
                          variant={
                            question.questionImage &&
                            question.answerReviewImage &&
                            question.correctAnswer !== "" &&
                            question.category
                              ? "success"
                              : "destructive"
                          }
                        >
                          {question.questionImage &&
                          question.answerReviewImage &&
                          question.correctAnswer !== "" &&
                          question.category
                            ? "Complete"
                            : "Incomplete"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Question Image Upload */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Question Image
                          </Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(
                                  question.id,
                                  "questionImage",
                                  e.target.files?.[0] || null
                                )
                              }
                              className="mb-2"
                            />
                            {question.questionImageLoading && (
                              <div className="text-center text-blue-500 text-sm mb-2">
                                Uploading...
                              </div>
                            )}
                            {question.questionImage && (
                              <div className="mt-2">
                                <img
                                  src={
                                    question.questionImage || "/placeholder.svg"
                                  }
                                  alt="Question"
                                  className="max-w-full h-32 object-contain rounded border"
                                />
                              </div>
                            )}
                            {!question.questionImage && (
                              <div className="text-center text-muted-foreground">
                                <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm">Upload question image</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Answer Review Image Upload */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Answer Review Image (Method of Solving)
                          </Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(
                                  question.id,
                                  "answerReviewImage",
                                  e.target.files?.[0] || null
                                )
                              }
                              className="mb-2"
                            />
                            {question.answerReviewImageLoading && (
                              <div className="text-center text-blue-500 text-sm mb-2">
                                Uploading...
                              </div>
                            )}
                            {question.answerReviewImage && (
                              <div className="mt-2">
                                <img
                                  src={
                                    question.answerReviewImage ||
                                    "/placeholder.svg"
                                  }
                                  alt="Answer Review"
                                  className="max-w-full h-32 object-contain rounded border"
                                />
                              </div>
                            )}
                            {!question.answerReviewImage && (
                              <div className="text-center text-muted-foreground">
                                <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm">
                                  Upload solution method image
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Category
                          </Label>
                          <Select
                            value={question.category || "GeneralCat"}
                            onValueChange={(value) =>
                              updateQuestion(question.id, "category", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {(categoryOptions[subject] || ["GeneralCat"]).map(
                                (cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Subcategory (Optional)
                          </Label>
                          <Input
                            placeholder="Enter subcategory"
                            value={question.subcategory}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "subcategory",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">
                            Correct Answer
                          </Label>
                          <RadioGroup
                            value={question.correctAnswer?.toString() || ""}
                            onValueChange={(value) =>
                              updateQuestion(
                                question.id,
                                "correctAnswer",
                                value
                              )
                            }
                            className="flex gap-4"
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <div
                                key={num}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={(num - 1).toString()}
                                  id={`${question.id}-choice-${num}`}
                                />
                                <Label
                                  htmlFor={`${question.id}-choice-${num}`}
                                  className="text-sm font-medium"
                                >
                                  {num}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            <Separator className="my-6" />
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setQuestions([])} disabled={isSubmitting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Paper
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Papers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            MCQ Papers
          </CardTitle>
          <CardDescription>View and manage created MCQ papers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paper Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Institutes</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastPapers.map((paper) => (
                <TableRow key={paper._id}>
                  <TableCell className="font-medium">{paper.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{paper.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{paper.category}</Badge>
                  </TableCell>
                  <TableCell>{paper.year}</TableCell>
                  <TableCell>{paper.questions?.length || 0}</TableCell>
                  <TableCell>{paper.availability?.length || 0}</TableCell>
                  <TableCell>
                    {new Date(paper.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(paper)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Paper Preview</DialogTitle>
            <DialogDescription>
              {selectedPaper?.title} - {selectedPaper?.subject} (
              {selectedPaper?.year})
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {selectedPaper && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">
                      Total Questions
                    </Label>
                    <p className="text-lg font-semibold">
                      {selectedPaper.questions?.length || 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="text-lg font-semibold">
                      {selectedPaper.category}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Year</Label>
                    <p className="text-lg font-semibold">
                      {selectedPaper.year}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Institutes</Label>
                    <p className="text-lg font-semibold">
                      {selectedPaper.availability?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Availability Information */}
                {selectedPaper.availability &&
                  selectedPaper.availability.length > 0 && (
                    <Card className="p-4">
                      <Label className="font-semibold mb-2 block">
                        Institute Availability
                      </Label>
                      <div className="space-y-2">
                        {selectedPaper.availability.map((slot, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-2 bg-muted rounded"
                          >
                            <span className="font-medium">
                              Institute: {slot.institute.name}-
                              {slot.institute.location}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(slot.startTime).toLocaleString()} -{" "}
                              {new Date(slot.endTime).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                {selectedPaper?.questions &&
                selectedPaper.questions.length > 0 ? (
                  <div className="space-y-6">
                    {selectedPaper.questions.map((q, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            <Label className="font-semibold">
                              Question Image
                            </Label>
                            <img
                              src={q.questionImage || "/placeholder.svg"}
                              alt={`Question ${idx + 1}`}
                              className="w-full max-w-xs rounded border my-2"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="font-semibold">
                              Answer Review Image
                            </Label>
                            <img
                              src={q.answerReviewImage || "/placeholder.svg"}
                              alt={`Answer Review ${idx + 1}`}
                              className="w-full max-w-xs rounded border my-2"
                            />
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <p>
                            <b>Correct Answer:</b> Option{" "}
                            {q.correctAnswer !== undefined
                              ? Number(q.correctAnswer) + 1
                              : "N/A"}
                          </p>
                          <p>
                            <b>Category:</b> {q.category}
                          </p>
                          <p>
                            <b>Subcategory:</b> {q.subcategory || "N/A"}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>No questions available for this paper.</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
