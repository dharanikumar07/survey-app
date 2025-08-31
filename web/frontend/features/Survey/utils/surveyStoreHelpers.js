import { v4 as uuidv4 } from 'uuid';
import surveyData from '../data/surveyData.json';

/**
 * Load survey data from the JSON file
 * @returns {Object} Initial survey data
 */
export const loadSurveyData = () => {
  try {
    // This would be the place to add API fetching logic in the future
    // For now, we just return the JSON data directly
    return {
      // Channel data
      channelItems: surveyData.channelItems,
      
      // Discount data
      discountEnabled: surveyData.defaultValues.discountEnabled,
      discountSettings: surveyData.discountSettings,
      discountSections: surveyData.discountSections,
      
      // UI state
      selectedTab: surveyData.defaultValues.selectedTab,
      editModalOpen: surveyData.defaultValues.editModalOpen,
      surveyTitle: surveyData.defaultValues.surveyTitle,
      selectedQuestionId: surveyData.defaultValues.selectedQuestionId,
      selectedView: surveyData.defaultValues.selectedView,
      isActive: surveyData.defaultValues.isActive,
      selectedTheme: surveyData.defaultValues.selectedTheme,
      themePopoverActive: surveyData.defaultValues.themePopoverActive,
      statusPopoverActive: surveyData.defaultValues.statusPopoverActive,
      surveyPagePopoverActive: surveyData.defaultValues.surveyPagePopoverActive,
      selectedSurveyPage: surveyData.defaultValues.selectedSurveyPage,
      currentQuestionIndex: surveyData.defaultValues.currentQuestionIndex,
      
      // Question data
      questions: surveyData.questions,
    };
  } catch (error) {
    console.error('Error loading survey data:', error);
    return getDefaultSurveyData();
  }
};

/**
 * Get default survey data as fallback
 * @returns {Object} Default survey data structure
 */
export const getDefaultSurveyData = () => {
  return {
    channelItems: [],
    discountEnabled: false,
    discountSettings: {
      code: '',
      displayOn: 'email',
      limitPerEmail: false,
    },
    discountSections: [],
    selectedTab: 0,
    editModalOpen: false,
    surveyTitle: 'New Survey',
    selectedQuestionId: '1',
    selectedView: 'desktop',
    isActive: true,
    selectedTheme: 'default',
    themePopoverActive: false,
    statusPopoverActive: false,
    surveyPagePopoverActive: false,
    selectedSurveyPage: 'page',
    currentQuestionIndex: 0,
    questions: [
      { 
        id: '1', 
        content: 'How was your experience?', 
        type: 'rating', 
        description: '', 
        questionType: 'Star rating', 
        isDraggable: true,
        answerOptions: []
      },
      { id: 'thankyou', content: 'Thank You Card', type: 'card', description: '', questionType: 'Card', isDraggable: false, answerOptions: [] }
    ],
  };
};

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
