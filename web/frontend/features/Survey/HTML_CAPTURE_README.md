# Survey HTML Capture for Backend Storage and Storefront Rendering

This document explains how to use the new HTML capture functionality in the Survey component to store survey HTML content in the backend and render it in Shopify storefronts.

## Overview

The SurveyPreview component has been refactored to:
1. Use pure HTML with inline styles (no Polaris components)
2. Provide methods to capture HTML content for backend storage
3. Generate complete HTML documents with proper structure
4. Support both full HTML documents and body content only

## Key Features

### 1. Pure HTML with Inline Styles
- All styling is done with inline styles using the `style` attribute
- No external CSS dependencies
- Responsive design with mobile-first approach
- Interactive elements with hover effects

### 2. HTML Content Capture
The component exposes two methods through a ref:

```jsx
const surveyPreviewRef = useRef(null);

// Get only the main content (recommended for embedding)
const bodyContent = surveyPreviewRef.current.getBodyContent();

// Get the complete HTML including wrapper
const fullHTML = surveyPreviewRef.current.getHTMLContent();
```

### 3. Backend Integration
Use the utility functions in `surveyHelpers.js`:

```jsx
import { prepareSurveyForBackend, generateCleanSurveyHTML, generateCompleteSurveyHTML } from '../../utils/surveyHelpers';

// Prepare complete survey data with HTML
const completeSurveyData = prepareSurveyForBackend(surveyData, htmlContent);

// Generate clean HTML content (no scripts or event handlers)
const cleanHTML = generateCleanSurveyHTML(surveyData, htmlContent);

// Generate complete HTML document with meta and body tags
const completeHTML = generateCompleteSurveyHTML(surveyData, htmlContent);
```

## Usage Example

### 1. Setting up the Ref
```jsx
import { useRef } from 'react';

function SurveyBuilder() {
    const surveyPreviewRef = useRef(null);
    
    const handleSave = () => {
        // Capture HTML content
        const htmlContent = surveyPreviewRef.current.getBodyContent();
        
        // Send to backend
        saveSurveyToBackend({
            ...surveyData,
            htmlContent: htmlContent
        });
    };
    
    return (
        <div>
            <ModalHeader surveyPreviewRef={surveyPreviewRef} />
            <SurveyModalContent ref={surveyPreviewRef} />
        </div>
    );
}
```

### 2. Backend Storage
The captured HTML content can be stored in your database:

```json
{
    "id": "survey_123",
    "name": "Customer Satisfaction Survey",
    "htmlContent": "<div style=\"display: flex; flex-direction: column; gap: 16px;...\">...</div>",
    "cleanHTML": "<div style=\"display: flex; flex-direction: column; gap: 16px;...\">...</div>",
    "completeHTML": "<!DOCTYPE html><html><head>...</head><body>...</body></html>",
    "questions": [...],
    "createdAt": "2025-01-15T10:30:00Z"
}
```

### 3. Storefront Rendering
In your Shopify storefront, you can render the survey using the stored HTML:

```liquid
<!-- In your Shopify theme -->
<div class="survey-container">
    {{ survey.htmlContent }}
</div>
```

Or for a complete standalone page:

```liquid
<!-- Complete survey page with wrapper -->
<div class="survey-page">
    {{ survey.cleanHTML }}
</div>
```

## HTML Structure

The captured HTML follows this structure with Team Heisenberg's unique class naming convention:

```html
<div data-preview-content class="th-sf-survey-preview-content">
    <!-- Survey Card -->
    <div class="th-sf-survey-card" style="background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <!-- Question Content -->
        <h3 class="th-sf-survey-question-heading" style="font-size: 24px; font-weight: 600; text-align: center;">
            {{ question.content }}
        </h3>
        
        <!-- Answer Options -->
        <div class="th-sf-survey-answer-area" style="display: flex; flex-direction: column; gap: 8px;">
            <!-- Rating scale, multiple choice, or text input -->
        </div>
        
        <!-- Navigation -->
        <div class="th-sf-survey-navigation" style="border-top: 1px solid #e1e3e5;">
            <!-- Next button and progress indicators -->
        </div>
    </div>
    
    <!-- Branding Footer -->
    <div class="th-sf-survey-branding-footer" style="padding-bottom: 32px;">
        <!-- Custom branding and links -->
    </div>
</div>
```

### Class Naming Convention

All survey elements use the `th-sf-survey-` prefix to ensure:
- **Uniqueness**: No conflicts with existing CSS frameworks
- **Team Identity**: Clear ownership by Team Heisenberg
- **Maintainability**: Easy identification and debugging
- **Scalability**: Consistent pattern for future features

See `TH_SF_SURVEY_CLASSES.md` for a complete reference of all available classes.

### HTML Output Options

The system now provides three different HTML outputs for different use cases:

#### 1. **`htmlContent`** - Raw HTML
- **Purpose**: Original HTML from React component
- **Use Case**: When you need the exact HTML structure
- **Content**: Includes all inline styles and classes

#### 2. **`cleanHTML`** - Sanitized Content
- **Purpose**: Clean HTML content without scripts or event handlers
- **Use Case**: Embedding in existing pages or Liquid templates
- **Content**: Just the survey content, ready for inclusion

#### 3. **`completeHTML`** - Full Document
- **Purpose**: Complete HTML document with meta and body tags
- **Use Case**: Standalone survey pages or iframe embedding
- **Content**: Full HTML document with proper structure and CSS

## Benefits

1. **Exact Visual Reproduction**: The HTML captured is exactly what users see in the preview
2. **No CSS Dependencies**: All styles are inline, making it easy to embed anywhere
3. **Responsive Design**: Mobile-first approach ensures compatibility across devices
4. **Interactive Elements**: Hover effects and focus states are preserved
5. **Easy Integration**: Can be embedded in any HTML page or Shopify theme
6. **Backend Storage**: HTML content can be stored and retrieved from your database

## Security Considerations

The HTML content is sanitized before storage to prevent XSS attacks:
- Script tags are removed
- Iframe tags are removed
- JavaScript protocol handlers are disabled
- Event handlers are stripped

For production use, consider using a more robust sanitization library like DOMPurify.

## Future Enhancements

1. **Theme Support**: Add multiple theme options with different color schemes
2. **Custom CSS**: Allow users to add custom CSS classes
3. **Animation Support**: Add CSS animations and transitions
4. **Accessibility**: Enhance keyboard navigation and screen reader support
5. **Analytics**: Add tracking for survey interactions

## Troubleshooting

### HTML Not Capturing
- Ensure the ref is properly passed down through the component hierarchy
- Check that the SurveyPreview component is mounted before calling ref methods
- Verify that the ref.current exists before calling methods

### Styles Not Rendering
- All styles are inline, so they should work in any HTML environment
- Check that the HTML content is being properly escaped when rendering
- Ensure the target environment supports CSS properties used in inline styles

### Mobile Responsiveness
- The component uses responsive design principles
- Test on various screen sizes to ensure proper rendering
- Consider adding custom CSS for specific breakpoints if needed
