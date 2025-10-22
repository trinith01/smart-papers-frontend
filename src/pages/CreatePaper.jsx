"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { z } from "zod";
import { GlobalContext } from "@/context/globalState";

import PageHeader from "@/components/create-paper/PageHeader";
import PaperConfiguration from "@/components/create-paper/PaperConfiguration";
import AvailabilitySlots from "@/components/create-paper/AvailabilitySlots";
import QuestionEditor from "@/components/create-paper/QuestionEditor";
import PastPapersTable from "@/components/create-paper/PastPapersTable";
import PreviewDialog from "@/components/create-paper/PreviewDialog";

const QuestionSchema = z.object({
  questionImage: z.string().url(),
  answerReviewImage: z.string().url(),
  correctAnswer: z.union([z.number(), z.string().regex(/^\d$/)]),
  category: z.string().min(1),
});

const subjectOptions = [{ value: "Physics", label: "Physics" }];

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
 

  const { units } = useContext(GlobalContext);

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
        prev.map((q) =>
          q.id === questionId ? { ...q, [field]: base64String } : q
        )
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
      <PageHeader />
      
      <PaperConfiguration
        paperTitle={paperTitle}
        setPaperTitle={setPaperTitle}
        subject={subject}
        setSubject={setSubject}
        paperCategory={paperCategory}
        setPaperCategory={setPaperCategory}
        year={year}
        setYear={setYear}
        questionCount={questionCount}
        handleQuestionCountChange={handleQuestionCountChange}
        questions={questions}
        initializeQuestions={initializeQuestions}
        isSubmitting={isSubmitting}
        minYear={minYear}
        maxYear={maxYear}
      />

      <AvailabilitySlots
        availability={availability}
        institutes={institutes}
        addAvailabilitySlot={addAvailabilitySlot}
        updateAvailability={updateAvailability}
        removeAvailabilitySlot={removeAvailabilitySlot}
        isSubmitting={isSubmitting}
      />

      {questions.length > 0 && (
        <QuestionEditor
          questions={questions}
          updateQuestion={updateQuestion}
          handleImageUpload={handleImageUpload}
          units={units}
          setQuestions={setQuestions}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      <PastPapersTable
        pastPapers={pastPapers}
        handlePreview={handlePreview}
      />

      <PreviewDialog
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
        selectedPaper={selectedPaper}
      />
    </div>
  );
}
