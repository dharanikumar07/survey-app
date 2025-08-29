# Shopify Storefront Integration Example

This document provides examples of how to integrate the survey into different Shopify storefront contexts.

## Basic Integration

The most basic integration involves loading the HTML content and the JavaScript file:

```liquid
<div id="survey-container">
  {{ survey.html_content }}
</div>

<script src="{{ 'survey-transitions.js' | asset_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const survey = initSurveyStorefront('survey-container');
    survey.init();
  });
</script>
```

## Post-Purchase Survey

To display the survey on the thank you page after purchase:

```liquid
{% if checkout.order %}
  <div class="post-purchase-survey" id="survey-container">
    {{ shop.metafields.your_app.survey_html }}
  </div>

  <script src="{{ 'survey-transitions.js' | asset_url }}"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const survey = initSurveyStorefront('survey-container', {
        onComplete: function(answers) {
          // Send answers to your API with the order ID
          fetch('/api/survey-answers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: '{{ checkout.order.id }}',
              answers: answers
            }),
          });
        }
      });
      
      survey.init();
    });
  </script>
{% endif %}
```

## Modal/Popup Survey

To display the survey as a modal or popup:

```liquid
<div id="survey-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;">
  <div id="survey-container" style="max-width: 600px; width: 90%; background: white; border-radius: 8px; overflow: hidden;">
    {{ shop.metafields.your_app.survey_html }}
  </div>
</div>

<script src="{{ 'survey-transitions.js' | asset_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the survey
    const survey = initSurveyStorefront('survey-container');
    survey.init();
    
    // Show the modal after 5 seconds
    setTimeout(function() {
      document.getElementById('survey-modal').style.display = 'flex';
    }, 5000);
    
    // Close modal when clicking outside
    document.getElementById('survey-modal').addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  });
</script>
```

## Exit Intent Survey

To display the survey when the user is about to leave the page:

```liquid
<div id="exit-survey-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;">
  <div id="survey-container" style="max-width: 600px; width: 90%; background: white; border-radius: 8px; overflow: hidden;">
    {{ shop.metafields.your_app.survey_html }}
  </div>
</div>

<script src="{{ 'survey-transitions.js' | asset_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the survey
    const survey = initSurveyStorefront('survey-container');
    survey.init();
    
    // Show survey on exit intent
    document.addEventListener('mouseout', function(e) {
      // If the mouse leaves the top of the page
      if (e.clientY < 0 && !sessionStorage.getItem('exitSurveyShown')) {
        document.getElementById('exit-survey-modal').style.display = 'flex';
        sessionStorage.setItem('exitSurveyShown', 'true');
      }
    });
    
    // Close modal when clicking outside
    document.getElementById('exit-survey-modal').addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  });
</script>
```

## Embedded in Product Page

To embed the survey in a product page:

```liquid
{% if product.metafields.your_app.has_survey %}
  <div class="product-survey-section">
    <h2>We'd Love Your Feedback</h2>
    <div id="survey-container">
      {{ shop.metafields.your_app.product_survey_html }}
    </div>
  </div>

  <script src="{{ 'survey-transitions.js' | asset_url }}"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const survey = initSurveyStorefront('survey-container', {
        onComplete: function(answers) {
          // Send answers to your API with the product ID
          fetch('/api/survey-answers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: '{{ product.id }}',
              answers: answers
            }),
          });
        }
      });
      
      survey.init();
    });
  </script>
{% endif %}
```

## Advanced Configuration

You can customize the survey behavior with additional options:

```liquid
<div id="survey-container">
  {{ survey.html_content }}
</div>

<script src="{{ 'survey-transitions.js' | asset_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const survey = initSurveyStorefront('survey-container', {
      // Customize animation direction
      slideDirection: 'vertical', // 'horizontal' or 'vertical'
      
      // Customize animation duration
      animationDuration: 600, // ms
      
      // Custom selectors if needed
      questionSelector: '.th-sf-survey-question-area',
      nextButtonSelector: '.th-sf-survey-next-button',
      prevButtonSelector: '.th-sf-survey-prev-button',
      
      // Callback when an answer is selected
      onAnswer: function(questionIndex, value, allAnswers) {
        console.log('Question', questionIndex, 'answered:', value);
        // Track answer events
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'survey_answer',
          'questionIndex': questionIndex,
          'value': value
        });
      },
      
      // Callback when the survey is completed
      onComplete: function(answers) {
        console.log('Survey completed!', answers);
        // Show a thank you message
        alert('Thank you for completing our survey!');
        // Submit answers to your API
        fetch('/api/survey-answers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            surveyId: '{{ survey.id }}',
            answers: answers
          }),
        });
      }
    });
    
    survey.init();
  });
</script>
```

## Troubleshooting

If you encounter issues with the survey in your storefront:

1. **Survey not displaying**: Check that the HTML content is being loaded correctly
2. **JavaScript errors**: Make sure the survey-transitions.js file is accessible
3. **Styling issues**: Check for CSS conflicts with your theme
4. **Initialization problems**: Verify the container ID matches your HTML structure
5. **Mobile issues**: Test on different devices and adjust responsive styling if needed
