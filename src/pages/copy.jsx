"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import PageHeader from "@/components/question-upload/PageHeader";
import UploadForm from "@/components/question-upload/UploadForm";

export default function QuestionUploadPage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData, resetForm) => {
    if (
      !formData.questionImage ||
      !formData.answerImage ||
      !formData.category ||
      !formData.difficulty ||
      !formData.unitName ||
      !formData.subunitName
    ) {
      alert("Please fill in all fields and upload both images");
      return;
    }

    const newQuestion = {
      ...formData,
      difficulty: formData.difficulty,
    };

    try {
      const res = await api.post(`/api/questionBank/${JSON.parse(localStorage.getItem("userData"))._id}`, newQuestion);
      
      if (res.data.success) {
        alert("Question added successfully");
        resetForm();
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question");
    }

    console.log(newQuestion);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <PageHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UploadForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
