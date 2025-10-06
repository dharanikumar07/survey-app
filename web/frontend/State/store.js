import { create } from "zustand";
import { v4 as uuidv4 } from 'uuid';
import { createNewQuestion, processSurveyDataFromApi } from '../features/Survey/utils/surveyStoreHelpers';
import { apiClient } from "../api";

// Initialize store with empty state - API will be the only source of truth
const useStore = create((set, get) => ({
    // Initialize with empty state - all data will come from API
    surveyTitle: '',
    isActive: false,
    questions: [],
    channelItems: [],
    brandedSurveyUrl: '',
    onsiteConfig: {
        pageTargeting: 'all', // 'all' or 'specific'
        specificPages: '',
        excludePages: false,
        excludedPageTypes: [], // Array of page types to exclude
        userTargeting: 'all', // 'all' or 'segment'
        userTag: false, // User tag checkbox
        customerType: {
            newCustomer: false,
            returnCustomer: false
        },
        productPurchased: false,
        widgetRecurrence: 'every_time'
    },
    integrations: {
        enabled: false,
        klaviyo: { enabled: false, listId: '' },
        retainful: { enabled: false, listId: '' }
    },
    thankyouConfig: {
        message: 'Thank you for your feedback!',
        action: 'message', // 'message', 'redirect', 'discount'
        socialSharing: false,
        emailCollection: false,
        userTargeting: 'all', // 'all' or 'segment'
        userTag: false,
        productPurchased: false,
        newCustomer: false,
        returnCustomer: false
    },

    // Branded survey configuration state
    brandedConfig: {
        logo: '',
        colors: {
            primary: '#008060',
            secondary: '#6c757d',
            accent: '#17a2b8',
            background: '#ffffff',
            text: '#333333'
        },
        fonts: {
            primary: 'Arial, sans-serif',
            heading: 'Arial, sans-serif',
            customFamily: ''
        },
        displaySettings: {
            position: 'bottom-right',
            showLogo: true,
            customBorderRadius: false,
            borderRadius: '8'
        },
        customCss: ''
    },
    discountEnabled: false,
    discountSettings: {},
    discountSections: [],
    selectedTab: 0,
    editModalOpen: false,
    selectedQuestionId: '',
    selectedView: 'mobile',
    selectedTheme: 'default',
    themePopoverActive: false,
    statusPopoverActive: false,
    surveyPagePopoverActive: false,
    selectedSurveyPage: 'page',
    currentQuestionIndex: 0,
    
    // TabsContent state
    setSelectedTab: (index) => set({ selectedTab: index }),
    
    // Set branded survey URL
    setBrandedSurveyUrl: (url) => set({
        brandedSurveyUrl: url
    }),
    
    // Channel tab state
    setChannelItems: (items) => set({ 
        channelItems: items 
    }),
    toggleChannelExpand: (id) => set((state) => ({
        channelItems: state.channelItems.map(item => 
            item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
        )
    })),
    
    setOnsiteConfig: (updates) => set((state) => ({
        onsiteConfig: { ...state.onsiteConfig, ...updates }
    })),
    updateOnsiteConfig: (key, value) => set((state) => ({
        onsiteConfig: { ...state.onsiteConfig, [key]: value }
    })),

    // Thank you page configuration actions
    setThankyouConfig: (updates) => set((state) => ({
        thankyouConfig: { ...state.thankyouConfig, ...updates }
    })),
    updateThankyouConfig: (key, value) => set((state) => ({
        thankyouConfig: { ...state.thankyouConfig, [key]: value }
    })),

    // Branded survey configuration actions
    setBrandedConfig: (updates) => set((state) => ({
        brandedConfig: { ...state.brandedConfig, ...updates }
    })),
    updateBrandedConfig: (key, value) => set((state) => ({
        brandedConfig: { ...state.brandedConfig, [key]: value }
    })),

    // Discount tab state
    setDiscountEnabled: (enabled) => set({ 
        discountEnabled: enabled
    }),
    setDiscountSettings: (updates) => set((state) => ({
        discountSettings: { ...state.discountSettings, ...updates }
    })),
    setDiscountSections: (sections) => set({
        discountSections: sections
    }),
    toggleDiscountSection: (id) => set((state) => ({
        discountSections: state.discountSections.map((s) =>
            s.id === id ? { ...s, isExpanded: !s.isExpanded } : s
        )
    })),
    
    // Integration state actions
    setIntegrationsEnabled: (enabled) => set((state) => ({
        integrations: { ...state.integrations, enabled }
    })),
    setKlaviyoEnabled: (enabled) => set((state) => ({
        integrations: { 
            ...state.integrations, 
            klaviyo: { ...state.integrations.klaviyo, enabled }
        }
    })),
    setKlaviyoListId: (listId) => set((state) => ({
        integrations: { 
            ...state.integrations, 
            klaviyo: { ...state.integrations.klaviyo, listId }
        }
    })),
    setRetainfulEnabled: (enabled) => set((state) => ({
        integrations: { 
            ...state.integrations, 
            retainful: { ...state.integrations.retainful, enabled }
        }
    })),
    setRetainfulListId: (listId) => set((state) => ({
        integrations: { 
            ...state.integrations, 
            retainful: { ...state.integrations.retainful, listId }
        }
    })),
    setIntegrations: (updates) => set((state) => ({
        integrations: { ...state.integrations, ...updates }
    })),
    toggleChannelEnabled: (id) => set((state) => ({
        channelItems: state.channelItems.map(item => 
            item.id === id ? { ...item, isEnabled: !item.isEnabled } : item
        )
    })),
    
    // Sidebar state
    setEditModalOpen: (isOpen) => set({ editModalOpen: isOpen }),
    setSurveyTitle: (title) => set({ 
        surveyTitle: title
    }),
    
    // SurveyModalContent state
    setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),
    
    // Survey preview state
    setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
    
    // ModalHeader state
    setSelectedView: (view) => set({ selectedView: view }),
    setIsActive: (active) => set({ 
        isActive: active
    }),
    setSelectedTheme: (theme) => set({ 
        selectedTheme: theme
    }),
    setThemePopoverActive: (active) => set({ themePopoverActive: active }),
    setStatusPopoverActive: (active) => set({ statusPopoverActive: active }),
    setSurveyPagePopoverActive: (active) => set({ surveyPagePopoverActive: active }),
    setSelectedSurveyPage: (page) => set({ 
        selectedSurveyPage: page
    }),
    
    // Questions state
    setQuestions: (newQuestions) => set({ 
        questions: newQuestions
    }),
    
    // Add a new question
    addQuestion: (questionType) => set((state) => {
        // Create a new question using our helper
        const newQuestion = createNewQuestion(questionType);
        
        // If question creation failed, return current state
        if (!newQuestion) {
            console.log(`Failed to create question of type: ${questionType}`);
            return state;
        }
        
        // Find the index of the thank you card to insert before it
        const thankYouIndex = state.questions.findIndex(q => q.id === 'thankyou');
        const insertIndex = thankYouIndex !== -1 ? thankYouIndex : state.questions.length;
        
        const newQuestions = [...state.questions];
        newQuestions.splice(insertIndex, 0, newQuestion);
        return { 
            questions: newQuestions,
            selectedQuestionId: newQuestion.id // Auto-select the new question
        };
    }),
    
    // Update a question
    updateQuestion: (id, updates) => set((state) => {
        const questionIndex = state.questions.findIndex(q => q.id === id);
        if (questionIndex === -1) return state;
        
        const newQuestions = [...state.questions];
        newQuestions[questionIndex] = { ...newQuestions[questionIndex], ...updates };
        return { 
            questions: newQuestions
        };
    }),
    
    // Delete a question
    deleteQuestion: (id) => set((state) => {
        // Don't allow deletion of the Thank You Card
        if (id === 'thankyou') return state;
        
        return {
            questions: state.questions.filter(question => question.id !== id)
        };
    }),
    
    // Reorder questions
    reorderQuestions: (fromId, toId) => set((state) => {
        if (!fromId || !toId || fromId === toId) return state;
        
        // Don't allow dragging the thank you card
        if (fromId === 'thankyou') return state;
        
        const current = [...state.questions];
        const fromIndex = current.findIndex((q) => q.id === fromId);
        const toIndex = current.findIndex((q) => q.id === toId);
        
        if (fromIndex < 0 || toIndex < 0) return state;
        
        // Don't allow dragging items after the thank you card
        const thankYouIndex = current.findIndex(q => q.id === 'thankyou');
        if (thankYouIndex !== -1 && toIndex > thankYouIndex) return state;
        
        const [moved] = current.splice(fromIndex, 1);
        current.splice(toIndex, 0, moved);
        
        return { 
            questions: current
        };
    }),
    
    // Update answer options
    updateAnswerOptions: (questionId, answerOptions) => set((state) => {
        const questionIndex = state.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return state;
        
        const newQuestions = [...state.questions];
        newQuestions[questionIndex] = { 
            ...newQuestions[questionIndex], 
            answerOptions: answerOptions 
        };
        
        return { 
            questions: newQuestions
        };
    }),
    
    // Add a new answer option
    addAnswerOption: (questionId, optionText) => set((state) => {
        const questionIndex = state.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return state;
        
        const question = state.questions[questionIndex];
        const newOption = {
            id: uuidv4(),
            text: optionText || 'New option'
        };
        
        const newQuestions = [...state.questions];
        newQuestions[questionIndex] = {
            ...question,
            answerOptions: [...(question.answerOptions || []), newOption]
        };
        
        return { 
            questions: newQuestions
        };
    }),
    
    // Delete an answer option
    deleteAnswerOption: (questionId, optionId) => set((state) => {
        const questionIndex = state.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return state;
        
        const question = state.questions[questionIndex];
        const newOptions = (question.answerOptions || []).filter(opt => opt.id !== optionId);
        
        const newQuestions = [...state.questions];
        newQuestions[questionIndex] = {
            ...question,
            answerOptions: newOptions
        };
        
        return { 
            questions: newQuestions
        };
    }),
    
    // Update a single answer option
    updateAnswerOption: (questionId, optionId, text) => set((state) => {
        const questionIndex = state.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return state;
        
        const question = state.questions[questionIndex];
        const newOptions = (question.answerOptions || []).map(opt => 
            opt.id === optionId ? { ...opt, text } : opt
        );
        
        const newQuestions = [...state.questions];
        newQuestions[questionIndex] = {
            ...question,
            answerOptions: newOptions
        };
        
        return { 
            questions: newQuestions
        };
    }),
    
    // Reorder answer options via drag and drop
    reorderAnswerOptions: (questionId, fromIndex, toIndex) => set((state) => {
        const questionIndex = state.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return state;
        
        const question = state.questions[questionIndex];
        const options = [...(question.answerOptions || [])];
        
        const [movedOption] = options.splice(fromIndex, 1);
        options.splice(toIndex, 0, movedOption);
        
        const newQuestions = [...state.questions];
        newQuestions[questionIndex] = {
            ...question,
            answerOptions: options
        };
        
        return { 
            questions: newQuestions
        };
    }),

    // API related functions - to be implemented when API is ready
    
    // Transform API data to match store structure
    transformApiDataToStore: (apiData) => {
        try {
            // Extract survey metadata
            const surveyMeta = apiData.survey_meta_data || {};
            
            // Transform questions
            const questions = (surveyMeta.questions || []).map((q, index) => {
                // Transform answer options properly
                let answerOptions = [];
                if (q.answers && Array.isArray(q.answers)) {
                    answerOptions = q.answers.map((answer, optIndex) => ({
                        id: answer.id || `opt${optIndex + 1}`,
                        text: answer.content || answer.text || answer.label || `Option ${optIndex + 1}`
                    }));
                } else if (q.answerOptions && Array.isArray(q.answerOptions)) {
                    answerOptions = q.answerOptions.map((answer, optIndex) => ({
                        id: answer.id || `opt${optIndex + 1}`,
                        text: answer.content || answer.text || answer.label || `Option ${optIndex + 1}`
                    }));
                }
                
                return {
                    id: q.id || `q${index + 1}`,
                    content: q.heading || q.content || 'Question',
                    type: q.type || 'text',
                    description: q.description || '',
                    questionType: get().getQuestionType(q.type),
                    isDraggable: true,
                    answerOptions: answerOptions,
                    position: q.position || index
                };
            });
            
            // Add thank you card if it exists
            if (surveyMeta.thankYou) {
                questions.push({
                    id: 'thankyou',
                    content: surveyMeta.thankYou.heading || 'Thank You Card',
                    type: 'card',
                    description: surveyMeta.thankYou.description || '',
                    questionType: 'Card',
                    isDraggable: false,
                    answerOptions: []
                });
            }
            
            // Transform channels
            const channelItems = get().transformChannels(surveyMeta.channels || {});
            
            // Transform discount settings
            const discountSettings = get().transformDiscountSettings(surveyMeta.discount || {});
            
            // Transform onsite config from channels.onsite.config
            const onsiteConfig = get().transformOnsiteConfig(surveyMeta.channels?.onsite?.config || {});
            
            // Transform thankyou config from channels.thankyou.config
            const thankyouConfig = get().transformThankyouConfig(surveyMeta.channels?.thankyou?.config || {});
            
            // Transform branded config from preferences.branding
            const brandedConfig = get().transformBrandedConfig(surveyMeta.preferences?.branding || {});
            
            // Extract branded survey URL from the channels if available
            const brandedSurveyUrl = surveyMeta.channels?.branded_survey || '';
            
            const transformedData = {
                // Survey basic info
                surveyTitle: surveyMeta.name || apiData.name || 'Survey',
                isActive: surveyMeta.isActive || apiData.is_active || true,
                selectedTheme: 'default',
                brandedSurveyUrl,
                
                // Questions
                questions: questions,
                
                // Channels
                channelItems: channelItems,
                
                // Onsite config
                onsiteConfig: onsiteConfig,
                
                // Thankyou config
                thankyouConfig: thankyouConfig,
                
                // Branded config
                brandedConfig: brandedConfig,
                
                // Discount
                discountEnabled: surveyMeta.discount?.enabled || false,
                discountSettings: discountSettings,
                discountSections: [
                    { id: 'banner', title: 'Discount banner', icon: 'page', isExpanded: false },
                    { id: 'requestEmail', title: 'Request email card', icon: 'email', isExpanded: false },
                    { id: 'discountEmail', title: 'Discount email', icon: 'email', isExpanded: true }
                ],
                
                // Integrations - initialize from survey metadata or default to empty state
                // Handle both capitalization variants ('Integrations' and 'integrations')
                integrations: surveyMeta.integrations || surveyMeta.Integrations || {
                    enabled: false,
                    klaviyo: { enabled: false, listId: '' },
                    retainful: { enabled: false, listId: '' }
                },
                
                // UI state
                selectedTab: 0,
                editModalOpen: false,
                selectedQuestionId: questions.length > 0 ? questions[0].id : '1',
                selectedView: 'desktop',
                themePopoverActive: false,
                statusPopoverActive: false,
                surveyPagePopoverActive: false,
                selectedSurveyPage: 'page',
                currentQuestionIndex: 0
            };
            
            return transformedData;
            
        } catch (error) {
            console.error('Error transforming API data:', error);
            // Return empty state if transformation fails - API is the source of truth
            return {
                surveyTitle: '',
                isActive: false,
                questions: [],
                channelItems: [],
                onsiteConfig: {},
                thankyouConfig: {},
                discountEnabled: false,
                discountSettings: {},
                discountSections: [],
                integrations: {
                    enabled: false,
                    klaviyo: { enabled: false, listId: '' },
                    retainful: { enabled: false, listId: '' }
                },
                selectedTab: 0,
                editModalOpen: false,
                selectedQuestionId: '',
                selectedView: 'mobile',
                selectedTheme: 'default',
                themePopoverActive: false,
                statusPopoverActive: false,
                surveyPagePopoverActive: false,
                selectedSurveyPage: 'page',
                currentQuestionIndex: 0,
            };
        }
    },
    
    // Helper function to get question type display name
    getQuestionType: (type) => {
        const typeMap = {
            'text': 'Short answer',
            'rating': 'Star rating',
            'satisfaction': 'Satisfaction scale',
            'number-scale': 'Number scale',
            'single-choice': 'Single choice',
            'multiple-choice': 'Multiple choice',
            'consent': 'Consent',
            'card': 'Card'
        };
        return typeMap[type] || 'Question';
    },
    
    // Helper function to transform channels
    transformChannels: (channels) => {
        const defaultChannels = [
            { id: 'onsite', title: 'On-site survey', icon: 'store', isExpanded: false, isEnabled: false },
            { id: 'thankyou', title: 'Thank you page', icon: 'checkmark', isExpanded: false, isEnabled: false },
        ];
        
        // Update enabled status based on API data
        return defaultChannels.map(channel => ({
            ...channel,
            isEnabled: channels[channel.id]?.enabled
        }));
    },
    
    // Helper function to transform discount settings
    transformDiscountSettings: (discount) => {
        return {
            discount_type: discount.discount_type || "generic",
            discount_value: discount.discount_value || "percentage",
            discount_value_amount: discount.discount_value_amount || ""
        };
    },
    
    // Helper function to transform onsite config from API
    transformOnsiteConfig: (config) => {
        return {
            pageTargeting: config.pageTargeting,
            specificPages: config.specificPages,
            excludePages: config.excludePages,
            excludedPageTypes: config.excludedPageTypes,
            // TODO: Timing feature - commented out for now, can be re-enabled in future
            // timing: {
            //     delay: config.timing?.delay,
            //     unit: config.timing?.unit
            // },
            userTargeting: config.userTargeting,
            userTag: config.userTag,
            customerType: {
                newCustomer: config.customerType?.newCustomer,
                returnCustomer: config.customerType?.returnCustomer
            },
            productPurchased: config.productPurchased,
            widgetRecurrence: config.widgetRecurrence
        };
    },

    // Helper function to transform branded config from API
    transformBrandedConfig: (config) => {
        return {
            logo: config.logo || '',
            colors: {
                primary: config.colors?.primary || '#008060',
                secondary: config.colors?.secondary || '#6c757d',
                accent: config.colors?.accent || '#17a2b8',
                background: config.colors?.background || '#ffffff',
                text: config.colors?.text || '#333333'
            },
            fonts: {
                primary: config.fonts?.primary || 'Arial, sans-serif',
                heading: config.fonts?.heading || 'Arial, sans-serif',
                customFamily: config.fonts?.customFamily || ''
            },
            displaySettings: {
                position: config.displaySettings?.position || 'bottom-right',
                showLogo: config.displaySettings?.showLogo !== undefined ? config.displaySettings.showLogo : true,
                customBorderRadius: config.displaySettings?.customBorderRadius || false,
                borderRadius: config.displaySettings?.borderRadius || '8'
            },
            customCss: config.customCss || ''
        };
    },
    
    // Helper function to transform thankyou config from API
    transformThankyouConfig: (config) => {
        return {
            message: config.message || 'Thank you for your feedback!',
            action: config.action || 'message',
            socialSharing: config.socialSharing || false,
            emailCollection: config.emailCollection || false,
            userTargeting: config.userTargeting || 'all',
            userTag: config.userTag || false,
            productPurchased: config.productPurchased || false,
            newCustomer: config.newCustomer || false,
            returnCustomer: config.returnCustomer || false
        };
    },
    
    // Reset the store to empty state - API will be the source of truth
    resetSurveyToDefault: () => {
        set({
            surveyTitle: '',
            isActive: false,
            questions: [],
            channelItems: [],
            brandedSurveyUrl: '',
            onsiteConfig: {
                pageTargeting: 'all', // 'all' or 'specific'
                specificPages: '',
                excludePages: false,
                excludedPageTypes: [], // Array of page types to exclude
                userTargeting: 'all', // 'all' or 'segment'
                userTag: false, // User tag checkbox
                customerType: {
                    newCustomer: false,
                    returnCustomer: false
                },
                productPurchased: false,
                widgetRecurrence: 'every_time'
            },
            thankyouConfig: {
                message: 'Thank you for your feedback!',
                action: 'message', // 'message', 'redirect', 'discount'
                socialSharing: false,
                emailCollection: false,
                userTargeting: 'all', // 'all' or 'segment'
                userTag: false,
                productPurchased: false,
                newCustomer: false,
                returnCustomer: false
            },
            brandedConfig: {
                logo: '',
                colors: {
                    primary: '#008060',
                    secondary: '#6c757d',
                    accent: '#17a2b8',
                    background: '#ffffff',
                    text: '#333333'
                },
                fonts: {
                    primary: 'Arial, sans-serif',
                    heading: 'Arial, sans-serif',
                    customFamily: ''
                },
                displaySettings: {
                    position: 'bottom-right',
                    showLogo: true,
                    customBorderRadius: false,
                    borderRadius: '8'
                },
                customCss: ''
            },
            discountEnabled: false,
            discountSettings: {},
            discountSections: [],
            integrations: {
                enabled: false,
                klaviyo: { enabled: false, listId: '' },
                retainful: { enabled: false, listId: '' }
            },
            selectedTab: 0,
            editModalOpen: false,
            selectedQuestionId: '',
            selectedView: 'mobile',
            selectedTheme: 'default',
            themePopoverActive: false,
            statusPopoverActive: false,
            surveyPagePopoverActive: false,
            selectedSurveyPage: 'page',
            currentQuestionIndex: 0,
        });
    },
    
    // Load survey data from API
    loadSurveyFromApi: async (surveyId) => {
        try {
            const response = await apiClient("GET", `/surveys/${surveyId}`);
            const surveyData = response.data.data;
            
            console.log('API response:', surveyData);
            
            // Transform API data to match store structure
            const transformedData = get().transformApiDataToStore(surveyData);
            
            set({ ...transformedData });
            console.log('Store updated with API data');
            
            return true;
        } catch (error) {
            console.error('API error:', error);
            return false;
        }
    },
    
    // Save survey to API
    saveSurveyToApi: async () => {
        try {
            const state = get();
            
            // Structure the data according to API expectations
            const dataToSave = {
                surveyTitle: state.surveyTitle,
                isActive: state.isActive,
                questions: state.questions,
                channelItems: state.channelItems,
                onsiteConfig: state.onsiteConfig,
                thankyouConfig: state.thankyouConfig,
                brandedConfig: state.brandedConfig,
                discountEnabled: state.discountEnabled,
                discountSettings: state.discountSettings,
                selectedTheme: state.selectedTheme,
                survey_meta_data: {
                    integrations: state.integrations,
                    channels: {
                        ...state.survey_meta_data?.channels,
                        branded_survey: state.brandedSurveyUrl
                    }
                }
            };
            
            // This would be an API call when implemented
            // const response = await fetch('/api/surveys', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(dataToSave)
            // });
            // const result = await response.json();
            
            console.log('Survey data ready to save:', dataToSave);
            return true;
        } catch (error) {
            console.error('Error saving survey to API:', error);
            return false;
        }
    }

}));

export default useStore;