/**
 * Survey Storefront JavaScript
 * 
 * This file provides the vanilla JavaScript implementation for survey transitions
 * and interactions in the storefront environment (without React dependencies).
 */

/**
 * Initialize the survey functionality with transitions
 * @param {string} containerId - ID of the container element
 * @param {Object} options - Configuration options
 * @returns {Object} - Survey controller object
 */
export function initSurveyStorefront(containerId, options = {}) {
  // Default options
  const config = {
    slideDirection: 'horizontal', // 'horizontal' or 'vertical'
    animationDuration: 400,       // ms
    questionSelector: '.th-sf-survey-question-area',
    nextButtonSelector: '.th-sf-survey-next-button',
    prevButtonSelector: '.th-sf-survey-prev-button',
    progressDotsSelector: '.th-sf-survey-progress-dot',
    surveyContainerSelector: '.th-sf-survey-card-content',
    ...options
  };
  
  let currentQuestionIndex = 0;
  let questions = [];
  let answers = {};
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
    setupQuestions();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show the first question
    showQuestion(0);
  }
  
  /**
   * Set up questions
   */
  function setupQuestions() {
    // Get all questions but keep only the first one visible
    const questionArea = container.querySelector(config.questionSelector);
    if (!questionArea) return;
    
    // Find all question content elements
    questions = Array.from(container.querySelectorAll('.th-sf-survey-question-content'));
    
    // If no questions found, look for the content inside the question area
    if (questions.length === 0 && questionArea) {
      // The structure might be different, try to find content directly
      const content = questionArea.querySelector(':scope > div');
      if (content) {
        questions = [content];
      }
    }
    
    // Hide all questions except the first one
    questions.forEach((q, i) => {
      q.style.display = i === 0 ? 'block' : 'none';
    });
  }
  
  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Next button click handler
    document.addEventListener('click', function(event) {
      if (event.target.closest(config.nextButtonSelector)) {
        handleNextButtonClick();
      }
    });
    
    // Previous button click handler
    document.addEventListener('click', function(event) {
      if (event.target.closest(config.prevButtonSelector)) {
        handlePrevButtonClick();
      }
    });
    
    // Handle rating selections
    document.addEventListener('click', function(event) {
      const ratingOption = event.target.closest('.th-sf-survey-rating-option');
      if (ratingOption) {
        handleRatingSelection(ratingOption);
      }
    });
    
    // Handle multiple choice selections
    document.addEventListener('click', function(event) {
      const choiceOption = event.target.closest('.th-sf-survey-multiple-choice-option');
      if (choiceOption) {
        handleMultipleChoiceSelection(choiceOption);
      }
    });
    
    // Handle text inputs
    const textInputs = container.querySelectorAll('.th-sf-survey-text-input-field');
    textInputs.forEach(input => {
      input.addEventListener('input', function(event) {
        storeAnswer(currentQuestionIndex, event.target.value);
        updateNextButtonState();
      });
    });
  }
  
  /**
   * Handle next button click
   */
  function handleNextButtonClick() {
    const nextIndex = currentQuestionIndex + 1;
    
    // If this is the last existing question, show thank you card
    if (nextIndex >= questions.length) {
      showThankYouCard();
    } else {
      // Otherwise, show the next question with transition
      slideToQuestion(nextIndex);
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
    const ratingContainer = ratingOption.closest('.th-sf-survey-rating-scale');
    if (!ratingContainer) return;
    
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
    const optionContainer = choiceOption.closest('.th-sf-survey-multiple-choice-container');
    if (!optionContainer) return;
    
    const allOptions = optionContainer.querySelectorAll('.th-sf-survey-multiple-choice-option');
    
    // Toggle selected state on all options
    allOptions.forEach(option => {
      const radio = option.querySelector('.th-sf-survey-multiple-choice-radio');
      if (option === choiceOption) {
        option.style.background = '#f1f8ff';
        option.style.borderColor = '#2c6ecb';
        if (radio) {
          radio.style.background = '#2c6ecb';
          radio.style.borderColor = '#2c6ecb';
        }
      } else {
        option.style.background = '#fff';
        option.style.borderColor = '#ccc';
        if (radio) {
          radio.style.background = 'transparent';
          radio.style.borderColor = '#ccc';
        }
      }
    });
    
    // Store the answer
    const value = choiceOption.querySelector('.th-sf-survey-multiple-choice-text')?.textContent.trim();
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
   * @param {number} index - Question index to show
   */
  function slideToQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const nextQuestion = questions[index];
    
    if (!currentQuestion || !nextQuestion) return;
    
    // Prepare for animation
    const questionArea = container.querySelector(config.questionSelector);
    if (!questionArea) return;
    
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
   * Show a specific question without animation
   * @param {number} index - Question index to show
   */
  function showQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    // Hide all questions
    questions.forEach((q, i) => {
      q.style.display = i === index ? 'block' : 'none';
    });
    
    // Update progress indicators
    updateProgressIndicators(index);
    
    // Update current question index
    currentQuestionIndex = index;
    
    // Update next button state
    updateNextButtonState();
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
    } else {
      // Show existing thank you card
      questions.forEach(q => {
        q.style.display = 'none';
      });
      thankYouCard.style.display = 'flex';
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
   * Update progress indicators
   * @param {number} activeIndex - Active question index
   */
  function updateProgressIndicators(activeIndex) {
    const progressDots = container.querySelectorAll(config.progressDotsSelector);
    
    progressDots.forEach((dot, index) => {
      dot.style.background = index <= activeIndex ? '#000' : '#ddd';
    });
  }
  
  /**
   * Store an answer for a specific question
   * @param {number} questionIndex - Question index
   * @param {any} value - Answer value
   */
  function storeAnswer(questionIndex, value) {
    answers[questionIndex] = value;
    
    // Call the answer callback if defined
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
   * @param {number} questionIndex - Question index
   * @returns {boolean} - Whether the question has been answered
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
   * Get all answers
   * @returns {Object} - All answers
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

/**
 * Generate the survey JavaScript code for embedding
 * @param {Object} surveyData - The survey data
 * @returns {string} - JavaScript code as a string
 */
export function generateSurveyJavaScript(surveyData) {
  // Create a self-invoking function to avoid global namespace pollution
  return `
// Survey Transitions JavaScript
(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    ${initSurveyStorefront.toString()}
    
    // Initialize the survey with options
    const survey = initSurveyStorefront('th-sf-survey-preview-container', {
      slideDirection: 'horizontal',
      animationDuration: 400,
      onComplete: function(answers) {
        console.log('Survey completed!', answers);
        // You can add custom tracking or submission logic here
        submitSurveyAnswers(answers);
      },
      onAnswer: function(questionIndex, value, allAnswers) {
        console.log('Question', questionIndex, 'answered:', value);
        // You can add validation or conditional logic here
      }
    });
    
    // Initialize the survey
    survey.init();
    
    // Function to submit survey answers
    function submitSurveyAnswers(answers) {
      // Send answers to your API endpoint
      fetch('/api/survey-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId: '${surveyData?.id || ''}',
          answers: answers
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to submit survey');
        }
        return response.json();
      })
      .then(data => {
        console.log('Survey submitted successfully:', data);
      })
      .catch(error => {
        console.error('Error submitting survey:', error);
      });
    }
  });
})();
`;
}
