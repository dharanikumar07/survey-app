/**
 * Survey Transition Utilities
 * 
 * This module provides functions to handle smooth transitions between survey questions
 * and manages the survey flow in the storefront.
 */

/**
 * Initialize the survey functionality with transitions
 * @param {Object} options - Configuration options
 * @returns {Object} - Survey controller object
 */
export function initSurveyTransitions(options = {}) {
  // Default options
  const config = {
    slideDirection: 'horizontal', // 'horizontal' or 'vertical'
    animationDuration: 400,       // ms
    questionSelector: '.th-sf-survey-question-area',
    nextButtonSelector: '.th-sf-survey-next-button',
    progressDotsSelector: '.th-sf-survey-progress-dot',
    surveyContainerSelector: '.th-sf-survey-card-content',
    ...options
  };
  
  let currentQuestionIndex = 0;
  let questions = [];
  let answers = {};
  
  /**
   * Initialize the survey
   */
  function init() {
    // Find all questions (will be hidden initially except the first one)
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
    const container = document.querySelector(config.surveyContainerSelector);
    
    // Store original content as the first "question"
    const firstQuestion = document.querySelector(config.questionSelector);
    if (firstQuestion) {
      questions = [firstQuestion];
      
      // In a multi-question survey, we'd have additional questions
      // that would be added to the DOM on initialization
      // For now we're just setting up the structure for future questions
    }
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
    
    // Handle rating selections
    document.addEventListener('click', function(event) {
      const ratingOption = event.target.closest('.th-sf-survey-rating-option');
      if (ratingOption) {
        // Remove selected class from all options in the same group
        const ratingOptions = ratingOption.parentNode.querySelectorAll('.th-sf-survey-rating-option');
        ratingOptions.forEach(option => {
          option.classList.remove('th-sf-survey-rating-option-selected');
          option.style.background = 'white';
        });
        
        // Add selected class to clicked option
        ratingOption.classList.add('th-sf-survey-rating-option-selected');
        ratingOption.style.background = '#f1f8ff';
        
        // Store answer
        const value = ratingOption.textContent.trim();
        const questionIndex = currentQuestionIndex;
        storeAnswer(questionIndex, value);
      }
    });
    
    // Handle multiple choice selections
    document.addEventListener('click', function(event) {
      const choiceOption = event.target.closest('.th-sf-survey-multiple-choice-option');
      if (choiceOption) {
        // Get all options in the same group
        const optionContainer = choiceOption.parentNode;
        const allOptions = optionContainer.querySelectorAll('.th-sf-survey-multiple-choice-option');
        
        // Toggle selected state on all options
        allOptions.forEach(option => {
          const radio = option.querySelector('.th-sf-survey-multiple-choice-radio');
          if (option === choiceOption) {
            radio.style.background = '#2c6ecb';
            radio.style.borderColor = '#2c6ecb';
          } else {
            radio.style.background = 'transparent';
            radio.style.borderColor = '#ccc';
          }
        });
        
        // Store answer
        const value = choiceOption.querySelector('.th-sf-survey-multiple-choice-text').textContent.trim();
        storeAnswer(currentQuestionIndex, value);
      }
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
   * Slide to a specific question with animation
   * @param {number} index - Question index to show
   */
  function slideToQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const nextQuestion = questions[index];
    
    if (!currentQuestion || !nextQuestion) return;
    
    // Prepare for animation
    const container = currentQuestion.parentNode;
    const width = container.offsetWidth;
    
    // Set up animation
    const direction = config.slideDirection === 'horizontal' ? 'translateX' : 'translateY';
    const amount = config.slideDirection === 'horizontal' ? width : container.offsetHeight;
    
    // Animate current question out
    currentQuestion.style.transition = `transform ${config.animationDuration}ms ease, opacity ${config.animationDuration}ms ease`;
    currentQuestion.style.transform = `${direction}(-${amount}px)`;
    currentQuestion.style.opacity = '0';
    
    // Prepare next question
    nextQuestion.style.transition = 'none';
    nextQuestion.style.transform = `${direction}(${amount}px)`;
    nextQuestion.style.opacity = '0';
    nextQuestion.style.display = 'block';
    
    // Force reflow
    void nextQuestion.offsetWidth;
    
    // Animate next question in
    nextQuestion.style.transition = `transform ${config.animationDuration}ms ease, opacity ${config.animationDuration}ms ease`;
    nextQuestion.style.transform = 'translate(0, 0)';
    nextQuestion.style.opacity = '1';
    
    // Update progress indicators
    updateProgressIndicators(index);
    
    // Update current question index
    currentQuestionIndex = index;
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
  }
  
  /**
   * Show thank you card
   */
  function showThankYouCard() {
    // Create thank you content if it doesn't exist
    let thankYouCard = document.querySelector('.th-sf-survey-thank-you-card');
    
    if (!thankYouCard) {
      thankYouCard = document.createElement('div');
      thankYouCard.className = 'th-sf-survey-thank-you-card';
      thankYouCard.style.display = 'flex';
      thankYouCard.style.flexDirection = 'column';
      thankYouCard.style.gap = '16px';
      thankYouCard.style.alignItems = 'center';
      thankYouCard.style.textAlign = 'center';
      thankYouCard.innerHTML = `
        <h3 class="th-sf-survey-thank-you-heading" style="font-size: 24px; font-weight: 600; margin: 0; color: #202223;">
          Thank you for your feedback!
        </h3>
        <p class="th-sf-survey-thank-you-description" style="font-size: 16px; margin: 0; color: #6d7175;">
          We appreciate your time and input.
        </p>
      `;
      
      // Append to question area
      const questionArea = document.querySelector(config.questionSelector);
      if (questionArea) {
        questionArea.innerHTML = '';
        questionArea.appendChild(thankYouCard);
      }
    } else {
      // Show existing thank you card
      const questionArea = document.querySelector(config.questionSelector);
      if (questionArea) {
        questionArea.innerHTML = '';
        questionArea.appendChild(thankYouCard);
      }
    }
    
    // Hide next button
    const nextButton = document.querySelector(config.nextButtonSelector);
    if (nextButton) {
      nextButton.style.display = 'none';
    }
    
    // Update progress indicators to all active
    const progressDots = document.querySelectorAll(config.progressDotsSelector);
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
    const progressDots = document.querySelectorAll(config.progressDotsSelector);
    
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
   * Add a new question to the survey
   * @param {string} html - Question HTML content
   * @returns {number} - Index of the added question
   */
  function addQuestion(html) {
    const questionArea = document.querySelector(config.questionSelector);
    const newQuestion = document.createElement('div');
    newQuestion.className = 'th-sf-survey-question-content';
    newQuestion.style.display = 'none';
    newQuestion.innerHTML = html;
    
    questionArea.appendChild(newQuestion);
    questions.push(newQuestion);
    
    return questions.length - 1;
  }
  
  // Initialize and return public API
  init();
  
  // Return the public API
  return {
    next: () => handleNextButtonClick(),
    showQuestion,
    slideToQuestion,
    addQuestion,
    getCurrentIndex: () => currentQuestionIndex,
    getAnswers: () => ({...answers}),
    getTotalQuestions: () => questions.length
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
    ${initSurveyTransitions.toString()}
    
    // Initialize the survey with options
    const survey = initSurveyTransitions({
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
  });
})();
`;
}
