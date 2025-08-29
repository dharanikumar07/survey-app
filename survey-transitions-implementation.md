# Survey Transitions Implementation Guide

## Overview

This guide explains how to implement the survey transitions system using two separate JavaScript files:

1. **React-based Preview** (for admin panel)
2. **Vanilla JS Storefront** (for customer-facing survey)

This approach follows best practices by separating concerns and avoiding embedding JavaScript in HTML sent via API.

## Implementation Steps

### Step 1: Create Vanilla JS Storefront File

Create a new file `surveyStorefront.js` that will handle all the frontend logic for embedded surveys:

```javascript
/**
 * Survey Storefront JavaScript
 * 
 * This file handles all the survey interactions in the storefront:
 * - Question transitions
 * - Option selection
 * - Progress tracking
 * - Answer storage
 * 
 * Usage:
 * 1. Load this file in your storefront
 * 2. Initialize with: const survey = initSurveyStorefront('container-id');
 * 3. Call survey.init() to start
 */

function initSurveyStorefront(containerId, options = {}) {
  // Default configuration
  const config = {
    animationDuration: 400,
    slideDirection: 'horizontal',
    questionSelector: '.th-sf-survey-question-area',
    nextButtonSelector: '.th-sf-survey-next-button',
    prevButtonSelector: '.th-sf-survey-prev-button',
    progressDotsSelector: '.th-sf-survey-progress-dot',
    ...options
  };

  // State variables
  let currentQuestionIndex = 0;
  let answers = {};
  let questions = [];
  let container = null;

  /**
   * Initialize the survey
   */
  function init() {
    // Get container
    container = document.getElementById(containerId);
    if (!container) {
      console.error(`Survey container with ID "${containerId}" not found`);
      return;
    }

    // Find all questions
    const questionArea = container.querySelector(config.questionSelector);
    if (!questionArea) return;

    // Get all question content divs
    questions = Array.from(container.querySelectorAll('.th-sf-survey-question-content'));
    
    // Hide all questions except the first one
    questions.forEach((q, i) => {
      q.style.display = i === 0 ? 'block' : 'none';
    });

    // Set up event listeners
    setupEventListeners();
    
    // Update progress indicators
    updateProgressIndicators(0);
  }

  /**
   * Set up event listeners for survey interactions
   */
  function setupEventListeners() {
    // Next button
    const nextButtons = container.querySelectorAll(config.nextButtonSelector);
    nextButtons.forEach(btn => {
      btn.addEventListener('click', handleNextButtonClick);
    });

    // Previous button
    const prevButtons = container.querySelectorAll(config.prevButtonSelector);
    prevButtons.forEach(btn => {
      btn.addEventListener('click', handlePrevButtonClick);
    });

    // Rating options
    container.addEventListener('click', function(event) {
      const ratingOption = event.target.closest('.th-sf-survey-rating-option');
      if (ratingOption) handleRatingSelection(ratingOption);
    });

    // Multiple choice options
    container.addEventListener('click', function(event) {
      const choiceOption = event.target.closest('.th-sf-survey-multiple-choice-option');
      if (choiceOption) handleMultipleChoiceSelection(choiceOption);
    });

    // Text inputs
    const textInputs = container.querySelectorAll('.th-sf-survey-text-input-field');
    textInputs.forEach(input => {
      input.addEventListener('input', function(event) {
        storeAnswer(currentQuestionIndex, event.target.value);
      });
    });
  }

  /**
   * Handle next button click
   */
  function handleNextButtonClick() {
    if (currentQuestionIndex < questions.length - 1) {
      slideToQuestion(currentQuestionIndex + 1);
    } else {
      // Handle survey completion
      showThankYouCard();
    }
  }

  /**
   * Handle previous button click
   */
  function handlePrevButtonClick() {
    if (currentQuestionIndex > 0) {
      slideToQuestion(currentQuestionIndex - 1);
    }
  }

  /**
   * Handle rating selection
   */
  function handleRatingSelection(ratingOption) {
    // Get all options in the same group
    const ratingContainer = ratingOption.parentNode;
    const allOptions = ratingContainer.querySelectorAll('.th-sf-survey-rating-option');
    
    // Remove selected state from all options
    allOptions.forEach(option => {
      option.classList.remove('th-sf-survey-rating-option-selected');
      option.style.color = '#ddd';
    });
    
    // Add selected state to clicked option
    ratingOption.classList.add('th-sf-survey-rating-option-selected');
    ratingOption.style.color = '#ffd700';
    
    // Store the answer
    const value = ratingOption.textContent.trim();
    const currentAnswer = answers[currentQuestionIndex] || {};
    storeAnswer(currentQuestionIndex, {
      ...currentAnswer,
      rating: value
    });
    
    // Enable next button if needed
    updateNextButtonState();
  }

  /**
   * Handle multiple choice selection
   */
  function handleMultipleChoiceSelection(choiceOption) {
    // Get all options in the same group
    const optionContainer = choiceOption.parentNode;
    const allOptions = optionContainer.querySelectorAll('.th-sf-survey-multiple-choice-option');
    
    // Toggle selected state on all options
    allOptions.forEach(option => {
      const radio = option.querySelector('.th-sf-survey-multiple-choice-radio');
      if (option === choiceOption) {
        option.style.background = '#f1f8ff';
        option.style.borderColor = '#2c6ecb';
        radio.style.background = '#2c6ecb';
        radio.style.borderColor = '#2c6ecb';
      } else {
        option.style.background = '#fff';
        option.style.borderColor = '#ccc';
        radio.style.background = 'transparent';
        radio.style.borderColor = '#ccc';
      }
    });
    
    // Store the answer
    const value = choiceOption.querySelector('.th-sf-survey-multiple-choice-text').textContent.trim();
    const currentAnswer = answers[currentQuestionIndex] || {};
    storeAnswer(currentQuestionIndex, {
      ...currentAnswer,
      multipleChoice: value
    });
    
    // Enable next button if needed
    updateNextButtonState();
  }

  /**
   * Slide to a specific question with animation
   */
  function slideToQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const nextQuestion = questions[index];
    
    if (!currentQuestion || !nextQuestion) return;
    
    // Prepare for animation
    const questionArea = container.querySelector(config.questionSelector);
    const width = questionArea.offsetWidth;
    
    // Set up animation
    const direction = config.slideDirection === 'horizontal' ? 'translateX' : 'translateY';
    const amount = config.slideDirection === 'horizontal' ? width : questionArea.offsetHeight;
    const sign = index > currentQuestionIndex ? '-' : '';
    
    // Animate current question out
    currentQuestion.style.transition = `transform ${config.animationDuration}ms ease, opacity ${config.animationDuration}ms ease`;
    currentQuestion.style.transform = `${direction}(${sign}${amount}px)`;
    currentQuestion.style.opacity = '0';
    
    // Prepare next question
    nextQuestion.style.transition = 'none';
    nextQuestion.style.transform = `${direction}(${sign === '-' ? '' : '-'}${amount}px)`;
    nextQuestion.style.opacity = '0';
    nextQuestion.style.display = 'block';
    
    // Force reflow
    void nextQuestion.offsetWidth;
    
    // Animate next question in
    nextQuestion.style.transition = `transform ${config.animationDuration}ms ease, opacity ${config.animationDuration}ms ease`;
    nextQuestion.style.transform = 'translate(0, 0)';
    nextQuestion.style.opacity = '1';
    
    // Hide previous question after animation
    setTimeout(() => {
      currentQuestion.style.display = 'none';
    }, config.animationDuration);
    
    // Update progress indicators
    updateProgressIndicators(index);
    
    // Update current question index
    currentQuestionIndex = index;
    
    // Update next button state
    updateNextButtonState();
  }

  /**
   * Update progress indicators
   */
  function updateProgressIndicators(activeIndex) {
    const progressDots = container.querySelectorAll(config.progressDotsSelector);
    
    progressDots.forEach((dot, index) => {
      dot.style.background = index <= activeIndex ? '#000' : '#ddd';
    });
  }

  /**
   * Store an answer for a specific question
   */
  function storeAnswer(questionIndex, value) {
    answers[questionIndex] = value;
    
    // Call answer callback if defined
    if (typeof config.onAnswer === 'function') {
      config.onAnswer(questionIndex, value, answers);
    }
  }

  /**
   * Update next button state based on current question's answer
   */
  function updateNextButtonState() {
    const nextButton = container.querySelector(config.nextButtonSelector);
    if (!nextButton) return;
    
    const isAnswered = isQuestionAnswered(currentQuestionIndex);
    
    if (isAnswered) {
      nextButton.disabled = false;
      nextButton.style.background = '#1a1a1a';
      nextButton.style.opacity = '1';
      nextButton.style.cursor = 'pointer';
    } else {
      nextButton.disabled = true;
      nextButton.style.background = '#ccc';
      nextButton.style.opacity = '0.6';
      nextButton.style.cursor = 'not-allowed';
    }
  }

  /**
   * Check if a question has been answered
   */
  function isQuestionAnswered(questionIndex) {
    if (!answers[questionIndex]) return false;
    
    const answer = answers[questionIndex];
    
    // For rating questions
    if (typeof answer === 'object' && answer !== null) {
      return answer.rating || answer.multipleChoice;
    }
    
    // For text questions
    if (typeof answer === 'string') {
      return answer.trim() !== '';
    }
    
    return true;
  }

  /**
   * Show thank you card
   */
  function showThankYouCard() {
    // Create thank you content if it doesn't exist
    let thankYouCard = container.querySelector('.th-sf-survey-thank-you-card');
    
    if (!thankYouCard) {
      thankYouCard = document.createElement('div');
      thankYouCard.className = 'th-sf-survey-thank-you-card';
      thankYouCard.style.display = 'flex';
      thankYouCard.style.flexDirection = 'column';
      thankYouCard.style.gap = '16px';
      thankYouCard.style.alignItems = 'center';
      thankYouCard.style.textAlign = 'center';
      thankYouCard.style.paddingTop = '24px';
      thankYouCard.style.paddingBottom = '24px';
      thankYouCard.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
          <h3 class="th-sf-survey-thank-you-heading" style="font-size: 24px; font-weight: 600; margin: 0; color: #202223;">
            Thank you for your feedback!
          </h3>
          <p class="th-sf-survey-thank-you-description" style="font-size: 16px; margin: 0; color: #6d7175;">
            We appreciate your time and input.
          </p>
        </div>
      `;
      
      // Append to question area
      const questionArea = container.querySelector(config.questionSelector);
      if (questionArea) {
        // Hide all questions
        questions.forEach(q => {
          q.style.display = 'none';
        });
        
        // Show thank you card
        questionArea.appendChild(thankYouCard);
      }
    }
    
    // Update next button text to "Submit"
    const nextButton = container.querySelector(config.nextButtonSelector);
    if (nextButton) {
      nextButton.textContent = 'Submit';
    }
    
    // Update progress indicators to all active
    const progressDots = container.querySelectorAll(config.progressDotsSelector);
    progressDots.forEach(dot => {
      dot.style.background = '#000';
    });
    
    // Call completion callback if defined
    if (typeof config.onComplete === 'function') {
      config.onComplete(answers);
    }
  }

  /**
   * Get all answers
   */
  function getAnswers() {
    return {...answers};
  }

  // Initialize and return public API
  return {
    init,
    next: handleNextButtonClick,
    prev: handlePrevButtonClick,
    getCurrentIndex: () => currentQuestionIndex,
    getAnswers,
    slideToQuestion
  };
}

// Export the function for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initSurveyStorefront };
}
```

### Step 2: Modify SurveyPreview.jsx to Generate JavaScript

Add a method to the `useImperativeHandle` hook in SurveyPreview.jsx to generate the JavaScript:

```jsx
// Add this to the useImperativeHandle hook in SurveyPreview.jsx
getJavaScriptContent: () => {
    // Import the JavaScript content from a separate file or generate it
    return `
    // Survey Transitions JavaScript
    (function() {
      // Wait for DOM to be fully loaded
      document.addEventListener('DOMContentLoaded', function() {
        const survey = initSurveyStorefront('th-sf-survey-preview-container', {
          slideDirection: 'horizontal',
          animationDuration: 400,
          onComplete: function(answers) {
            console.log('Survey completed!', answers);
            // You can add custom tracking or submission logic here
          },
          onAnswer: function(questionIndex, value, allAnswers) {
            console.log('Question', questionIndex, 'answered:', value);
            // You can add validation or conditional logic here
          }
        });
        
        // Initialize the survey
        survey.init();
      });
    })();
    `;
}
```

### Step 3: Create a Utility Function to Export Both HTML and JS

Create a utility function in `surveyHelpers.js` to prepare both files for the API:

```javascript
/**
 * Prepares survey data for backend storage including separate HTML and JS
 * @param {Object} surveyData - The survey data object
 * @param {string} htmlContent - The HTML content from the preview component
 * @param {string} jsContent - The JavaScript content for transitions
 * @returns {Object} Formatted data for backend
 */
export const prepareSurveyForBackendWithJS = (surveyData, htmlContent, jsContent) => {
  const sanitizedHTML = sanitizeHTML(htmlContent);
  
  // Prepare the data structure
  return {
    name: surveyData.name || 'Survey #1',
    survey_type: mapChannelTypesToSurveyType(surveyData.channelTypes || ['thankyou']),
    status: mapIsActiveToStatus(surveyData.isActive),
    is_active: surveyData.isActive !== undefined ? surveyData.isActive : true,
    survey_meta_data: {
      name: surveyData.name || 'Survey #1',
      isActive: surveyData.isActive !== undefined ? surveyData.isActive : true,
      questions: surveyData.questions || [],
      thankYou: surveyData.thankYou || {
        type: 'thank_you',
        heading: 'Thank You Card',
        description: ''
      },
      channels: surveyData.channels || {},
      discount: surveyData.discount || {
        enabled: false,
        code: '',
        displayOn: 'email',
        limitOnePerEmail: false
      },
      channelTypes: surveyData.channelTypes || ['thankyou'],
      htmlContent: sanitizedHTML,
      cleanHTML: generateCleanSurveyHTML(surveyData, sanitizedHTML),
      completeHTML: generateCompleteSurveyHTML(surveyData, sanitizedHTML),
      jsContent: jsContent, // Store the JavaScript separately
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
};
```

### Step 4: Update Your API Service

Modify your API service to send both HTML and JS separately:

```javascript
// In your API service file
export const saveSurvey = async (surveyData, htmlContent, jsContent) => {
  try {
    const formattedData = prepareSurveyForBackendWithJS(surveyData, htmlContent, jsContent);
    
    const response = await fetch('/api/surveys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save survey');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving survey:', error);
    throw error;
  }
};
```

### Step 5: Update Your Save Button Handler

Update your save button handler to get both HTML and JS:

```jsx
const handleSaveSurvey = () => {
  if (surveyPreviewRef.current) {
    const htmlContent = surveyPreviewRef.current.getBodyContent();
    const jsContent = surveyPreviewRef.current.getJavaScriptContent();
    
    // Save both HTML and JS
    saveSurvey(surveyData, htmlContent, jsContent)
      .then(response => {
        showToast('Survey saved successfully!');
      })
      .catch(error => {
        showToast('Failed to save survey', 'error');
      });
  }
};
```

## How to Use in Shopify Storefront

When embedding the survey in a Shopify storefront, you'll need to:

1. Load the HTML content from your API
2. Load the JavaScript file separately
3. Initialize the survey

Example Shopify Liquid template:

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

## Benefits of This Approach

1. **Separation of Concerns**
   - HTML is clean and contains only structure and styles
   - JavaScript is loaded separately and handles interactions

2. **Security**
   - No JavaScript is embedded in HTML sent via API
   - Reduces risk of XSS attacks

3. **Performance**
   - JavaScript can be cached separately
   - Smaller HTML payload

4. **Maintainability**
   - Easier to update JavaScript without changing HTML
   - Clear separation between preview and storefront logic

5. **Best Practices**
   - Follows modern web development standards
   - Aligns with your backend team's recommendations

## Conclusion

This implementation provides a clean separation between:

1. React-based admin panel preview (SurveyPreview.jsx)
2. Vanilla JS for storefront interactions (surveyStorefront.js)

By keeping these concerns separate, you maintain a more maintainable and secure codebase while still providing all the interactive functionality needed for your surveys.
