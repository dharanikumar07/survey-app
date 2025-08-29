import surveyData from '../data/surveyData.json';

/**
 * Load survey data from a specific template
 * @param {String} templateKey The key of the template to load (e.g., 'blank', 'marketing_attribution', etc.)
 * @returns {Object} Survey data initialized from the template
 */
export const loadTemplateData = (templateKey) => {
  try {
    // Get the template data from the JSON file
    const templateData = surveyData.templates[templateKey];
    
    if (!templateData) {
      console.error(`Template "${templateKey}" not found`);
      return null;
    }
    
    return {
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
      
      // Question data
      questions: templateData.questions || [],
    };
  } catch (error) {
    console.error('Error loading template data:', error);
    return null;
  }
};
