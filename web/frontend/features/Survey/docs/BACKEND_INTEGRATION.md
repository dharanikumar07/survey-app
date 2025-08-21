# Backend Integration Guide

## Overview

This document explains how to integrate the survey system with your backend API. The key principle is: **HTML content is sent via API, JavaScript is deployed as a static asset**.

## API Structure

### What to Send via API

**✅ DO send:**
- Survey metadata (name, type, status, etc.)
- HTML content (clean HTML without JavaScript)
- Question data
- Configuration options

**❌ DON'T send:**
- JavaScript code
- Inline event handlers
- React-specific code

### API Endpoint Example

```php
// POST /api/surveys
public function store(Request $request)
{
    $data = $request->validate([
        'name' => 'required|string',
        'survey_type' => 'required|string',
        'status' => 'required|string',
        'is_active' => 'required|boolean',
        'survey_meta_data' => 'required|array',
        'survey_meta_data.html_content' => 'required|string',
        'survey_meta_data.questions' => 'required|array',
        // ... other validation rules
    ]);

    // Save survey to database
    $survey = Survey::create($data);

    return response()->json([
        'success' => true,
        'survey' => $survey
    ]);
}
```

## Database Schema

### Surveys Table

```sql
CREATE TABLE surveys (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    survey_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    survey_meta_data JSON NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Survey Meta Data Structure

```json
{
    "name": "Customer Feedback Survey",
    "isActive": true,
    "questions": [
        {
            "id": "question_1",
            "type": "rating",
            "content": "How would you rate our service?",
            "answerOptions": []
        }
    ],
    "htmlContent": "<div class=\"th-sf-survey-container\">...</div>",
    "cleanHTML": "<div class=\"th-sf-survey-container\">...</div>",
    "completeHTML": "<!DOCTYPE html><html>...</html>"
}
```

## JavaScript Deployment

### Option 1: Deploy to Shopify Theme

```php
// In your deployment script or controller
public function deployJavaScriptAsset()
{
    // Read the JavaScript file from your codebase
    $jsContent = file_get_contents(base_path('web/frontend/features/Survey/utils/surveyStorefront.js'));
    
    // Minify if needed (recommended for production)
    $minifiedJs = $jsContent; // Use a minifier library in production
    
    // Upload to Shopify theme
    $shop = Auth::user();
    $shopify = $shop->api();
    
    $shopify->rest('PUT', '/admin/api/2023-04/themes/{theme_id}/assets.json', [
        'asset' => [
            'key' => 'assets/survey-transitions.js',
            'value' => $minifiedJs
        ]
    ]);
    
    return response()->json(['success' => true]);
}
```

### Option 2: Deploy to CDN

```php
// In your deployment script
public function deployToS3()
{
    // Read the JavaScript file from your codebase
    $jsContent = file_get_contents(base_path('web/frontend/features/Survey/utils/surveyStorefront.js'));
    
    // Minify if needed
    $minifiedJs = $jsContent; // Use a minifier library in production
    
    // Upload to S3 or other CDN
    $s3 = new S3Client([/* your config */]);
    $s3->putObject([
        'Bucket' => 'your-bucket',
        'Key' => 'assets/survey-transitions.js',
        'Body' => $minifiedJs,
        'ContentType' => 'application/javascript',
        'CacheControl' => 'max-age=31536000' // Cache for 1 year
    ]);
    
    return true;
}
```

## Frontend Integration

### How the Frontend Sends Data

```javascript
// In your React component
const handleSaveSurvey = () => {
  if (surveyPreviewRef.current) {
    const htmlContent = surveyPreviewRef.current.getBodyContent();
    
    // Send only HTML content to backend
    saveSurvey(surveyData, htmlContent);
  }
};

// API call
const saveSurvey = async (surveyData, htmlContent) => {
  const response = await fetch('/api/surveys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: surveyData.name,
      survey_type: 'post_purchase',
      status: 'active',
      is_active: true,
      survey_meta_data: {
        htmlContent: htmlContent,
        questions: surveyData.questions,
        // ... other metadata
      }
    }),
  });
  
  return response.json();
};
```

## Storefront Usage

### How the Storefront Uses the Data

```liquid
<!-- Load HTML content from your API/database -->
<div id="survey-container">
  {{ survey.html_content }}
</div>

<!-- Load JavaScript from static asset (theme or CDN) -->
<script src="{{ 'survey-transitions.js' | asset_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const survey = initSurveyStorefront('survey-container');
    survey.init();
  });
</script>
```

## Benefits of This Approach

1. **Security**: No JavaScript embedded in HTML or sent via API
2. **Performance**: JavaScript can be cached separately by browsers
3. **Maintainability**: JavaScript can be updated independently of survey content
4. **Best Practices**: Follows web development standards
5. **Scalability**: Works better with CDNs and caching strategies

## Important Notes

1. **JavaScript is never sent via API** - it's always deployed as a static asset
2. **HTML content is clean** - no inline JavaScript or event handlers
3. **Deployment is separate** - JavaScript deployment happens independently of survey creation
4. **Caching is optimized** - JavaScript can be cached for long periods
5. **Security is improved** - no risk of XSS from embedded JavaScript

## Testing

Test your integration by:

1. Creating a survey in the admin panel
2. Verifying only HTML is sent to the API
3. Checking that JavaScript is deployed as a static asset
4. Testing the survey in a Shopify storefront
5. Verifying all functionality works correctly

## Support

If you have questions about this integration, refer to:
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [Storefront Examples](./STOREFRONT_EXAMPLE.md)
- [Survey Transitions Architecture](./SURVEY_TRANSITIONS.md)
