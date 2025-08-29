# Survey App Data Structure

This document outlines the data structure and flow for the survey application.

## Overview

The survey app uses a centralized JSON file for survey data management. This approach offers several advantages:
- Separation of data and UI components
- Easy maintenance and updates to question templates
- Consistent question structure across the application
- Fallback data when API is not available

## Key Files

### 1. `data/surveyData.json`
Contains all survey data including:
- Default questions
- Question templates for each question type
- Channel settings
- Discount settings
- UI state defaults

### 2. `utils/surveyStoreHelpers.js`
Helper functions for:
- Loading data from JSON
- Creating new questions based on templates
- Preparing data for API submission
- Handling API responses

### 3. `State/store.js`
Zustand store that:
- Loads initial data from JSON
- Manages all survey state
- Provides methods for updating questions and settings
- Handles API integration

## Data Flow

1. **Initial Load**: When the application starts, `loadSurveyData()` in `surveyStoreHelpers.js` loads data from `surveyData.json` 
2. **Adding Questions**: When a user adds a new question, the app:
   - Gets the question template from `questionTemplates` in the JSON
   - Creates a new question with unique IDs
   - Adds it to the store
   - Updates the UI
3. **Saving Survey**: When saving, the app:
   - Collects all data from the store
   - Formats it for API submission
   - Sends to API (or logs for development)
4. **Error Handling**: If templates aren't found, the app falls back to basic templates

## Question Templates

The `questionTemplates` section in `surveyData.json` contains templates for all question types:
- Text questions
- Rating scales
- Multiple choice questions
- Date pickers
- Number scales
- And more

Each template includes:
- Default content
- Description
- Answer options (where applicable)
- Question type information

## Adding New Question Types

To add a new question type:
1. Add a template to the `questionTemplates` section in `surveyData.json`
2. Update the ContentTab.jsx ActionList to include the new question type
3. Handle any special rendering in SurveyPreview.jsx if needed

## Best Practices

- Always use the templates from JSON instead of hardcoding default values
- When updating templates, ensure consistency with existing question structures
- Use the helper functions for creating and manipulating questions
