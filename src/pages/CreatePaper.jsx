"use client";

import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import api, { uploadImage } from "@/services/api";
import { z } from "zod";
import { GlobalContext } from "@/context/globalState";
import { usePaperDraft } from "@/hooks/usePaperDraft";

import PageHeader from "@/components/create-paper/PageHeader";
import PaperConfiguration from "@/components/create-paper/PaperConfiguration";
import AvailabilitySlots from "@/components/create-paper/AvailabilitySlots";
import QuestionEditor from "@/components/create-paper/QuestionEditor";
import PastPapersTable from "@/components/create-paper/PastPapersTable";
import PreviewDialog from "@/components/create-paper/PreviewDialog";
import DraftRestoreDialog from "@/components/create-paper/DraftRestoreDialog";

const QuestionSchema = z.object({
  questionImage: z.string().min(1, "Question image is required"),
  answerReviewImage: z.string().min(1, "Answer review image is required"),
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
  const [isPaid, setIsPaid] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [institutes, setInstitutes] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Draft restoration dialog state
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftInfo, setDraftInfo] = useState(null);
  
  // Use the paper draft hook with save callback
  const { hasDraft, saveDraft, loadDraft, clearDraft, getDraftInfo } = usePaperDraft(() => {
    // Show a subtle indication that draft was saved
    const toastId = toast.loading("Saving draft...", { duration: 500 });
    setTimeout(() => {
      toast.dismiss(toastId);
    }, 500);
  });
  
  // Ref to prevent auto-save during initial load
  const isInitialLoad = useRef(true);

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

  // Check for draft on component mount
  useEffect(() => {
    if (hasDraft) {
      const info = getDraftInfo();
      if (info) {
        setDraftInfo(info);
        setShowDraftDialog(true);
      }
    }
  }, [hasDraft, getDraftInfo]);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (isInitialLoad.current) return;
    
    // Only save if there's meaningful content
    if (paperTitle.trim() || questions.length > 0 || availability.length > 0) {
      const draftData = {
        paperTitle,
        subject,
        paperCategory,
        year,
        questionCount,
        questions,
        availability,
        isPaid,
      };
      saveDraft(draftData);
    }
  }, [paperTitle, subject, paperCategory, year, questionCount, questions, availability, isPaid, saveDraft]);

  // Auto-save when state changes
  useEffect(() => {
    if (!isInitialLoad.current) {
      const timeoutId = setTimeout(autoSave, 1000); // Debounce saves by 1 second
      return () => clearTimeout(timeoutId);
    }
  }, [autoSave]);

  // Mark initial load as complete
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitialLoad.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle draft restoration
  const handleRestoreDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setPaperTitle(draft.paperTitle || "");
      setSubject(draft.subject || "");
      setPaperCategory(draft.paperCategory || "theory");
      setYear(draft.year || new Date().getFullYear().toString());
      setQuestionCount(draft.questionCount || 15);
      setQuestions(draft.questions || []);
      setAvailability(draft.availability || []);
      setIsPaid(draft.isPaid || false);
      
      setShowDraftDialog(false);
      toast.success("Draft restored successfully");
    }
  };

  // Handle draft discard
  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftDialog(false);
    toast.success("Draft discarded");
  };

  // Handle clearing all data including draft
  const handleClearAll = () => {
    setQuestions([]);
    setPaperTitle("");
    setSubject("");
    setPaperCategory("theory");
    setYear(new Date().getFullYear().toString());
    setAvailability([]);
    setIsPaid(false);
    clearDraft();
    toast.success("All data and draft cleared");
  };

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

    let imageId = null;
    try {
      const base64String = await toBase64(file);
      
      // Upload image to server and get ID
      imageId = await uploadImage(base64String, 'questions');
      
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image");
    }

    if (imageId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, [field]: imageId } : q
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
        is_paid: isPaid,
        availability: availability.map((slot) => ({
          institute: slot.institute,
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
        })),
      };

      const res = await api.post("/api/papers", paperObject);
      if (res.status === 201) {
        toast.success(res.data.message);
        
        // Clear the saved draft since paper was successfully submitted
        clearDraft();
        
        // Reset form
        setPaperTitle("");
        setSubject("");
        setPaperCategory("theory");
        setYear(currentYear.toString());
        setQuestions([]);
        setAvailability([]);
        setIsPaid(false);

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
        isPaid={isPaid}
        setIsPaid={setIsPaid}
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
          onClearAll={handleClearAll}
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

      <DraftRestoreDialog
        isOpen={showDraftDialog}
        onClose={() => setShowDraftDialog(false)}
        draftInfo={draftInfo}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
      />
    </div>
  );
}
