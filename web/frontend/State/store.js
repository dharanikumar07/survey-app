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
}));

export default useStore;