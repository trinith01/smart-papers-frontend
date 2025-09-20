"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderOpen, Grid3X3 } from "lucide-react"

import { Header } from "@/components/question-bank/header"
import { QuestionBankList } from "@/components/question-bank/question-bank-list"
import { QuestionDisplay } from "@/components/question-bank/question-display"
import { AddQuestionDialog } from "@/components/question-bank/add-question-dialog"
import api from "@/services/api"
export default function QuestionBankPage() {
  const [activeTab, setActiveTab] = useState("browse")
  const [questionBanks, setQuestionBanks] = useState([])
  const [selectedBank, setSelectedBank] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [expandedUnits, setExpandedUnits] = useState({})
  const [unitDifficultyFilters, setUnitDifficultyFilters] = useState({})
  const [unitCategoryFilters, setUnitCategoryFilters] = useState({})

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchQuestionBanks = async () => {
      try{
      const response = await api.get(`/api/questionBank/author/${JSON.parse(localStorage.getItem("userData"))._id}` )
      const data = response.data
      console.log("Fetched question banks:", data)
      setQuestionBanks(data)
      }catch(err){
        console.log("Error fetching question banks:", err)
      }
    }
    fetchQuestionBanks()

  
  
    
  }, [])

  const handleSelectBank = (bank) => {
    setSelectedBank(bank)
    setActiveTab("questions")
  }

  const handleSubmitQuestion = async (formData) => {
    if (!selectedBank) return

    const { bankId, bankName, ...payload } = formData
     

    const newQuestion = payload
     
    console.log("Submitting question to bank:", selectedBank._id, newQuestion)

    const updatedBank = {
      ...selectedBank,
      questions: [...selectedBank.questions, newQuestion],
    }
    setSelectedBank(updatedBank)


    // TODO: Replace with actual API call
     const res  = await api.post(`/api/questionBank/${bankId}` , newQuestion)
    if(res.data.success){
      console.log("Question added:", newQuestion)
      alert("Question added successfully")
      
    // Update the question banks array
    setQuestionBanks((prev) => prev.map((bank) => (bank._id === selectedBank._id ? updatedBank : bank)))
    }else{
      alert("Failed to add question")
    }


   
  }

  const toggleUnitExpansion = (unitName) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitName]: !prev[unitName],
    }))
  }

  const setUnitDifficultyFilter = (unitName, difficulty) => {
    setUnitDifficultyFilters((prev) => ({
      ...prev,
      [unitName]: difficulty,
    }))
  }

  const setUnitCategoryFilter = (unitName, category) => {
    setUnitCategoryFilters((prev) => ({
      ...prev,
      [unitName]: category,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
     

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Browse Banks
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              View Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <QuestionBankList
              questionBanks={questionBanks}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSelectBank={handleSelectBank}
            />
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <QuestionDisplay
              selectedBank={selectedBank}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              expandedUnits={expandedUnits}
              unitDifficultyFilters={unitDifficultyFilters}
              unitCategoryFilters={unitCategoryFilters}
              isUploadDialogOpen={isUploadDialogOpen}
              setIsUploadDialogOpen={setIsUploadDialogOpen}
              onToggleUnitExpansion={toggleUnitExpansion}
              onSetUnitDifficultyFilter={setUnitDifficultyFilter}
              onSetUnitCategoryFilter={setUnitCategoryFilter}
              onSubmitQuestion={handleSubmitQuestion}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
