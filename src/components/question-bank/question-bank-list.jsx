"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { BookOpen, Search, Eye } from "lucide-react"
import api from "@/services/api"
import { toast } from "sonner"
export function QuestionBankList({ questionBanks, searchTerm, setSearchTerm, onSelectBank }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bankName, setBankName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!bankName.trim()) return

    setIsSubmitting(true)

    // TODO: Replace with actual logged user ID from auth context/session
    

    const newBankData = {
      name: bankName.trim(),
      author: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData'))._id : undefined,
    }

    console.log("Creating new question bank:", newBankData)

    // TODO: Call API to create new question bank here
    try{
      const res = await api.post(`/api/questionBank` , newBankData)
      if(res.data.success){
        toast.success("Question bank created successfully")
        setBankName("")
         setIsDialogOpen(false)
        setIsSubmitting(false)

      }else{
        toast.error("Failed to create question bank")
        setIsSubmitting(false)
      }
    }catch(err){
      toast.error("Failed to create question bank")
      setIsSubmitting(false)
    }

    // Reset form and close dialog
    
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Question Banks</h2>
          <p className="text-gray-600">Manage your question collections</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search banks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <BookOpen className="w-4 h-4 mr-2" />
                New Bank
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Question Bank</DialogTitle>
                <DialogDescription>
                  Enter a name for your new question bank. You can add questions to it later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Enter question bank name..."
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBankName("")
                    setIsDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!bankName.trim() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Creating..." : "Create Bank"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questionBanks.map((bank) => (
          <Card
            key={bank._id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectBank(bank)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{bank.name}</CardTitle>
                    <CardDescription>by {bank.author.name}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{bank.questions.length} questions</span>
                  <span>Updated {new Date(bank.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(bank.questions.map((q) => q.category))).map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
