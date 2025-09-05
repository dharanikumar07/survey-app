import { create } from "zustand";
import { v4 as uuidv4 } from 'uuid';
import { loadSurveyData, createNewQuestion, processSurveyDataFromApi } from '../features/Survey/utils/surveyStoreHelpers';
import { apiClient } from "../api";

// Load initial data from JSON or API
console.log('=== Store initialization ===');
const initialData = loadSurveyData();
console.log('Initial data loaded:', initialData);

const useStore = create((set, get) => ({
    // Load initial state from our helper function
    ...initialData,
    
    // TabsContent state
    setSelectedTab: (index) => set({ selectedTab: index }),
    
    // Channel tab state
    setChannelItems: (items) => set({ 
        channelItems: items 
    }),
    toggleChannelExpand: (id) => set((state) => ({
        channelItems: state.channelItems.map(item => 
            item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
        )
    })),
    
    // Onsite survey configuration state
    onsiteConfig: {
        pageTargeting: 'all', // 'all' or 'specific'
        specificPages: '',
        excludePages: false,
        excludedPageTypes: [], // Array of page types to exclude
        timing: {
            delay: 10,
            unit: 'seconds'
        },
        userTargeting: 'all', // 'all' or 'segment'
        userTag: false, // User tag checkbox
        customerType: {
            newCustomer: false,
            returnCustomer: false
        },
        productPurchased: false, // Product purchased checkbox
        widgetRecurrence: 'every_time'
    },

    // Thank you page configuration state
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
            
            const transformedData = {
                // Survey basic info
                surveyTitle: surveyMeta.name || apiData.name || 'Survey',
                isActive: surveyMeta.isActive || apiData.is_active || true,
                selectedTheme: 'default',
                
                // Questions
                questions: questions,
                
                // Channels
                channelItems: channelItems,
                
                // Discount
                discountEnabled: surveyMeta.discount?.enabled || false,
                discountSettings: discountSettings,
                discountSections: [
                    { id: 'banner', title: 'Discount banner', icon: 'page', isExpanded: false },
                    { id: 'requestEmail', title: 'Request email card', icon: 'email', isExpanded: false },
                    { id: 'discountEmail', title: 'Discount email', icon: 'email', isExpanded: true }
                ],
                
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
            // Return fallback data if transformation fails
            return loadSurveyData();
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
            'card': 'Card'
        };
        return typeMap[type] || 'Question';
    },
    
    // Helper function to transform channels
    transformChannels: (channels) => {
        const defaultChannels = [
            { id: 'onsite', title: 'On-site survey', icon: 'store', isExpanded: false, isEnabled: false },
            { id: 'thankyou', title: 'Thank you page', icon: 'checkmark', isExpanded: true, isEnabled: true },
        ];
        
        // Update enabled status based on API data
        return defaultChannels.map(channel => ({
            ...channel,
            isEnabled: channels[channel.id]?.enabled || channel.isEnabled
        }));
    },
    
    // Helper function to transform discount settings
    transformDiscountSettings: (discount) => {
        return {
            code: discount.code || '',
            displayOn: discount.displayOn || 'email',
            limitPerEmail: discount.limitOnePerEmail || false
        };
    },
    
    // Reset the store to the initial state from the JSON file
    resetSurveyToDefault: () => {
        const defaultData = loadSurveyData();
        set({ ...defaultData });
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
            const dataToSave = {
                surveyTitle: state.surveyTitle,
                isActive: state.isActive,
                questions: state.questions,
                channelItems: state.channelItems,
                discountEnabled: state.discountEnabled,
                discountSettings: state.discountSettings,
                selectedTheme: state.selectedTheme
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