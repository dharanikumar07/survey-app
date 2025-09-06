import surveyData from '../data/surveyData.json';

/**
 * Load survey data from a specific template with optional AI overrides
 * @param {String} templateKey The key of the template to load (e.g., 'blank', 'marketing_attribution', etc.)
 * @param {Object} aiOverrides Optional AI-generated data to override template defaults
 * @param {String} aiOverrides.surveyTitle AI-generated survey title
 * @param {Array} aiOverrides.questions AI-generated questions (future use)
 * @returns {Object} Survey data initialized from the template with AI overrides applied
 */
export const loadTemplateData = (templateKey, aiOverrides = {}) => {
  try {
    // Get the template data from the JSON file
    const templateData = surveyData.templates[templateKey];
    
    if (!templateData) {
      console.error(`Template "${templateKey}" not found`);
      return null;
    }
    
    
    // Base template data
    const baseData = {
      // Channel data
      channelItems: templateData.channelItems || [],
      
      // Discount data
      discountEnabled: templateData.defaultValues.discountEnabled || false,
      discountSettings: templateData.discountSettings || {},
      discountSections: templateData.discountSections || [],
      
      // UI state
      selectedTab: templateData.defaultValues.selectedTab || 0,
      editModalOpen: templateData.defaultValues.editModalOpen || false,
      surveyTitle: templateData.defaultValues.surveyTitle || 'New Survey',
      selectedQuestionId: templateData.defaultValues.selectedQuestionId || '1',
      selectedView: templateData.defaultValues.selectedView || 'desktop',
      isActive: templateData.defaultValues.isActive || true,
      selectedTheme: templateData.defaultValues.selectedTheme || 'default',
      themePopoverActive: templateData.defaultValues.themePopoverActive || false,
      statusPopoverActive: templateData.defaultValues.statusPopoverActive || false,
      surveyPagePopoverActive: templateData.defaultValues.surveyPagePopoverActive || false,
      selectedSurveyPage: templateData.defaultValues.selectedSurveyPage || 'page',
      currentQuestionIndex: templateData.defaultValues.currentQuestionIndex || 0,
      
      // Question data - ensure we're getting the questions from the template
      questions: templateData.questions || [],
    };

    // Apply AI overrides if provided
    const finalData = {
      ...baseData,
      // Override survey title if AI-generated title is provided
      surveyTitle: aiOverrides.surveyTitle || baseData.surveyTitle,
      // Future: questions can be overridden here
      // questions: aiOverrides.questions ? processAIQuestions(aiOverrides.questions) : baseData.questions
    };

    return finalData;
  } catch (error) {
    console.error('Error loading template data:', error);
    return null;
  }
};
