import { v4 as uuidv4 } from 'uuid';

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
        'rating': 'Rating',
        'text': 'Text Input',
        'multiple_choice': 'Multiple Choice',
        'checkbox': 'Checkbox',
        'card': 'Card'
    };
    
    return typeMap[type] || type;
};

/**
 * Generates clean HTML content for survey storage and storefront rendering
 * @param {Object} surveyData - The survey data object
 * @param {string} htmlContent - The HTML content from the preview component
 * @returns {string} Clean HTML content ready for backend storage
 */
export const generateCleanSurveyHTML = (surveyData, htmlContent) => {
    // Extract the main content from the preview (excluding outer wrapper)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get the content inside data-preview-content attribute
    const mainContent = tempDiv.querySelector('[data-preview-content]');
    const surveyContent = mainContent ? mainContent.innerHTML : htmlContent;
    
    // Clean the HTML content - remove any scripts, event handlers, and console logs
    const cleanHTML = surveyContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .replace(/console\.log\([^)]*\)/g, '') // Remove console logs
        .replace(/onClick\s*=/gi, '') // Remove React onClick handlers
        .replace(/onMouseOver\s*=/gi, '') // Remove mouse event handlers
        .replace(/onMouseOut\s*=/gi, '') // Remove mouse event handlers
        .replace(/onMouseDown\s*=/gi, '') // Remove mouse event handlers
        .replace(/onMouseUp\s*=/gi, ''); // Remove mouse event handlers
    
    return cleanHTML;
};

/**
 * Generates complete HTML document with meta and body tags (no JavaScript)
 * @param {Object} surveyData - The survey data object
 * @param {string} htmlContent - The HTML content from the preview component
 * @returns {string} Complete HTML document ready for standalone use
 */
export const generateCompleteSurveyHTML = (surveyData, htmlContent) => {
    // Extract the main content from the preview (excluding outer wrapper)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get the content inside data-preview-content attribute
    const mainContent = tempDiv.querySelector('[data-preview-content]');
    const surveyContent = mainContent ? mainContent.innerHTML : htmlContent;
    
    // Clean the HTML content first
    const cleanHTML = surveyContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/console\.log\([^)]*\)/g, '')
        .replace(/onClick\s*=/gi, '')
        .replace(/onMouseOver\s*=/gi, '')
        .replace(/onMouseOut\s*=/gi, '')
        .replace(/onMouseDown\s*=/gi, '')
        .replace(/onMouseUp\s*=/gi, '');
    
    // Create complete HTML document with body tag
    const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${surveyData.name || 'Survey'} - Customer feedback form">
    <meta name="robots" content="noindex, nofollow">
    <title>${surveyData.name || 'Survey'}</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.5;
            color: #202223;
            background: #f6f6f7;
            margin: 0;
            padding: 0;
        }
        
        /* Ensure all interactive elements are accessible */
        button:focus,
        input:focus,
        textarea:focus {
            outline: 2px solid #2c6ecb;
            outline-offset: 2px;
        }
        
        /* Survey-specific styles */
        .th-sf-survey-container {
            padding: 32px;
            background: #f6f6f7;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .th-sf-survey-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
            margin-bottom: 32px;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .th-sf-survey-container {
                padding: 16px;
            }
            
            .th-sf-survey-card {
                max-width: 100%;
            }
        }
        
        /* Print styles */
        @media print {
            .th-sf-survey-container {
                background: white;
                padding: 0;
            }
            
            .th-sf-survey-card {
                box-shadow: none;
                border: 1px solid #ccc;
            }
        }
    </style>
</head>
<body>
    <div class="th-sf-survey-container">
        ${cleanHTML}
    </div>
</body>
</html>`;
    
    return completeHTML;
};

/**
 * Generates just the body content for embedding in existing pages
 * @param {string} htmlContent - The HTML content from the preview component
 * @returns {string} Body content only
 */
export const generateSurveyBodyContent = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get the content inside data-preview-content attribute
    const mainContent = tempDiv.querySelector('[data-preview-content]');
    return mainContent ? mainContent.innerHTML : htmlContent;
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} htmlContent - Raw HTML content
 * @returns {string} Sanitized HTML content
 */
export const sanitizeHTML = (htmlContent) => {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    const allowedTags = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'button', 'a', 'img'];
    const allowedAttributes = ['style', 'class', 'id', 'href', 'src', 'alt'];
    
    // This is a basic implementation - consider using DOMPurify for production
    return htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
};

/**
 * Prepares survey data for backend storage
 * @param {Object} surveyData - The survey data object
 * @param {string} htmlContent - The HTML content from the preview component
 * @returns {Object} Formatted data for backend
 */
export const prepareSurveyForBackend = (surveyData, htmlContent) => {
    const sanitizedHTML = sanitizeHTML(htmlContent);
    
    // Prepare the existing complete survey data structure
    const existingCompleteData = {
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


