import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, Hash, Trash2 } from 'lucide-react';

const DraftRestoreDialog = ({ 
  isOpen, 
  onClose, 
  draftInfo, 
  onRestore, 
  onDiscard 
}) => {
  if (!draftInfo) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Draft Found
          </DialogTitle>
          <DialogDescription>
            We found a saved draft of your paper. Would you like to continue where you left off?
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{draftInfo.title}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>{draftInfo.questionCount} questions</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last saved: {formatDate(draftInfo.lastSaved)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onDiscard}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Discard Draft
          </Button>
          <Button
            onClick={onRestore}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Continue Editing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DraftRestoreDialog;