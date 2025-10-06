import React, { useState, useCallback } from 'react';
import { 
  Page,
  Spinner,
  Text,
  Banner,
  Icon,
  Button,
  InlineStack,
  Box,
  Select,
  TextField,
  LegacyCard,
  Tooltip,
  Popover,
  ActionList,
  Autocomplete,
  Badge,
  Modal
} from '@shopify/polaris';
import { SearchIcon, SendIcon } from '@shopify/polaris-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryEvents } from '../../components/helper/use-query-event';
import { useToast } from '../../components/helper/toast-helper';
import { usePostPurchaseEmailApi } from './action/use-post-purchase-email-api';
import EmailEditor from './components/EmailEditor';
import EmailPreview from './components/EmailPreview';
import './PostPurchaseEmail.css';

/**
 * Post Purchase Email component
 * A two-panel layout for email template editing with preview
 */
export default function PostPurchaseEmail() {
  // State for view mode (mobile, desktop, fullscreen)
  const [viewMode, setViewMode] = useState('desktop');
  
  // State for email content
  const [emailSubject, setEmailSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [footerContent, setFooterContent] = useState("");
  
  // State for survey search and selection
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const [searchValue, setSearchValue] = useState('');
  const [availableSurveys, setAvailableSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedSearchOptions, setSelectedSearchOptions] = useState([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // Send Test Email Modal state
  const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  
  // API hooks
  const { getPostPurchaseEmailData, savePostPurchaseEmailData, sendTestEmail } = usePostPurchaseEmailApi();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Toggle search field
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      // When activating search
      setSearchValue('');
      setSelectedSearchOptions([]);
    } else {
      // When closing search
      setSearchValue('');
      setFilteredSurveys(availableSurveys);
    }

  };

  // Update filtered surveys when search changes
  const handleSearchChange = useCallback(
    (value) => {
      setSearchValue(value);
      
      if (value === '') {
        setFilteredSurveys(availableSurveys);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = availableSurveys.filter((survey) =>
        survey.label.match(filterRegex)
      );
      setFilteredSurveys(resultOptions);
    },
    [availableSurveys]
  );

  // Handle survey selection from dropdown
  const handleSurveyChange = (value) => {
    setSelectedSurvey(value);
    updateSurveyContent(value);
  };

  // Handle survey selection from search results
  const handleSearchSelect = useCallback(
    (selected) => {
      if (selected.length > 0) {
        const selectedValue = selected[0];
        setSelectedSurvey(selectedValue);
        updateSurveyContent(selectedValue);
        
        // Find the selected survey
        const selectedSurvey = availableSurveys.find(s => s.value === selectedValue);
        if (selectedSurvey) {
          setSearchValue(selectedSurvey.label);
        }
        
        setIsSearchActive(false);
      }
      setSelectedSearchOptions(selected);
    },
    [availableSurveys]
  );

  // Update email content based on selected survey
  const updateSurveyContent = (surveyUuid) => {
    // Find the selected survey data
    const survey = availableSurveys.find(s => s.value === surveyUuid);
    if (survey && survey.emailData) {
      setEmailSubject(survey.emailData.subject || "");
      setMessageContent(survey.emailData.message || "");
      setFooterContent(survey.emailData.footer || "");
    }
  };

  // Fetch email data
  const { data: emailData } = useQueryEvents(
    useQuery({
      queryKey: ['post-purchase-email'],
      queryFn: getPostPurchaseEmailData
    }),
    {
      onSuccess: (response) => {
        console.log('Post Purchase Email data:', response);
        
        // Check if we have survey data
        if (response?.data) {
          // Handle direct array response format
          if (Array.isArray(response.data)) {
            const surveys = response.data.map(survey => ({
              label: survey.survey_name,
              value: survey.survey_uuid,
              emailData: survey.email_data,
              isActive: survey.is_active === 'active',
              status: survey.is_active === 'active' ? 'Active' : 'Inactive'
            }));
            
            setAvailableSurveys(surveys);
            setFilteredSurveys(surveys);
            
            // Select first active survey by default or keep current selection
            if (selectedSurvey) {
              // If we already have a selected survey, update its content
              const currentSurvey = surveys.find(survey => survey.value === selectedSurvey);
              if (currentSurvey) {
                // Update the content with the latest data
                setEmailSubject(currentSurvey.emailData.subject || "");
                setMessageContent(currentSurvey.emailData.message || "");
                setFooterContent(currentSurvey.emailData.footer || "");
              }
            } else {
              // First load - select first active survey
              const firstActiveSurvey = surveys.find(survey => survey.isActive);
              if (firstActiveSurvey) {
                setSelectedSurvey(firstActiveSurvey.value);
                
                // Set email content from the selected survey
                setEmailSubject(firstActiveSurvey.emailData.subject || "");
                setMessageContent(firstActiveSurvey.emailData.message || "");
                setFooterContent(firstActiveSurvey.emailData.footer || "");
              }
            }
          } 
          // Handle nested data array format
          else if (Array.isArray(response.data.data)) {
            const surveys = response.data.data.map(survey => ({
              label: survey.survey_name,
              value: survey.survey_uuid,
              emailData: survey.email_data,
              isActive: survey.is_active === 'active',
              status: survey.is_active === 'active' ? 'Active' : 'Inactive'
            }));
            
            setAvailableSurveys(surveys);
            setFilteredSurveys(surveys);
            
            // Select first active survey by default or keep current selection
            if (selectedSurvey) {
              // If we already have a selected survey, update its content
              const currentSurvey = surveys.find(survey => survey.value === selectedSurvey);
              if (currentSurvey) {
                // Update the content with the latest data
                setEmailSubject(currentSurvey.emailData.subject || "");
                setMessageContent(currentSurvey.emailData.message || "");
                setFooterContent(currentSurvey.emailData.footer || "");
              }
            } else {
              // First load - select first active survey
              const firstActiveSurvey = surveys.find(survey => survey.isActive);
              if (firstActiveSurvey) {
                setSelectedSurvey(firstActiveSurvey.value);
                
                // Set email content from the selected survey
                setEmailSubject(firstActiveSurvey.emailData.subject || "");
                setMessageContent(firstActiveSurvey.emailData.message || "");
                setFooterContent(firstActiveSurvey.emailData.footer || "");
              }
            }
          }
          // Handle single survey case
          else if (response.data.survey_uuid) {
            const survey = {
              label: response.data.survey_name,
              value: response.data.survey_uuid,
              emailData: response.data.email_data,
              isActive: response.data.is_active === 'active',
              status: response.data.is_active === 'active' ? 'Active' : 'Inactive'
            };
            
            setAvailableSurveys([survey]);
            setFilteredSurveys([survey]);
            setSelectedSurvey(survey.value);
            
            // Set email content
            setEmailSubject(survey.emailData.subject || "");
            setMessageContent(survey.emailData.message || "");
            setFooterContent(survey.emailData.footer || "");
          }
        }
        
        // Set loading to false after data processing is complete
        setIsLoading(false);
      },
      onError: (error) => {
        console.error('Error fetching post purchase email data:', error);
        showToast({
          message: 'Failed to load email template data',
          type: 'error'
        });
        
        // Set loading to false on error as well
        setIsLoading(false);
      }
    }
  );

  // Handle view mode changes
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Handle save email template
  const handleSaveEmail = async () => {
    if (!selectedSurvey) {
      showToast({
        message: 'Please select a survey first',
        type: 'error'
      });
      return;
    }

    setIsSaving(true);

    try {
      const emailData = {
        survey_uuid: selectedSurvey,
        email_data: {
          subject: emailSubject,
          message: messageContent,
          footer: footerContent
        }
      };

      const response = await savePostPurchaseEmailData(emailData);
      
      showToast({
        message: 'Email template saved successfully',
        type: 'success'
      });
      
      console.log('Save response:', response);
      
      // After successful save, refresh the data to get the latest updates
      await queryClient.invalidateQueries(['post-purchase-email']);
      
    } catch (error) {
      console.error('Error saving email template:', error);
      showToast({
        message: 'Failed to save email template',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Open test email modal
  const openTestEmailModal = () => {
    if (!selectedSurvey) {
      showToast({
        message: 'Please select a survey first',
        type: 'error'
      });
      return;
    }
    setIsTestEmailModalOpen(true);
    setTestEmailAddress('');
  };

  // Handle send test email
  const handleSendTestEmail = async () => {
    if (!testEmailAddress) {
      showToast({
        message: 'Please enter an email address',
        type: 'error'
      });
      return;
    }

    setIsSendingTest(true);

    try {
      const testEmailData = {
        survey_uuid: selectedSurvey,
        email: testEmailAddress,
        email_data: {
          subject: emailSubject,
          message: messageContent,
          footer: footerContent
        }
      };

      const response = await sendTestEmail(testEmailData);
      
      showToast({
        message: 'Test email sent successfully',
        type: 'success'
      });
      
      console.log('Test email response:', response);
      
      // Close the modal
      setIsTestEmailModalOpen(false);
      
      // After successful test email send, refresh the data to get the latest updates
      await queryClient.invalidateQueries(['post-purchase-email']);
      
    } catch (error) {
      console.error('Error sending test email:', error);
      showToast({
        message: 'Failed to send test email',
        type: 'error'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Combine message and footer for the preview
  const emailContent = `
    ${messageContent}
    ${footerContent}
  `;

  // Create survey options with status in parentheses
  const surveyOptions = availableSurveys.map(survey => ({
    label: `${survey.label} (${survey.isActive ? 'Active' : 'Inactive'})`,
    value: survey.value
  }));

  // Get selected survey details
  const selectedSurveyDetails = availableSurveys.find(s => s.value === selectedSurvey);

  // Autocomplete text field
  const textField = (
    <Autocomplete.TextField
      onChange={handleSearchChange}
      value={searchValue}
      prefix={<Icon source={SearchIcon} color="base" />}
      placeholder="Search surveys"
      autoComplete="off"
    />
  );

  // Loading state
  if (isLoading) {
    return (
      <Page title="Post Purchase Email">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
          width: '100%',
          flexDirection: 'column'
        }}>
          <Spinner size="large" />
          <Text as="p" variant="bodyMd" fontWeight="medium" style={{ marginTop: '2rem' }}>
            Loading email template...
          </Text>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Post Purchase Email"
      primaryAction={{
        content: isSaving ? 'Saving...' : 'Save',
        onAction: handleSaveEmail,
        loading: isSaving,
        disabled: isSaving || !selectedSurvey
      }}
      secondaryActions={[
        {
          content: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon source={SendIcon} />
              </div>
              <Text as="span" variant="bodyMd">
                Send Test Email
              </Text>
            </div>
          ),
          onAction: openTestEmailModal,
          disabled: !selectedSurvey
        }
      ]}
      fullWidth
    >
      {/* Test Email Modal */}
      <Modal
        open={isTestEmailModalOpen}
        onClose={() => setIsTestEmailModalOpen(false)}
        title="Send Test Email"
        primaryAction={{
          content: isSendingTest ? 'Sending...' : 'Send',
          onAction: handleSendTestEmail,
          loading: isSendingTest,
          disabled: isSendingTest || !testEmailAddress
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setIsTestEmailModalOpen(false)
          }
        ]}
      >
        <Modal.Section>
          <TextField
            label="Email Address"
            type="email"
            value={testEmailAddress}
            onChange={(value) => setTestEmailAddress(value)}
            autoComplete="email"
            placeholder="Enter recipient email address"
            helpText="This will be the recipient email for your test email."
          />
          <div style={{ marginTop: '8px' }}>
            <Text variant="bodySm" color="subdued">
              This will send a test email with your current template.
            </Text>
          </div>
        </Modal.Section>
      </Modal>

      {availableSurveys.length === 0 ? (
        <Banner
          title="No surveys available"
          tone="warning"
        >
          <p>You need to create at least one active survey before setting up post-purchase emails.</p>
        </Banner>
      ) : (
        <>
          <div className="header-actions">
            <div className="filter-dropdown">
              <Select
                label=""
                labelHidden
                options={surveyOptions}
                value={selectedSurvey}
                onChange={handleSurveyChange}
                placeholder="Select a survey"
              />
            </div>
            
            <div className="filter-search-container">
              {isSearchActive ? (
                <div className="search-with-cancel">
                  <div className="search-field-wrapper">
                    <Autocomplete
                      options={filteredSurveys.map(survey => ({
                        label: `${survey.label} (${survey.isActive ? 'Active' : 'Inactive'})`,
                        value: survey.value
                      }))}
                      selected={selectedSearchOptions}
                      onSelect={handleSearchSelect}
                      textField={textField}
                    />
                  </div>
                  <div className="cancel-button-container">
                    <Button onClick={toggleSearch}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Tooltip content="Search surveys">
                  <Button icon={<Icon source={SearchIcon} />} onClick={toggleSearch} />
                </Tooltip>
              )}
            </div>
          </div>
          
          <div style={{ marginTop: '5px' }} />
          
          <div className="email-editor-container">
            {viewMode !== 'fullscreen' ? (
              <div className="email-editor-two-panel">
                {/* Left Panel - Email Editor */}
                <div className="email-editor-panel">
                  <EmailEditor 
                    emailSubject={emailSubject}
                    setEmailSubject={setEmailSubject}
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    footerContent={footerContent}
                    setFooterContent={setFooterContent}
                  />
                </div>

                {/* Right Panel - Email Preview */}
                <div className="email-editor-panel">
                  <EmailPreview 
                    emailContent={emailContent}
                    emailSubject={emailSubject}
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                  />
                </div>
              </div>
            ) : (
              <div className="email-editor-fullscreen">
                <EmailPreview 
                  emailContent={emailContent}
                  emailSubject={emailSubject}
                  viewMode={viewMode}
                  onViewModeChange={handleViewModeChange}
                />
              </div>
            )}
          </div>
        </>
      )}
    </Page>
  );
}