# Survey Transitions System

This document explains how the survey transitions system works in both the admin panel (React) and the storefront (vanilla JS).

## Overview

The survey transitions system consists of two main components:

1. **React-based Preview** (for admin panel)
2. **Vanilla JS Implementation** (for storefront)

This separation allows us to maintain a clean architecture while providing identical functionality in both environments.

## Files and Components

### 1. SurveyPreview.jsx

This React component handles the survey preview in the admin panel. It uses React state and hooks to manage:
- Question navigation
- Option selection
- Progress tracking
- Answer storage

It also provides methods to export:
- Clean HTML content
- Complete HTML document
- JavaScript content for storefront

### 2. surveyStorefront.js

This file provides a vanilla JavaScript implementation for the storefront. It includes:
- `initSurveyStorefront()` - Main function to initialize the survey
- `generateSurveyJavaScript()` - Function to generate JavaScript code for embedding

### 3. surveyHelpers.js

This file contains utility functions for both environments, including:
- `generateCleanSurveyHTML()` - Creates clean HTML for storage
- `generateCompleteSurveyHTML()` - Creates complete HTML document
- `generateSurveyJavaScriptContent()` - Generates JavaScript for the storefront
- `prepareSurveyForBackend()` - Prepares data for API submission

## How It Works

### Admin Panel (React)

1. The `SurveyPreview` component renders the survey preview
2. React state manages question navigation and answer selection
3. When saving, the component exports:
   - Clean HTML content via `getBodyContent()`
   - JavaScript content via `getJavaScriptContent()`

### Storefront (Vanilla JS)

1. The HTML content is loaded from the API
2. The JavaScript file (`surveyStorefront.js`) is loaded separately
3. The survey is initialized with:
   ```javascript
   const survey = initSurveyStorefront('survey-container');
   survey.init();
   ```
4. The vanilla JS implementation handles:
   - DOM manipulation for transitions
   - Event listeners for interactions
   - State management for answers

## API Integration

When saving a survey, both HTML and JavaScript are sent to the API:

```javascript
const handleSaveSurvey = () => {
  if (surveyPreviewRef.current) {
    const htmlContent = surveyPreviewRef.current.getBodyContent();
    
    // Save only HTML content to backend
    // JavaScript is deployed separately as a static asset
    saveSurvey(surveyData, htmlContent);
  }
};
```

The backend stores both files separately, allowing for:
- HTML to be embedded in the storefront
- JavaScript to be loaded as a separate file

## Storefront Integration

In the Shopify storefront, the survey can be embedded with:

```liquid
<div id="survey-container">
  {{ survey.html_content }}
</div>

<script src="{{ 'survey-transitions.js' | asset_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const survey = initSurveyStorefront('survey-container');
    survey.init();
  });
</script>
```

## Benefits

This approach provides several benefits:

1. **Separation of Concerns** - HTML and JavaScript are separate
2. **Security** - No JavaScript embedded in HTML
3. **Performance** - JavaScript can be cached separately
4. **Maintainability** - Each environment uses appropriate technologies
5. **Identical UX** - Same functionality in both environments

## Future Improvements

Potential improvements to consider:

1. Add more configuration options to the storefront implementation
2. Implement more question types
3. Add support for conditional logic
4. Improve accessibility features
5. Add analytics tracking integration
