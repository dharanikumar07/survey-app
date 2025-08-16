// Helper function to generate unique IDs for questions and options
export const generateId = (prefix = 'item') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        title: surveyData.title,
        questions: surveyData.questions.map(q => ({
            content: q.content,
            type: q.type,
            description: q.description,
            questionType: q.questionType,
            answerOptions: q.answerOptions || []
        })),
        channels: surveyData.channels || [],
        discount: surveyData.discount || null
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
 * Generates complete HTML content for survey storage and storefront rendering
 * @param {Object} surveyData - The survey data object
 * @param {string} htmlContent - The HTML content from the preview component
 * @returns {string} Complete HTML document
 */
export const generateSurveyHTML = (surveyData, htmlContent) => {
    // Extract the main content from the preview (excluding outer wrapper)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get the content inside data-preview-content attribute
    const mainContent = tempDiv.querySelector('[data-preview-content]');
    const surveyContent = mainContent ? mainContent.innerHTML : htmlContent;
    
    // Create complete HTML document with body tag
    const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        }
        
        /* Ensure all interactive elements are accessible */
        button:focus,
        input:focus,
        textarea:focus {
            outline: 2px solid #2c6ecb;
            outline-offset: 2px;
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
    </style>
</head>
<body>
    <div class="th-sf-survey-container" style="padding: 32px; background: #f6f6f7; min-height: 100vh;">
        ${surveyContent}
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
    
    return {
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
        completeHTML: generateSurveyHTML(surveyData, sanitizedHTML),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
};
