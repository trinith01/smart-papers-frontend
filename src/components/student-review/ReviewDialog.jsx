"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getImageUrl } from "@/lib/utils"

export default function ReviewDialog({ 
  isOpen, 
  onOpenChange, 
  selectedQuestion 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Question Review</DialogTitle>
          <DialogDescription className="text-sm">
            {selectedQuestion?.isCorrect ? "Correct Answer" : "Solution Method"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] sm:h-[70vh] pr-2 sm:pr-4">
          {selectedQuestion && (
            <div className="space-y-4 sm:space-y-6">
              {/* Question */}
              <div>
                <h3 className="font-semibold mb-3 text-base sm:text-lg">Question:</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <img
                    src={getImageUrl(selectedQuestion.question.questionImage) || "/placeholder.svg"}
                    alt={`Question`}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>
              </div>
              <Separator />
              {/* Solution Method */}
              <div>
                <h3 className="font-semibold mb-3 text-base sm:text-lg">Solution Method:</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <img
                    src={getImageUrl(selectedQuestion.question.answerReviewImage) || "/placeholder.svg"}
                    alt={`Solution for Question`}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
