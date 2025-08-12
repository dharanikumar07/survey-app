import { create } from "zustand";

const useStore = create((set) => ({
    // TabsContent state
    selectedTab: 0,
    setSelectedTab: (index) => set({ selectedTab: index }),
    
    // Sidebar state
    editModalOpen: false,
    setEditModalOpen: (isOpen) => set({ editModalOpen: isOpen }),
    surveyTitle: 'Survey #1',
    setSurveyTitle: (title) => set({ surveyTitle: title }),
    
    // SurveyModalContent state
    selectedQuestionId: '1',
    setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),
    
    // ModalHeader state
    selectedView: 'desktop',
    setSelectedView: (view) => set({ selectedView: view }),
    isActive: true,
    setIsActive: (active) => set({ isActive: active }),
    selectedTheme: 'default',
    setSelectedTheme: (theme) => set({ selectedTheme: theme }),
    themePopoverActive: false,
    setThemePopoverActive: (active) => set({ themePopoverActive: active }),
    statusPopoverActive: false,
    setStatusPopoverActive: (active) => set({ statusPopoverActive: active }),
    surveyPagePopoverActive: false,
    setSurveyPagePopoverActive: (active) => set({ surveyPagePopoverActive: active }),
    selectedSurveyPage: 'branded',
    setSelectedSurveyPage: (page) => set({ selectedSurveyPage: page }),
    
    // Questions state
    questions: [
        { id: '1', content: 'How likely are you to recommend us to a friend?', type: 'rating', description: '', questionType: 'Number scale', isDraggable: true },
        { id: '2', content: 'How easy was it to purchase from our online store?', type: 'rating', description: '', questionType: 'Number scale', isDraggable: true },
        { id: '3', content: 'How could we improve?', type: 'text', description: '', questionType: 'Short answer', isDraggable: true },
        { id: 'thankyou', content: 'Thank You Card', type: 'card', description: '', questionType: 'Card', isDraggable: false },
    ],
    setQuestions: (newQuestions) => set({ questions: newQuestions }),
    
    // Add a new question
    addQuestion: (question) => set((state) => {
        // Find the index of the thank you card to insert before it
        const thankYouIndex = state.questions.findIndex(q => q.id === 'thankyou');
        const insertIndex = thankYouIndex !== -1 ? thankYouIndex : state.questions.length;
        
        const newQuestions = [...state.questions];
        newQuestions.splice(insertIndex, 0, question);
        return { questions: newQuestions };
    }),
    
    // Update a question
    updateQuestion: (id, updates) => set((state) => {
        const questionIndex = state.questions.findIndex(q => q.id === id);
        if (questionIndex === -1) return state;
        
        const newQuestions = [...state.questions];
        newQuestions[questionIndex] = { ...newQuestions[questionIndex], ...updates };
        return { questions: newQuestions };
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
        
        return { questions: current };
    }),
}));

export default useStore;