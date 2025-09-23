import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  Box, 
  ResourceList, 
  ResourceItem, 
  Avatar, 
  Button,
  TextField,
  EmptyState,
  Badge
} from '@shopify/polaris';
import './SurveySelection.css';

/**
 * Survey Selection Component
 * Allows selecting a survey to include in the email
 */
export default function SurveySelection() {
  // State for search query
  const [searchValue, setSearchValue] = useState('');
  
  // State for selected survey
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  
  // Sample survey data
  const surveys = [
    { 
      id: '1', 
      title: 'Product Feedback Survey', 
      questions: 5, 
      status: 'active',
      lastUpdated: '2 days ago'
    },
    { 
      id: '2', 
      title: 'Customer Satisfaction Survey', 
      questions: 8, 
      status: 'active',
      lastUpdated: '1 week ago'
    },
    { 
      id: '3', 
      title: 'Post-Purchase Experience', 
      questions: 3, 
      status: 'inactive',
      lastUpdated: '3 weeks ago'
    },
    { 
      id: '4', 
      title: 'Website Usability Survey', 
      questions: 6, 
      status: 'active',
      lastUpdated: '1 month ago'
    }
  ];

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  // Filter surveys based on search
  const filteredSurveys = surveys.filter(survey => 
    survey.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle survey selection
  const handleSurveySelect = (surveyId) => {
    const survey = surveys.find(s => s.id === surveyId);
    setSelectedSurvey(survey);
  };

  // Get status badge markup
  const getStatusBadge = (status) => {
    return (
      <Badge status={status === 'active' ? 'success' : 'critical'}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  return (
    <Card>
      <Box padding="400">
        <Text variant="headingMd">Select Survey</Text>
        
        <Box paddingBlockStart="400">
          <TextField
            label="Search"
            labelHidden
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search surveys"
            clearButton
            onClearButtonClick={() => setSearchValue('')}
            autoComplete="off"
          />
        </Box>
        
        <Box paddingBlockStart="400">
          {filteredSurveys.length > 0 ? (
            <ResourceList
              resourceName={{ singular: 'survey', plural: 'surveys' }}
              items={filteredSurveys}
              renderItem={(item) => {
                const { id, title, questions, status, lastUpdated } = item;
                const isSelected = selectedSurvey && selectedSurvey.id === id;
                
                return (
                  <ResourceItem
                    id={id}
                    onClick={() => handleSurveySelect(id)}
                    media={
                      <Avatar size="medium" initials={title.charAt(0)} />
                    }
                    accessibilityLabel={`Select ${title}`}
                    shortcutActions={[
                      {
                        content: 'Preview',
                        accessibilityLabel: `Preview ${title}`,
                        onAction: () => console.log(`Preview survey ${id}`)
                      }
                    ]}
                  >
                    <div className="survey-item">
                      <div className="survey-details">
                        <Text variant="bodyMd" fontWeight="bold">{title}</Text>
                        <div className="survey-meta">
                          <Text variant="bodySm" color="subdued">
                            {questions} questions • Updated {lastUpdated}
                          </Text>
                          {getStatusBadge(status)}
                        </div>
                      </div>
                      <div className="survey-actions">
                        <Button 
                          size="slim" 
                          primary={!isSelected}
                          outline={isSelected}
                          onClick={() => handleSurveySelect(id)}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </ResourceItem>
                );
              }}
            />
          ) : (
            <EmptyState
              heading="No surveys found"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Try changing your search parameters.</p>
            </EmptyState>
          )}
        </Box>
        
        {selectedSurvey && (
          <Box paddingBlockStart="400">
            <div className="selected-survey">
              <Text variant="headingSm">Selected Survey:</Text>
              <Text variant="bodyMd" fontWeight="bold">{selectedSurvey.title}</Text>
              <Button 
                plain 
                destructive 
                onClick={() => setSelectedSurvey(null)}
              >
                Remove
              </Button>
            </div>
          </Box>
        )}
      </Box>
    </Card>
  );
}