# Survey Feature Structure

This document outlines the clean, organized structure of the Survey feature components.

## Folder Organization

```
web/frontend/features/Survey/
├── Index.jsx                           # Main Survey page component
├── actions/                            # API and business logic hooks
│   └── use-survey-api.jsx             # Survey API operations
├── components/                         # UI components organized by functionality
│   ├── common/                        # Shared components used across tabs
│   │   ├── CustomToggle.jsx           # Reusable toggle component
│   │   ├── ModalHeader.jsx            # Modal header with view/theme options
│   │   └── TabsContent.jsx            # Tab navigation and content rendering
│   ├── layout/                        # Layout components
│   │   └── SurveyLayout.jsx           # Main survey layout container
│   ├── sidebar/                       # Sidebar-specific components
│   │   └── Sidebar.jsx                # Main sidebar container
│   ├── tabs/                          # Tab content components
│   │   ├── ContentTab.jsx             # Survey questions management
│   │   ├── ChannelTab.jsx             # Channel configuration
│   │   └── DiscountTab.jsx            # Discount settings
│   ├── panels/                        # Question management panels
│   │   ├── QuestionList.jsx           # Question list with integrated tabs
│   │   ├── QuestionSettings.jsx       # Question editing interface
│   │   └── SurveyPreview.jsx          # Survey preview component
│   └── modal/                         # Modal-related components
│       └── SurveyModalContent.jsx     # Survey modal content
├── hooks/                             # Custom hooks for survey logic
│   └── useSurveyState.js              # Survey state management hook
├── utils/                             # Utility functions
│   └── surveyHelpers.js               # Survey helper functions
└── STRUCTURE.md                        # This documentation file
```

## Key Improvements

### 1. **Logical Grouping**
- **common/**: Shared components used across multiple tabs
- **sidebar/**: All sidebar-related functionality
- **tabs/**: Tab content components
- **panels/**: Question management interface
- **modal/**: Modal components
- **layout/**: Layout structure components

### 2. **Direct Import Paths**
- No barrel files (index.js re-exports) to avoid confusion
- Direct imports from component files for clarity
- Clear component hierarchy and easy to trace origins

### 3. **State Management**
- Extracted survey-specific state to `useSurveyState` hook
- Cleaner separation of concerns
- Easier to maintain and test

### 4. **Utility Functions**
- Centralized helper functions in `utils/`
- Reusable validation and formatting logic
- Better code organization

## Import Examples

### Before (Old Structure)
```jsx
import ModalHeader from "./components/ModalHeader";
import SurveyModalContent from "./components/SurveyModalContent";
import useStore from "../../../State/store";
```

### After (New Structure - Direct Imports)
```jsx
import ModalHeader from "./components/common/ModalHeader";
import SurveyModalContent from "./components/modal/SurveyModalContent";
import { useSurveyState } from "./hooks/useSurveyState";
```

## Benefits

1. **Maintainability**: Easy to find and modify related components
2. **Scalability**: Clear places to add new features
3. **Reusability**: Common components are properly separated
4. **Testing**: Easier to test components in isolation
5. **Team Collaboration**: Clear ownership and responsibility areas
6. **Code Navigation**: Intuitive folder structure for developers
7. **Import Clarity**: Direct imports make it obvious where components come from
8. **No Confusion**: Eliminates barrel file complexity for other developers

## Migration Notes

- All components now use the `useSurveyState` hook instead of directly importing from the global store
- **No barrel files (index.js) used** - all imports are direct from component files
- Import paths have been updated to reflect the new structure with direct imports
- The app maintains full functionality while being better organized
- Build process validates that all imports are working correctly

## Recent Refactoring

- **TabsContent Component**: Moved tab functionality from `QuestionList` into `TabsContent` for better separation of concerns
- **QuestionList Component**: Now focuses solely on survey management, importing `TabsContent` for tab functionality
- **Cleaner Architecture**: Each component now has a single, focused responsibility

## Direct Import Philosophy

This structure intentionally avoids barrel files (index.js re-exports) because:

- **Developer Clarity**: Other developers can immediately see where components are imported from
- **Easier Debugging**: No need to trace through multiple index.js files to find the actual component
- **Reduced Confusion**: Eliminates the "where did this component come from?" question
- **Better IDE Support**: IDEs can better track component usage and provide accurate autocomplete
- **Simpler Refactoring**: Moving components doesn't require updating barrel file exports

## Future Considerations

- Consider adding TypeScript for better type safety
- Add component documentation using JSDoc or Storybook
- Implement component testing for each subfolder
- Consider adding CSS modules for component-specific styling
