import { create } from "zustand";
import { v4 as uuidv4 } from 'uuid';
import { loadSurveyData, createNewQuestion, processSurveyDataFromApi } from '../features/Survey/utils/surveyStoreHelpers';

// Load initial data from JSON or API
const initialData = loadSurveyData();

const useStore = create((set, get) => ({
    // Load initial state from our helper function
    ...initialData,
    
    // TabsContent state
    setSelectedTab: (index) => set({ selectedTab: index }),
    
    // Channel tab state
    toggleChannelExpand: (id) => set((state) => ({
        channelItems: state.channelItems.map(item => 
            item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
        )
    })),

    // Discount tab state
    setDiscountEnabled: (enabled) => set({ 
        discountEnabled: enabled
    }),
    setDiscountSettings: (updates) => set((state) => ({
        discountSettings: { ...state.discountSettings, ...updates }
    })),
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
    
    // Reset the store to the initial state from the JSON file
    resetSurveyToDefault: () => {
        const defaultData = loadSurveyData();
        set({ ...defaultData });
    },
    
    // Load survey data from API
    loadSurveyFromApi: async (surveyId) => {
        try {
            // This would be an API call when implemented
            // const response = await fetch(`/api/surveys/${surveyId}`);
            // const data = await response.json();
            
            // For now, just use our JSON data
            const surveyData = loadSurveyData();
            set({ ...surveyData });
            
            return true;
        } catch (error) {
            console.error('Error loading survey from API:', error);
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