import { useState, useEffect, useCallback } from 'react';

const PAPER_DRAFT_KEY = 'paperDraft';

export const usePaperDraft = (onSaveCallback) => {
  const [hasDraft, setHasDraft] = useState(false);

  // Check if there's a saved draft
  useEffect(() => {
    const savedDraft = localStorage.getItem(PAPER_DRAFT_KEY);
    setHasDraft(!!savedDraft);
  }, []);

  // Save paper data to localStorage
  const saveDraft = useCallback((paperData) => {
    try {
      const draftData = {
        ...paperData,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(PAPER_DRAFT_KEY, JSON.stringify(draftData));
      setHasDraft(true);
      
      // Call the callback if provided
      if (onSaveCallback) {
        onSaveCallback();
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [onSaveCallback]);

  // Load paper data from localStorage
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(PAPER_DRAFT_KEY);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        return draftData;
      }
      return null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }, []);

  // Clear saved draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(PAPER_DRAFT_KEY);
      setHasDraft(false);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, []);

  // Get draft info (last saved time, etc.)
  const getDraftInfo = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(PAPER_DRAFT_KEY);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        return {
          lastSaved: draftData.lastSaved,
          title: draftData.paperTitle || 'Untitled Paper',
          questionCount: draftData.questions?.length || 0,
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get draft info:', error);
      return null;
    }
  }, []);

  return {
    hasDraft,
    saveDraft,
    loadDraft,
    clearDraft,
    getDraftInfo,
  };
};