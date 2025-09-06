import { v4 as uuidv4 } from 'uuid';
import surveyData from '../data/surveyData.json';

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
    // Get the question template from the JSON file
    const template = surveyData.questionTemplates[type];
    
    if (!template) {
      console.log(`Question template not found for type: ${type}`);
      return null;
    }
    
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
  } catch (error) {
    console.log('Error creating question from template:', error);
    return null;
  }
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
