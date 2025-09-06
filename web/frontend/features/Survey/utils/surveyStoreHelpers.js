import { v4 as uuidv4 } from 'uuid';

/**
 * Save survey data for API submission
 * @param {Object} currentState Current state from Zustand store
 * @returns {Object} Formatted survey data for API
 */
export const prepareSurveyDataForApi = (currentState) => {
  // Extract only what's needed for the API
  return {
    surveyTitle: currentState.surveyTitle,
    isActive: currentState.isActive,
    selectedTheme: currentState.selectedTheme,
    questions: currentState.questions,
    channelItems: currentState.channelItems,
    discountSettings: currentState.discountSettings,
    discountEnabled: currentState.discountEnabled,
    // Add any other fields needed for API
  };
};

/**
 * Create a new question with defaults
 * @param {String} type Question type
 * @returns {Object} New question object
 */
export const createNewQuestion = (type = 'text') => {
  try {
    // Try to get the question template from the JSON file
    const template = surveyData.questionTemplates[type];
    
    if (template) {
      // Create a deep copy of the template
      const questionTemplate = JSON.parse(JSON.stringify(template));
      
      // Generate new UUIDs for all answer options to avoid ID conflicts
      if (questionTemplate.answerOptions && questionTemplate.answerOptions.length > 0) {
        questionTemplate.answerOptions = questionTemplate.answerOptions.map(option => ({
          ...option,
          id: uuidv4()
        }));
      }
      
      // Return the question with a new ID
      return {
        ...questionTemplate,
        id: uuidv4(),
        isDraggable: true
      };
    }
  } catch (error) {
    console.error('Error creating question from template:', error);
  }
  
  // Fallback to basic templates if the JSON template is not available
  const fallbackTemplates = {
    'text': {
      content: 'New text question',
      type: 'text',
      description: '',
      questionType: 'Short answer',
      answerOptions: []
    },
    'rating': {
      content: 'New rating question',
      type: 'rating',
      description: '',
      questionType: 'Star rating',
      answerOptions: [
        { id: uuidv4(), text: '1 - Not likely' },
        { id: uuidv4(), text: '2 - Somewhat likely' },
        { id: uuidv4(), text: '3 - Likely' },
        { id: uuidv4(), text: '4 - Very likely' },
        { id: uuidv4(), text: '5 - Extremely likely' }
      ]
    },
    'number-scale': {
      content: 'New number scale question',
      type: 'number-scale',
      description: '',
      questionType: 'Number scale',
      answerOptions: [
        { id: uuidv4(), text: '1 - Poor' },
        { id: uuidv4(), text: '2 - Fair' },
        { id: uuidv4(), text: '3 - Good' },
        { id: uuidv4(), text: '4 - Very good' },
        { id: uuidv4(), text: '5 - Excellent' }
      ]
    },
    'single-choice': {
      content: 'New single choice question',
      type: 'single-choice',
      description: '',
      questionType: 'Single choice',
      answerOptions: [
        { id: uuidv4(), text: 'Option 1' },
        { id: uuidv4(), text: 'Option 2' },
        { id: uuidv4(), text: 'Option 3' }
      ]
    },
    'multiple-choice': {
      content: 'New multiple choice question',
      type: 'multiple-choice',
      description: '',
      questionType: 'Multiple choice',
      answerOptions: [
        { id: uuidv4(), text: 'Option 1' },
        { id: uuidv4(), text: 'Option 2' },
        { id: uuidv4(), text: 'Option 3' }
      ]
    }
  };
  
  const template = fallbackTemplates[type] || fallbackTemplates['text'];
  
  return {
    id: uuidv4(),
    isDraggable: true,
    ...template
  };
};

/**
 * Process survey data from API response 
 * @param {Object} apiResponse API response data
 * @returns {Object} Processed survey data ready for store
 */
export const processSurveyDataFromApi = (apiResponse) => {
  // This will be implemented when API is ready
  // For now just return null to use the default data
  return null;
};
