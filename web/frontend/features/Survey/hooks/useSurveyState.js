import useStore from '../../../State/store';

export const useSurveyState = () => {
    const {
        // TabsContent state
        selectedTab,
        setSelectedTab,
        
        // Channel tab state
        channelItems,
        toggleChannelExpand,
        toggleChannelEnabled,
        
        // Onsite survey configuration state
        onsiteConfig,
        setOnsiteConfig,
        updateOnsiteConfig,

        // Thank you page configuration state
        thankyouConfig,
        setThankyouConfig,
        updateThankyouConfig,

        // Branded survey configuration state
        brandedConfig,
        setBrandedConfig,
        updateBrandedConfig,
        
        // Discount tab state
        discountEnabled,
        setDiscountEnabled,
        discountSettings,
        setDiscountSettings,
        discountSections,
        toggleDiscountSection,
        
        // Integrations state
        integrations,
        setIntegrationsEnabled,
        setKlaviyoEnabled,
        setKlaviyoListId,
        setRetainfulEnabled,
        setRetainfulListId,
        setIntegrations,
        
        // Sidebar state
        editModalOpen,
        setEditModalOpen,
        surveyTitle,
        setSurveyTitle,
        
        // SurveyModalContent state
        selectedQuestionId,
        setSelectedQuestionId,
        
        // ModalHeader state
        selectedView,
        setSelectedView,
        isActive,
        setIsActive,
        selectedTheme,
        setSelectedTheme,
        themePopoverActive,
        setThemePopoverActive,
        statusPopoverActive,
        setStatusPopoverActive,
        surveyPagePopoverActive,
        setSurveyPagePopoverActive,
        selectedSurveyPage,
        setSelectedSurveyPage,
        
        // Questions state
        questions,
        setQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        updateAnswerOptions,
        addAnswerOption,
        deleteAnswerOption,
        updateAnswerOption,
        reorderAnswerOptions,
        
        // Survey preview state
        currentQuestionIndex,
        setCurrentQuestionIndex,
        
        // API related functions
        resetSurveyToDefault,
        loadSurveyFromApi,
        saveSurveyToApi,
    } = useStore();

    return {
        // TabsContent state
        selectedTab,
        setSelectedTab,
        
        // Channel tab state
        channelItems,
        toggleChannelExpand,
        toggleChannelEnabled,
        
        // Onsite survey configuration state
        onsiteConfig,
        setOnsiteConfig,
        updateOnsiteConfig,

        // Thank you page configuration state
        thankyouConfig,
        setThankyouConfig,
        updateThankyouConfig,

        // Branded survey configuration state
        brandedConfig,
        setBrandedConfig,
        updateBrandedConfig,
        
        // Discount tab state
        discountEnabled,
        setDiscountEnabled,
        discountSettings,
        setDiscountSettings,
        discountSections,
        toggleDiscountSection,
        
        // Integrations state
        integrations,
        setIntegrationsEnabled,
        setKlaviyoEnabled,
        setKlaviyoListId,
        setRetainfulEnabled,
        setRetainfulListId,
        setIntegrations,
        
        // Sidebar state
        editModalOpen,
        setEditModalOpen,
        surveyTitle,
        setSurveyTitle,
        
        // SurveyModalContent state
        selectedQuestionId,
        setSelectedQuestionId,
        
        // ModalHeader state
        selectedView,
        setSelectedView,
        isActive,
        setIsActive,
        selectedTheme,
        setSelectedTheme,
        themePopoverActive,
        setThemePopoverActive,
        statusPopoverActive,
        setStatusPopoverActive,
        surveyPagePopoverActive,
        setSurveyPagePopoverActive,
        selectedSurveyPage,
        setSelectedSurveyPage,
        
        // Questions state
        questions,
        setQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        updateAnswerOptions,
        addAnswerOption,
        deleteAnswerOption,
        updateAnswerOption,
        reorderAnswerOptions,
        
        // Survey preview state
        currentQuestionIndex,
        setCurrentQuestionIndex,
        
        // API related functions
        resetSurveyToDefault,
        loadSurveyFromApi,
        saveSurveyToApi,
    };
};
