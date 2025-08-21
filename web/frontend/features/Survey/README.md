# Survey System

This directory contains the survey system for the Shopify app. It includes components for creating, editing, previewing, and embedding surveys in Shopify storefronts.

## Directory Structure

```
Survey/
├── components/            # React components
│   ├── panels/            # Main panel components
│   │   └── SurveyPreview.jsx  # Survey preview component
│   └── ...
├── docs/                  # Documentation
│   ├── IMPLEMENTATION_GUIDE.md    # Implementation guide
│   ├── STOREFRONT_EXAMPLE.md      # Storefront integration examples
│   └── SURVEY_TRANSITIONS.md      # Architecture documentation
├── features/              # Feature-specific components
│   └── ...
├── hooks/                 # React hooks
│   └── useSurveyState.js  # Survey state management hook
├── utils/                 # Utility functions
│   ├── surveyHelpers.js   # Helper functions for surveys
│   ├── surveyStorefront.js # Vanilla JS implementation for storefront
│   └── surveyTransitions.js # Legacy transitions file
└── README.md              # This file
```

## Key Components

### SurveyPreview.jsx

This component renders a preview of the survey with pure HTML and inline styles. It's designed to be easily captured as HTML content for backend storage and later rendering in Shopify storefronts.

```jsx
// Usage
const surveyPreviewRef = useRef(null);

// To get the HTML content for backend storage:
const htmlContent = surveyPreviewRef.current.getBodyContent();
const fullHTML = surveyPreviewRef.current.getHTMLContent();

// Render
<SurveyPreview ref={surveyPreviewRef} />
```

### surveyStorefront.js

This file provides a vanilla JavaScript implementation for survey transitions in the storefront. It handles:

- Question transitions
- Option selection
- Progress tracking
- Answer storage

```javascript
// Usage in storefront
const survey = initSurveyStorefront('survey-container');
survey.init();
```

### surveyHelpers.js

This file contains utility functions for surveys, including:

- HTML generation
- Survey validation
- API formatting
- JavaScript generation

```javascript
// Generate clean HTML
const cleanHTML = generateCleanSurveyHTML(surveyData, htmlContent);

// Prepare for backend
const apiData = prepareSurveyForBackend(surveyData, htmlContent);
```

## Implementation

See the documentation files in the `docs/` directory for detailed implementation guides:

- [Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md)
- [Storefront Examples](./docs/STOREFRONT_EXAMPLE.md)
- [Survey Transitions Architecture](./docs/SURVEY_TRANSITIONS.md)

## Key Features

- **Clean HTML Generation**: Generate clean HTML without JavaScript
- **Separate JavaScript**: JavaScript is deployed as a static asset for better performance and security
- **Identical UX**: Same user experience in admin preview and storefront
- **Multiple Question Types**: Support for rating, multiple choice, text, etc.
- **Responsive Design**: Works on all devices and screen sizes
- **Customizable**: Configurable options for animations, styling, etc.
- **Best Practices**: Follows web standards by keeping HTML and JavaScript separate

## Best Practices

1. Keep HTML and JavaScript separate
2. Use the `getBodyContent()` method for clean HTML
3. Deploy JavaScript as a static asset (not via API)
4. Test in different environments and devices
5. Follow the implementation guide for proper integration
6. Use a CDN for JavaScript when possible for better performance
