# Paper Creation Auto-Save Feature

This feature automatically saves the paper creation progress to local storage so users can continue where they left off even if they reload the page or accidentally close the browser.

## How it works

### 1. Auto-Save Functionality
- **Automatic saving**: The system automatically saves the paper data to local storage whenever the user makes changes
- **Debounced saves**: Changes are saved after 1 second of inactivity to avoid excessive storage operations
- **What gets saved**: Paper title, subject, category, year, question count, questions with images, and availability slots

### 2. Draft Restoration
- **Draft detection**: When the user opens the create paper page, the system checks for existing drafts
- **Restoration dialog**: If a draft is found, a dialog shows the draft details and gives options to restore or discard
- **Seamless restoration**: All form fields, questions, and images are restored exactly as they were

### 3. Draft Management
- **Auto-clear on submit**: When a paper is successfully submitted, the draft is automatically cleared
- **Manual clear**: Users can manually clear all data and the draft using the "Clear All & Draft" button
- **Draft info**: The dialog shows paper title, question count, and last saved time

## Technical Implementation

### Files Created/Modified

1. **`/src/hooks/usePaperDraft.js`** - Custom hook for local storage management
2. **`/src/components/create-paper/DraftRestoreDialog.jsx`** - Dialog component for draft restoration
3. **`/src/pages/CreatePaper.jsx`** - Main component with integrated auto-save functionality
4. **`/src/components/create-paper/QuestionEditor.jsx`** - Updated with auto-save indicator

### Key Features

- **Local Storage Key**: `paperDraft`
- **Data Structure**: Includes all form fields plus metadata (lastSaved timestamp)
- **Error Handling**: Graceful handling of storage errors with console logging
- **User Feedback**: Toast notifications for save, restore, and clear operations

### User Experience

1. User starts creating a paper
2. Data is automatically saved as they work
3. If they reload the page, they see a dialog offering to restore their draft
4. They can choose to continue editing or start fresh
5. When they submit the paper, the draft is automatically cleared

## Storage Details

The draft data is stored as JSON in localStorage with the following structure:

```json
{
  "paperTitle": "My Paper Title",
  "subject": "Physics",
  "paperCategory": "theory",
  "year": "2025",
  "questionCount": 15,
  "questions": [...],
  "availability": [...],
  "lastSaved": "2025-10-31T12:00:00.000Z"
}
```

## Browser Compatibility

This feature works in all modern browsers that support localStorage (IE8+, Chrome, Firefox, Safari, Edge).