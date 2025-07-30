import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Layout from "@/layout"; // Make sure this file exists and exports a layout
import "./App.css";
import CreateMCQPage from "@/pages/CreatePaper";
import StudentResultsPage from "@/pages/studentPerformance";
import StudentQuizPage from "@/pages/StudenQuiz"; // Ensure this file exists
import StudentReviewPage from "@/pages/StudentReview"; // Ensure this file exists
import MCQAnalysisPage from "@/pages/McqAnalyze";
import Register from "./components/registration-form";
import LoginPage from "@/pages/loginPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilePage from "./pages/profileSetting";
import PaperAnalysisDashboard from "./pages/Analytics";
import VideoUploadPage from "./pages/VideoUploadPage";
import QuestionUploadPage from "./pages/QuestionUploadPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LoginPage />} />
        {/* Protected routes */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/create-mcq" element={<CreateMCQPage />} />
            <Route path="/my-performance" element={<StudentResultsPage />} />
            <Route path="/student-quiz" element={<StudentQuizPage />} />
            <Route path="/student-review/:id" element={<StudentReviewPage />} />
            <Route path="/quick-analyze" element={<MCQAnalysisPage />} />
            <Route path="/profile-setting" element={<ProfilePage />} />
            <Route path="/analytics" element={<PaperAnalysisDashboard />} />
            <Route path="/video-upload" element={<VideoUploadPage />} />
            <Route path="/question-bank" element={<QuestionUploadPage/>} />

            
          </Route>
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
