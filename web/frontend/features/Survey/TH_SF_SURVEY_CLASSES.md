# Team Heisenberg Survey CSS Classes Reference

This document provides a comprehensive reference of all CSS classes used in the survey components with the `th-sf-survey` prefix.

## Class Naming Convention

All survey-related CSS classes use the prefix `th-sf-survey-` to ensure:
- **Uniqueness**: No conflicts with existing CSS frameworks or themes
- **Maintainability**: Easy identification of survey-related styles
- **Scalability**: Consistent naming pattern for future components
- **Team Identity**: Clear ownership by Team Heisenberg

## Main Container Classes

### `th-sf-survey-preview-container`
- **Purpose**: Main wrapper for the entire survey preview
- **ID**: `th-sf-survey-preview-container`
- **Usage**: Primary container for the survey preview component

### `th-sf-survey-preview-content`
- **Purpose**: Content wrapper with data attribute for HTML capture
- **Data Attribute**: `data-preview-content`
- **Usage**: Main content area that gets captured for backend storage

## Survey Card Classes

### `th-sf-survey-card`
- **Purpose**: Main survey card container
- **Styles**: White background, rounded corners, shadow
- **Usage**: Wrapper for the entire survey content

### `th-sf-survey-card-content`
- **Purpose**: Content area within the survey card
- **Layout**: Flexbox column with centered alignment
- **Usage**: Organizes question content and navigation

### `th-sf-survey-question-area`
- **Purpose**: Area containing the question and answers
- **Layout**: Top padding for visual separation
- **Usage**: Wrapper for question content and answer options

## Question Content Classes

### `th-sf-survey-question-content`
- **Purpose**: Container for question text and description
- **Layout**: Flexbox column with centered alignment
- **Usage**: Wraps question heading and description

### `th-sf-survey-question-heading`
- **Purpose**: Main question text
- **Typography**: Large heading with center alignment
- **Usage**: Displays the actual question content

### `th-sf-survey-question-description`
- **Purpose**: Optional question description
- **Typography**: Body text with subdued color
- **Usage**: Provides additional context for questions

## Answer Area Classes

### `th-sf-survey-answer-area`
- **Purpose**: Container for all answer options
- **Layout**: Vertical spacing and full width
- **Usage**: Wraps rating scales, multiple choice, and text inputs

### `th-sf-survey-answer-content`
- **Purpose**: Content wrapper for answer options
- **Layout**: Flexbox column with centered alignment
- **Usage**: Organizes different types of answer options

## Rating Question Classes

### `th-sf-survey-rating-emoji`
- **Purpose**: Emoji display for rating questions
- **Typography**: Large emoji size (48px)
- **Usage**: Visual representation of rating scale

### `th-sf-survey-rating-text`
- **Purpose**: Text label for rating scale
- **Typography**: Body text with center alignment
- **Usage**: Describes the rating scale (e.g., "Not likely")

### `th-sf-survey-rating-scale`
- **Purpose**: Container for rating scale buttons
- **Layout**: Horizontal flexbox with gaps
- **Usage**: Wraps individual rating option buttons

### `th-sf-survey-rating-option`
- **Purpose**: Individual rating scale button
- **States**: Default, hover, selected
- **Usage**: Clickable rating options (1-6 scale)

### `th-sf-survey-rating-option-selected`
- **Purpose**: Selected state for rating options
- **Styles**: Different background color (#f1f8ff)
- **Usage**: Indicates the currently selected rating

## Multiple Choice Classes

### `th-sf-survey-multiple-choice-container`
- **Purpose**: Container for multiple choice options
- **Layout**: Full width with max-width constraint
- **Usage**: Wraps all multiple choice options

### `th-sf-survey-multiple-choice-option`
- **Purpose**: Individual multiple choice option
- **States**: Default, hover
- **Usage**: Clickable option with radio button

### `th-sf-survey-multiple-choice-radio`
- **Purpose**: Radio button visual indicator
- **Styles**: Circular border with no fill
- **Usage**: Visual representation of radio button

### `th-sf-survey-multiple-choice-text`
- **Purpose**: Text content of multiple choice option
- **Typography**: Body text
- **Usage**: Displays the option text

## Text Input Classes

### `th-sf-survey-text-input-container`
- **Purpose**: Container for text input field
- **Layout**: Full width with max-width constraint
- **Usage**: Wraps the text input area

### `th-sf-survey-text-input-field`
- **Purpose**: Actual text input field
- **Styles**: Bordered input with minimum height
- **Usage**: Area for users to type text responses

## Thank You Card Classes

### `th-sf-survey-thank-you-card`
- **Purpose**: Container for thank you message
- **Layout**: Centered content with flexbox
- **Usage**: Wraps thank you heading and description

### `th-sf-survey-thank-you-heading`
- **Purpose**: Thank you message heading
- **Typography**: Large heading with center alignment
- **Usage**: Main thank you message

### `th-sf-survey-thank-you-description`
- **Purpose**: Additional thank you text
- **Typography**: Body text with center alignment
- **Usage**: Secondary thank you message

## Navigation Classes

### `th-sf-survey-navigation`
- **Purpose**: Bottom navigation area
- **Styles**: Top border separator
- **Usage**: Contains progress indicators and next button

### `th-sf-survey-navigation-content`
- **Purpose**: Content within navigation area
- **Layout**: Flexbox with space-between alignment
- **Usage**: Organizes navigation elements

### `th-sf-survey-nav-spacer`
- **Purpose**: Left-side spacing element
- **Layout**: Fixed width for balance
- **Usage**: Maintains visual balance in navigation

### `th-sf-survey-progress-indicators`
- **Purpose**: Container for progress dots
- **Layout**: Horizontal flexbox with gaps
- **Usage**: Wraps progress indicator dots

### `th-sf-survey-progress-dot`
- **Purpose**: Individual progress indicator
- **Styles**: Small circular dots
- **Usage**: Shows survey progress

### `th-sf-survey-progress-dot-active`
- **Purpose**: Active progress indicator
- **Styles**: Dark color to indicate current position
- **Usage**: Shows current question position

### `th-sf-survey-next-button`
- **Purpose**: Next button for navigation
- **Styles**: Dark button with hover effects
- **Usage**: Advances to next question

## Footer Classes

### `th-sf-survey-branding-footer`
- **Purpose**: Footer area with branding
- **Layout**: Bottom padding for spacing
- **Usage**: Contains branding and help links

### `th-sf-survey-branding-text`
- **Purpose**: Footer text content
- **Typography**: Small text with center alignment
- **Usage**: Displays branding message

### `th-sf-survey-branding-link`
- **Purpose**: Help link in footer
- **Styles**: Blue color with no underline
- **Usage**: Links to help or upgrade options

## Development Classes

### `th-sf-survey-test-button-container`
- **Purpose**: Container for test button (dev only)
- **Layout**: Centered with bottom padding
- **Usage**: Wraps HTML capture test button

### `th-sf-survey-test-button`
- **Purpose**: Test button for HTML capture
- **Styles**: Blue button for development testing
- **Usage**: Tests HTML capture functionality

## CSS Selector Examples

### Targeting Specific Elements
```css
/* All survey elements */
[class*="th-sf-survey-"] {
    font-family: inherit;
}

/* Survey cards only */
.th-sf-survey-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Rating options with hover */
.th-sf-survey-rating-option:hover {
    transform: scale(1.05);
}

/* Active progress indicators */
.th-sf-survey-progress-dot-active {
    background-color: #000;
}
```

### Responsive Design
```css
@media (max-width: 768px) {
    .th-sf-survey-container {
        padding: 16px;
    }
    
    .th-sf-survey-card {
        max-width: 100%;
    }
}
```

### Custom Theming
```css
/* Custom color scheme */
.th-sf-survey-card {
    background: var(--custom-bg-color);
}

.th-sf-survey-next-button {
    background: var(--custom-primary-color);
}
```

## Benefits of This Naming Convention

1. **Namespace Isolation**: Prevents conflicts with existing CSS
2. **Easy Maintenance**: Clear identification of survey-related styles
3. **Team Ownership**: Clear indication of Team Heisenberg components
4. **Scalability**: Consistent pattern for future survey features
5. **Debugging**: Easy to identify survey-related styles in browser dev tools
6. **Customization**: Simple to override or extend with custom CSS

## Future Considerations

- **Theme System**: Consider adding theme-specific class modifiers
- **State Classes**: Add classes for different survey states (loading, error, etc.)
- **Animation Classes**: Add classes for transitions and animations
- **Accessibility Classes**: Add classes for screen reader support
- **Print Classes**: Add classes for print-friendly styles
