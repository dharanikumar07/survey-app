# Response Component

This component displays survey responses in a table format, mirroring the design of the SEA Post Purchase Survey App. It includes comprehensive filtering, sorting, and pagination capabilities.

## Features

### 🎯 Core Functionality
- **Response Table**: Displays survey responses with questions and answers
- **Tabs**: Active/Archived responses filtering
- **Search**: Real-time search across response IDs and survey names
- **Filtering**: Multiple filter options (by survey, answer type, etc.)
- **Sorting**: Sort by date, ID, or survey name
- **Pagination**: Configurable items per page with navigation
- **Export Banner**: Informational banner about exporting responses

### 📊 Data Display
- **Response ID**: Unique identifier with timestamp
- **Survey Name**: Associated survey
- **Question**: Individual survey questions
- **Answer Type**: Type of answer (Number scale, Short answer, Yes/No)
- **Answer**: Actual response value
- **Actions**: View and delete response options

### 🔧 Interactive Elements
- **View Response**: Modal showing detailed response information
- **Delete Response**: Remove individual responses
- **Filter Popover**: Dropdown for filtering options
- **Sort Popover**: Dropdown for sorting options
- **Search Field**: Real-time search with clear functionality

## Data Structure

### Mock Data Structure

```javascript
const mockResponses = [
    {
        id: "9NXV6",                    // Unique response ID
        surveyId: "1",                  // Survey identifier
        surveyName: "Survey #1",        // Survey display name
        date: "Aug 12, 2025 at 18:09 PM", // Response timestamp
        status: "Active",               // Response status
        questions: [                    // Array of questions and answers
            {
                id: "q1",               // Question identifier
                question: "How likely are you to recommend us to a friend?",
                answerType: "Number scale", // Type of answer expected
                answer: "8/10",         // Actual answer
                questionType: "rating"  // Internal question type
            }
        ]
    }
];
```

### Required Fields for API Integration

When implementing with real API data, ensure your response objects include:

- `id`: Unique response identifier
- `surveyId`: Survey reference ID
- `surveyName`: Human-readable survey name
- `date`: ISO date string or formatted date
- `status`: Response status (Active/Archived)
- `questions`: Array of question-answer pairs

## Implementation Guide

### 1. Replace Mock Data

```javascript
// Replace this import
import { mockResponses, filterOptions, sortOptions } from './mockData';

// With your API data
const [responses, setResponses] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
    const fetchResponses = async () => {
        setLoading(true);
        try {
            const data = await api.getResponses();
            setResponses(data);
        } catch (error) {
            console.error('Failed to fetch responses:', error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchResponses();
}, []);
```

### 2. Implement API Actions

```javascript
const handleDeleteResponse = async (responseId) => {
    try {
        await api.deleteResponse(responseId);
        // Refresh responses or remove from state
        setResponses(prev => prev.filter(r => r.id !== responseId));
    } catch (error) {
        console.error('Failed to delete response:', error);
    }
};

const handleExportResponses = async () => {
    try {
        const exportData = await api.exportResponses(selectedResponses);
        // Handle export download
    } catch (error) {
        console.error('Failed to export responses:', error);
    }
};
```

### 3. Add Loading States

```javascript
// Add loading state to table
<IndexTable
    resourceName={resourceName}
    itemCount={tableRows.length}
    headings={[...]}
    selectable={false}
    loading={loading}
>
    {loading ? (
        <IndexTable.Row>
            <IndexTable.Cell colSpan={6}>
                <Box padding="4" textAlign="center">
                    <Text>Loading responses...</Text>
                </Box>
            </IndexTable.Cell>
        </IndexTable.Row>
    ) : (
        rowMarkup
    )}
</IndexTable>
```

### 4. Add Error Handling

```javascript
const [error, setError] = useState(null);

// In your API calls
try {
    const data = await api.getResponses();
    setResponses(data);
    setError(null);
} catch (error) {
    setError('Failed to load responses. Please try again.');
}

// Display error banner
{error && (
    <Banner
        title={error}
        tone="critical"
        action={{
            content: 'Retry',
            onAction: () => fetchResponses()
        }}
        onDismiss={() => setError(null)}
    />
)}
```

## Customization

### Styling
- Uses Polaris design system components
- Follows Shopify's design guidelines
- Customizable through Polaris theme tokens

### Filter Options
Add new filter options by updating the `filterOptions` array:

```javascript
export const filterOptions = [
    { label: "All responses", value: "all" },
    { label: "New Filter", value: "new_filter" },
    // ... existing options
];
```

### Sort Options
Add new sorting options by updating the `sortOptions` array:

```javascript
export const sortOptions = [
    { label: "Date (Newest)", value: "date_desc" },
    { label: "New Sort", value: "new_sort" },
    // ... existing options
];
```

## Dependencies

- **@shopify/polaris**: UI component library
- **@shopify/polaris-icons**: Icon set
- **React**: Core framework
- **React Hooks**: State management

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills if needed)

## Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support

## Performance Considerations

- Pagination to handle large datasets
- Debounced search input
- Efficient filtering and sorting
- Lazy loading for response details

## Future Enhancements

- [ ] Bulk actions (select multiple responses)
- [ ] Advanced filtering (date ranges, custom criteria)
- [ ] Export functionality (CSV, Excel)
- [ ] Response analytics and charts
- [ ] Real-time updates via WebSocket
- [ ] Response templates and automation
