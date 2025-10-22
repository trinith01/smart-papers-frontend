"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react"

export default function PreviewDialog({ 
  isPreviewOpen, 
  setIsPreviewOpen, 
  selectedPaper 
}) {
  return (
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
                  <div className="p-4 bg-muted rounded-lg">
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
                  </div>
                )}

              {selectedPaper?.questions &&
              selectedPaper.questions.length > 0 ? (
                <div className="space-y-6">
                  {selectedPaper.questions.map((q, idx) => (
                    <div key={idx} className="p-4 bg-muted rounded-lg">
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
                    </div>
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
  )
}
