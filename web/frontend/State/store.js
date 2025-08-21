import { create } from "zustand";

const useStore = create((set, get) => ({
    // TabsContent state
    selectedTab: 0,
    setSelectedTab: (index) => set({ selectedTab: index }),
    
    // Channel tab state
    channelItems: [
        { id: 'branded', title: 'Branded survey page', icon: 'document', isExpanded: false, isEnabled: false },
        { id: 'onsite', title: 'On-site survey', icon: 'store', isExpanded: false, isEnabled: false },
        { id: 'thankyou', title: 'Thank you page', icon: 'checkmark', isExpanded: true, isEnabled: true },
        { id: 'email', title: 'Post-purchase email', icon: 'email', isExpanded: false, isEnabled: false },
        { id: 'exit', title: 'Exit intent', icon: 'exit', isExpanded: false, isEnabled: false },
        { id: 'embed', title: 'Embed survey', icon: 'code', isExpanded: false, isEnabled: false },
    ],
    toggleChannelExpand: (id) => set((state) => ({
        channelItems: state.channelItems.map(item => 
            item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
        )
    })),

    // Discount tab state
    discountEnabled: false,
    setDiscountEnabled: (enabled) => set({ 
        discountEnabled: enabled
    }),
    discountSettings: {
        code: '',
        displayOn: 'email',
        limitPerEmail: false,
    },
    setDiscountSettings: (updates) => set((state) => ({
        discountSettings: { ...state.discountSettings, ...updates }
    })),
    discountSections: [
        { id: 'banner', title: 'Discount banner', icon: 'page', isExpanded: false },
        { id: 'requestEmail', title: 'Request email card', icon: 'email', isExpanded: false },
        { id: 'discountEmail', title: 'Discount email', icon: 'email', isExpanded: true },
    ],
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
    editModalOpen: false,
    setEditModalOpen: (isOpen) => set({ editModalOpen: isOpen }),
    surveyTitle: 'Survey #1',
    setSurveyTitle: (title) => set({ 
        surveyTitle: title
    }),
    
    // SurveyModalContent state
    selectedQuestionId: '1',
    setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),
    
    // ModalHeader state
    selectedView: 'desktop',
    setSelectedView: (view) => set({ selectedView: view }),
    isActive: true,
    setIsActive: (active) => set({ 
        isActive: active
    }),
    selectedTheme: 'default',
    setSelectedTheme: (theme) => set({ 
        selectedTheme: theme
    }),
    themePopoverActive: false,
    setThemePopoverActive: (active) => set({ themePopoverActive: active }),
    statusPopoverActive: false,
    setStatusPopoverActive: (active) => set({ statusPopoverActive: active }),
    surveyPagePopoverActive: false,
    setSurveyPagePopoverActive: (active) => set({ surveyPagePopoverActive: active }),
    selectedSurveyPage: 'page',
    setSelectedSurveyPage: (page) => set({ 
        selectedSurveyPage: page
    }),
    
    // Questions state
    questions: [
        { 
            id: '1', 
            content: 'How likely are you to recommend us to a friend?', 
            type: 'rating', 
            description: '', 
            questionType: 'Star rating', 
            isDraggable: true,
            answerOptions: [
                { id: 'opt1', text: '1 - Not likely' },
                { id: 'opt2', text: '2 - Somewhat likely' },
                { id: 'opt3', text: '3 - Likely' },
                { id: 'opt4', text: '4 - Very likely' },
                { id: 'opt5', text: '5 - Extremely likely' },
            ]
        },
        { 
            id: '2', 
            content: 'How easy was it to purchase from our online store?', 
            type: 'number-scale', 
            description: '', 
            questionType: 'Number scale', 
            isDraggable: true,
            answerOptions: [
                { id: 'opt7', text: '1 - Very difficult' },
                { id: 'opt8', text: '2 - Somewhat difficult' },
                { id: 'opt9', text: '3 - Neutral' },
                { id: 'opt10', text: '4 - Somewhat easy' },
                { id: 'opt11', text: '5 - Very easy' },
            ]
        },
        { 
            id: '3', 
            content: 'How could we improve?', 
            type: 'text', 
            description: 'Please provide your feedback in detail.', 
            questionType: 'Short answer', 
            isDraggable: true, 
            answerOptions: [] 
        },
        { 
            id: '4', 
            content: 'How did you hear about us?', 
            type: 'single-choice', 
            description: 'Select the option that best describes your answer.', 
            questionType: 'Single choice', 
            isDraggable: true,
            answerOptions: [
                { id: 'opt12', text: 'Word of mouth' },
                { id: 'opt13', text: 'Social media' },
                { id: 'opt14', text: 'Search engine' },
                { id: 'opt15', text: 'Advertisement' },
                { id: 'opt16', text: 'Other' },
            ]
        },
        { 
            id: '5', 
            content: 'Which of our products have you used?', 
            type: 'multiple-choice', 
            description: 'Select all options that apply to you.', 
            questionType: 'Multiple choice', 
            isDraggable: true,
            answerOptions: [
                { id: 'opt17', text: 'Product A' },
                { id: 'opt18', text: 'Product B' },
                { id: 'opt19', text: 'Product C' },
                { id: 'opt20', text: 'Service X' },
                { id: 'opt21', text: 'Service Y' },
            ]
        },
        { id: 'thankyou', content: 'Thank You Card', type: 'card', description: '', questionType: 'Card', isDraggable: false, answerOptions: [] },
    ],
    setQuestions: (newQuestions) => set({ 
        questions: newQuestions
    }),
    
    // Add a new question
    addQuestion: (question) => set((state) => {
        // Find the index of the thank you card to insert before it
        const thankYouIndex = state.questions.findIndex(q => q.id === 'thankyou');
        const insertIndex = thankYouIndex !== -1 ? thankYouIndex : state.questions.length;
        
        const newQuestions = [...state.questions];
        newQuestions.splice(insertIndex, 0, question);
        return { 
            questions: newQuestions
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
            id: `opt${Date.now()}`,
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


}));

export default useStore;