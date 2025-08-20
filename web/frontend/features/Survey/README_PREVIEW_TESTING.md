# Survey Preview Testing Guide

## What's New

The survey preview is now **fully interactive** and works like a real survey! You can:

1. **Navigate between questions** using Previous/Next buttons
2. **Select answers** by clicking on options
3. **See real-time updates** when you change questions in the content tab
4. **Experience smooth transitions** between questions
5. **Collect answers** that are stored in the component state

## How to Test

### 1. Basic Navigation
- Open the survey builder
- Click the "Next" button to go to the next question
- Click the "Previous" button to go back
- Notice the progress dots update automatically

### 2. Interactive Elements
- **Rating Scale**: Click on any number (1-6) to select it
- **Multiple Choice**: Click on any option to select it
- **Text Input**: Type in the text area
- **Navigation**: Use Previous/Next buttons

### 3. Real-time Updates
- Go to the Content tab (left panel)
- Add, edit, or reorder questions
- Return to the preview - changes appear immediately!
- The preview automatically resets to the first question when questions change

### 4. Answer Collection
- Select different answers for each question
- Navigate between questions
- Your answers are preserved as you move around
- Check the debug info at the bottom to see collected answers

### 5. Thank You Card
- Navigate through all questions
- When you reach the end, the thank you card appears
- The "Next" button changes to "Submit"

## Debug Information

In development mode, you'll see a debug panel at the bottom showing:
- Current question number
- Question ID and type
- All collected answers
- Whether thank you card is showing

## Technical Details

### State Management
- `currentQuestionIndex`: Tracks which question is currently displayed
- `answers`: Stores all user responses
- `questions`: Automatically updates when content tab changes

### Transitions
- CSS-based sliding animations using `transform: translateX()`
- Smooth 400ms transitions
- Responsive design that works on all screen sizes

### Event Handling
- Click events for all interactive elements
- Navigation button states (disabled when appropriate)
- Hover effects for better UX

## Troubleshooting

### Questions Not Updating
- Make sure you're in the survey builder modal
- Check that questions exist in the content tab
- Verify the `useSurveyState` hook is working

### Navigation Not Working
- Ensure you have multiple questions in the content tab
- Check that the buttons are properly rendered
- Look for console errors

### Answers Not Saving
- Verify the `handleAnswerSelect` function is being called
- Check the `answers` state in the debug panel
- Ensure question types match the expected format

## Next Steps

1. **Test thoroughly** with different question types
2. **Add more questions** to test navigation
3. **Try different answer combinations**
4. **Test the HTML capture** using the debug button
5. **Deploy to backend** when ready

## Backend Integration

When you're ready to save:
1. Click the "Save" button in the header
2. Both HTML and JavaScript content will be captured
3. The data is prepared for backend storage
4. Check the console for the complete survey data

The JavaScript will work exactly the same way in your Shopify storefront!
