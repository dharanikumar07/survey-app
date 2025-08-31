# Survey Module Structure

## Component Structure

The survey module has been simplified to use a flat component hierarchy:

### Main Component: `SurveyLayout` 

`SurveyLayout.jsx` is now the main entry point that:
- Handles data loading through `SurveyLoader`
- Shows controls and buttons through `ModalHeader` 
- Displays the three-panel layout for editing surveys

This simplified architecture removes the need for a separate `SurveyPage.jsx` component, reducing unnecessary nesting.

### Key Components

1. **SurveyLayout**: Main component that orchestrates the entire survey editing experience
2. **SurveyLoader**: Handles loading survey data from API or JSON fallback
3. **ModalHeader**: Contains controls for view modes, save button, and other actions
4. **QuestionList**: Left panel showing the list of questions and tabs
5. **SurveyPreview**: Center panel showing the survey preview
6. **QuestionSettings**: Right panel for editing the selected question

## Data Flow

1. `SurveyLoader` initializes data from the store
2. User interacts with the editor through the three panels
3. Changes are saved to the store in real-time
4. When ready, the user clicks Save in the `ModalHeader`
5. Data is formatted and sent to the API

## Benefits of This Structure

- **Simplified Component Tree**: Removing unnecessary nesting improves performance
- **Clearer Responsibility**: Each component has a distinct role
- **Easier Maintenance**: Changes are isolated to specific components
- **Better Fit for Modal Context**: Works better within the Shopify admin modal

## Usage

To use the survey editor, simply import and render the SurveyLayout component:

```jsx
import SurveyLayout from './features/Survey/components/layout/SurveyLayout';

// To create a new survey
<SurveyLayout />

// To edit an existing survey
<SurveyLayout surveyId="123" />
```
