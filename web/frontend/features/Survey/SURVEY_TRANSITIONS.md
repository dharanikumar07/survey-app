# Survey Transitions with JavaScript

This document explains how to implement and customize the sliding transitions between survey questions for rendering in Shopify storefronts.

## Overview

The survey transition system has been designed to:

1. **Live Preview Functionality**: The survey preview now works interactively in the admin panel
2. **Smooth Sliding Animations**: Transitions between questions with CSS animations
3. **Real-time Updates**: Changes in the content tab immediately reflect in the preview
4. **Interactive Elements**: Clickable options, working navigation buttons, and answer collection
5. **Backend Integration**: Both HTML and JavaScript are captured for storefront deployment
6. **Shopify Compatibility**: Works seamlessly in Shopify storefronts

## Architecture

The implementation consists of three main parts:

1. **surveyTransitions.js** - Core functionality for transitions and survey flow
2. **Integration with SurveyPreview** - Exposes JavaScript via ref for backend storage
3. **Backend Integration** - Updated utilities to store and send JavaScript to the backend

### Key Features

- **Smooth Animations**: Configurable sliding transitions between questions
- **Progress Tracking**: Automatic updates to progress indicators
- **Answer Collection**: Captures and stores user responses
- **Thank You Card**: Automatic transition to a thank you card at the end
- **Event Handling**: Proper setup of event listeners for all interactive elements
- **Mobile Support**: Works well on all device sizes

## Implementation

### 1. Live Preview in Admin Panel

The survey preview now works interactively in the admin panel:

- **Real-time Navigation**: Use Previous/Next buttons to navigate between questions
- **Interactive Options**: Click on rating scales, multiple choice options, and text inputs
- **Answer Collection**: All answers are stored and can be accessed via the `answers` state
- **Smooth Transitions**: CSS-based sliding animations between questions
- **Progress Tracking**: Visual progress indicators show current position
- **Thank You Card**: Automatic transition to thank you message at the end

### 2. How to Use in Shopify Storefront

There are two main ways to add the survey to your Shopify storefront:

#### Option 1: Embed Complete Survey (Recommended)

This method includes both the HTML and JavaScript in one file:

```liquid
<!-- In your Shopify theme (e.g., a custom page template) -->
{{ survey.completeHTML }}
```

The complete HTML includes:
- All survey questions and UI elements
- Inline styles for all components
- JavaScript for transitions embedded at the bottom
- Base CSS for responsive design

#### Option 2: Embed HTML and JavaScript Separately

```liquid
<!-- HTML part in your Shopify theme -->
<div class="survey-container">
  {{ survey.htmlContent }}
</div>

<!-- JavaScript part (end of page or in another file) -->
<script>
  {{ survey.jsContent }}
</script>
```

### 2. API Integration

When sending the survey to your backend API:

```javascript
// Prepare complete survey data for backend
const completeSurveyData = {
  name: survey.name,
  htmlContent: survey.htmlContent,    // The HTML content
  jsContent: survey.jsContent,        // The JavaScript content
  completeHTML: survey.completeHTML,  // Combined HTML+JS document
  // ... other survey data
};

// Send to your API
await fetch('/api/surveys', {
  method: 'POST',
  body: JSON.stringify(completeSurveyData),
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### 3. ScriptTag API Integration (Alternative)

For advanced cases, you can use Shopify's ScriptTag API to inject the JavaScript:

1. Store the JavaScript content in your database
2. Create an endpoint in your backend that serves this JavaScript
3. Register the script with Shopify's ScriptTag API

```javascript
// In your backend
app.post('/api/register-survey-script', async (req, res) => {
  const { shop, accessToken, scriptUrl } = req.body;
  
  // Create a script tag via Shopify API
  const response = await fetch(`https://${shop}/admin/api/2021-10/script_tags.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify({
      script_tag: {
        event: 'onload',
        src: scriptUrl
      }
    })
  });
  
  const data = await response.json();
  res.json(data);
});
```

## Customizing the Transitions

### Configuring Animation Parameters

You can customize the animations by modifying the configuration:

```javascript
const survey = initSurveyTransitions({
  slideDirection: 'horizontal',  // 'horizontal' or 'vertical'
  animationDuration: 400,        // Duration in milliseconds
  onComplete: function(answers) {
    // Custom function called when survey is completed
    console.log('Survey completed with answers:', answers);
  },
  onAnswer: function(questionIndex, value, allAnswers) {
    // Called when a question is answered
    console.log('Question', questionIndex, 'answered:', value);
  }
});
```

### Adding Custom Transitions

You can extend the transition effects by modifying the `slideToQuestion` function in the JavaScript:

```javascript
function slideToQuestion(index) {
  // ... existing code
  
  // Add custom animation effects
  nextQuestion.style.transition = `transform ${config.animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1), 
                                   opacity ${config.animationDuration}ms ease`;
  
  // ... remaining code
}
```

## Security Considerations

The JavaScript content is sanitized before storage to prevent XSS attacks:

- `eval()` calls are removed
- `Function()` constructors are removed
- `document.write` calls are removed
- Dangerous `innerHTML` usage is replaced with safer alternatives

For production, consider using a more robust JavaScript sanitization library.

## Troubleshooting

### Transitions Not Working

1. Check if the JavaScript is properly loaded in the page
2. Verify the HTML structure matches what the JavaScript expects
3. Check browser console for errors
4. Ensure CSS classes match the selectors in the JavaScript

### Animation Appears Choppy

1. Reduce animation complexity
2. Decrease the number of elements being animated
3. Use hardware-accelerated properties (transform, opacity)
4. Set `animationDuration` to a higher value

## Future Enhancements

1. **Multiple Question Types**: Extend support for all question types
2. **Advanced Conditional Logic**: Show/hide questions based on answers
3. **Animation Library**: Add more transition effects and animations
4. **Analytics Integration**: Track user interactions and responses
5. **Real-time Validation**: Add validation for user responses

## Benefits

1. **Better User Experience**: Smooth transitions make the survey feel professional
2. **Increased Completion Rate**: Clear flow guides users through the survey
3. **Mobile Optimization**: Responsive design with touch support
4. **Flexible Implementation**: Works in various Shopify integration scenarios
5. **Lightweight**: Minimal JavaScript with no external dependencies
