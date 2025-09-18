import { v4 as uuidv4 } from 'uuid';
import { generateSurveyJavaScript } from './surveyStorefront';

// Helper function to generate unique IDs for questions and options
export const generateId = (prefix = 'item') => {
    return `${prefix}_${uuidv4()}`;
};

// Helper function to validate question data
export const validateQuestion = (question) => {
    const errors = [];
    
    if (!question.content || question.content.trim() === '') {
        errors.push('Question content is required');
    }
    
    if (!question.type) {
        errors.push('Question type is required');
    }
    
    if (question.type === 'rating' && (!question.answerOptions || question.answerOptions.length === 0)) {
        errors.push('Rating questions must have answer options');
    }
    
    return errors;
};

// Helper function to format survey data for API
export const formatSurveyForAPI = (surveyData) => {
    return {
        name: surveyData.name || surveyData.title || 'Survey #1',
        survey_type: mapChannelTypesToSurveyType(surveyData.channelTypes || ['thankyou']),
        status: mapIsActiveToStatus(surveyData.isActive),
        is_active: surveyData.isActive !== undefined ? surveyData.isActive : true,
        survey_meta_data: {
            questions: surveyData.questions?.map(q => ({
                id: q.id,
                type: q.type,
                text: q.content || q.heading || q.text || ''
            })) || [],
            channels: surveyData.channels || [],
            discount: surveyData.discount || null
        }
    };
};

// Helper function to get question type display name
export const getQuestionTypeDisplayName = (type) => {
    const typeMap = {
        'single-choice': 'Single Choice',
        'multiple-choice': 'Multiple Choice',
        'text': 'Text Input',
        'rating': 'Star Rating',
        'satisfaction': 'Satisfaction',
        'number-scale': 'Number Scale',
        'consent': 'Consent',
        'date': 'Date',
        'thankyou': 'Thank You',
        // Legacy mappings for backward compatibility
        'multiple_choice': 'Multiple Choice',
        'checkbox': 'Checkbox',
        'card': 'Card'
    };
    
    return typeMap[type] || type;
};


/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} htmlContent - Raw HTML content
 * @returns {string} Sanitized HTML content
 */
export const sanitizeHTML = (htmlContent) => {
    // Only remove potentially dangerous scripts and event handlers
    // but preserve all other content including styles and form elements
    return htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

/**
 * Prepares survey data for backend storage
 * @param {Object} surveyData - The survey data object
 * @param {string} htmlContent - The HTML content from the preview component
 * @returns {Object} Formatted data for backend
 */
export const prepareSurveyForBackend = (surveyData, htmlContent) => {
    // Simple debugging to see what's happening
    console.log('Original HTML length:', htmlContent?.length);
    
    // Use the original HTML content directly without aggressive sanitization
    // This preserves all the form styles and content
    
    // Prepare the existing complete survey data structure
    const existingCompleteData = {
        name: surveyData.name || 'Survey #1',
        isActive: surveyData.isActive !== undefined ? surveyData.isActive : true,
        questions: surveyData.questions || [],
        channels: surveyData.channels || {},
        discount: surveyData.discount || {
            enabled: false,
            discount_type: 'generic',
            discount_value: 'percentage',
            discount_value_amount: ''
        },
        htmlContent: htmlContent, // Use original HTML content directly
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Return the new API structure
    return {
        name: surveyData.name || 'Survey #1',
        survey_type: mapChannelTypesToSurveyType(surveyData.channelTypes || ['thankyou']),
        status: mapIsActiveToStatus(surveyData.isActive),
        is_active: surveyData.isActive !== undefined ? surveyData.isActive : true,
        survey_meta_data: existingCompleteData
    };
};

/**
 * Validates the survey data structure for API submission
 * @param {Object} surveyData - The survey data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateSurveyForAPI = (surveyData) => {
    const errors = [];
    
    if (!surveyData.name || typeof surveyData.name !== 'string') {
        errors.push('Survey name is required and must be a string');
    }
    
    if (!surveyData.survey_type || !['post_purchase', 'site_widget', 'email', 'exit_intent', 'embedded'].includes(surveyData.survey_type)) {
        errors.push('Survey type must be one of: post_purchase, site_widget, email, exit_intent, embedded');
    }
    
    if (!surveyData.status || !['active', 'inactive', 'draft'].includes(surveyData.status)) {
        errors.push('Status must be one of: active, inactive, draft');
    }
    
    if (typeof surveyData.is_active !== 'boolean') {
        errors.push('is_active must be a boolean value');
    }
    
    if (!surveyData.survey_meta_data || typeof surveyData.survey_meta_data !== 'object') {
        errors.push('survey_meta_data is required and must be an object');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Maps channel types to survey types for API
 * @param {Array} channelTypes - Array of channel type strings
 * @returns {string} Survey type string
 */
export const mapChannelTypesToSurveyType = (channelTypes) => {
    if (!Array.isArray(channelTypes)) return 'post_purchase';
    
    if (channelTypes.includes('email')) return 'email';
    if (channelTypes.includes('onsite')) return 'site_widget';
    if (channelTypes.includes('exit')) return 'exit_intent';
    if (channelTypes.includes('embed')) return 'embedded';
    return 'post_purchase'; // default
};

/**
 * Maps isActive boolean to status string for API
 * @param {boolean} isActive - Whether the survey is active
 * @returns {string} Status string
 */
export const mapIsActiveToStatus = (isActive) => {
    return isActive ? 'active' : 'inactive';
};

/**
 * Generates JavaScript content for the survey to be used in the storefront
 * @param {Object} surveyData - The survey data object
 * @returns {string} - JavaScript code as a string
 */
export const generateSurveyJavaScriptContent = (surveyData) => {
    return generateSurveyJavaScript(surveyData);
};

