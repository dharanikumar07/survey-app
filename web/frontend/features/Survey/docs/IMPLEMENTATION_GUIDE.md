# Survey Transitions Implementation Guide

## Overview

This guide explains how to implement the survey transitions system in your application. The system consists of:

1. **React-based Preview** in the admin panel
2. **Vanilla JS Implementation** for the storefront

## Implementation Steps

### Step 1: Understand the Architecture

The survey transitions system uses a two-file approach:
- HTML content is generated from the React preview component
- JavaScript functionality is provided by a separate file

This separation allows for:
- Clean HTML without embedded JavaScript
- Better security and performance
- Easier maintenance and updates

### Step 2: Use the SurveyPreview Component

The `SurveyPreview.jsx` component provides methods to get both HTML and JavaScript content:

```jsx
// In your component that uses SurveyPreview
const surveyPreviewRef = useRef(null);

// When saving the survey
const handleSaveSurvey = () => {
  if (surveyPreviewRef.current) {
    const htmlContent = surveyPreviewRef.current.getBodyContent();
    
    // Save only HTML to your backend
    saveSurvey(surveyData, htmlContent);
  }
};

// Render the SurveyPreview component
<SurveyPreview ref={surveyPreviewRef} />
```

### Step 3: Update Your API Service

Modify your API service to send only HTML content:

```javascript
// In your API service
export const saveSurvey = async (surveyData, htmlContent) => {
  try {
    const formattedData = prepareSurveyForBackend(surveyData, htmlContent);
    
    const response = await fetch('/api/surveys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error saving survey:', error);
    throw error;
  }
};
```

### Step 4: Deploy the JavaScript File as a Static Asset

Instead of sending JavaScript via API, deploy it as a static asset:

#### Option 1: Deploy to Shopify Theme
Upload the JavaScript file to your Shopify theme assets:

```php
// In your PHP controller or deployment script
public function deployJavaScriptAsset()
{
    // Get the JavaScript content from the file
    $jsContent = file_get_contents(base_path('web/frontend/features/Survey/utils/surveyStorefront.js'));
    
    // Minify if needed
    $minifiedJs = $jsContent; // Use a minifier library in production
    
    // Upload to Shopify theme
    $shop = Auth::user();
    $shopify = $shop->api();
    
    $shopify->rest('PUT', '/admin/api/2023-04/themes/123456789/assets.json', [
        'asset' => [
            'key' => 'assets/survey-transitions.js',
            'value' => $minifiedJs
        ]
    ]);
    
    return response()->json(['success' => true]);
}
```

#### Option 2: Host on CDN
Deploy the JavaScript file to a CDN for better performance:

```php
// In your deployment script
public function deployToS3()
{
    // Get the JavaScript content from the file
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

### Step 5: Embed in Storefront

#### Option 1: Using Shopify Theme Asset

```liquid
<div id="survey-container">
  {{ survey.html_content }}
</div>

<!-- Load the JavaScript from theme assets -->
<script src="{{ 'survey-transitions.js' | asset_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const survey = initSurveyStorefront('survey-container');
    survey.init();
  });
</script>
```

#### Option 2: Using CDN

```liquid
<div id="survey-container">
  {{ survey.html_content }}
</div>

<!-- Load the JavaScript from CDN -->
<script src="https://your-cdn.com/assets/survey-transitions.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const survey = initSurveyStorefront('survey-container');
    survey.init();
  });
</script>
```

### Step 6: Test in Different Environments

Test your survey in:
- Desktop browsers
- Mobile devices
- Different Shopify themes
- Various page contexts (product page, cart page, etc.)

## Best Practices

1. **Keep HTML Clean**: Ensure the HTML content doesn't contain any JavaScript
2. **Separate Concerns**: Maintain clear separation between structure (HTML) and behavior (JS)
3. **Cache JavaScript**: If possible, serve the JavaScript file with appropriate cache headers
4. **Minify for Production**: Minify the JavaScript file before serving it in production
5. **Version Control**: Add version numbers to your JavaScript file for cache busting
6. **Error Handling**: Add error handling in the JavaScript to prevent breaking the page
7. **Accessibility**: Ensure the survey is accessible to all users

## Troubleshooting

If you encounter issues:

1. **Check Browser Console**: Look for JavaScript errors
2. **Verify HTML Structure**: Ensure the HTML structure matches what the JS expects
3. **Check Selectors**: Verify that the CSS selectors in the JS match the HTML
4. **Test in Isolation**: Test the survey in a simple HTML page to isolate issues
5. **Check for Conflicts**: Look for conflicts with other JavaScript on the page

## Further Resources

- See `SURVEY_TRANSITIONS.md` for detailed architecture documentation
- See `STOREFRONT_EXAMPLE.md` for example implementations in different contexts
