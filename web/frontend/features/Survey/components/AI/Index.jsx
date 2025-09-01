import React from 'react';
import AIAssistantSetup from '../assistant/AIAssistantSetup';
import { useNavigate } from "react-router-dom";

export default function AISurveyCreation() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/survey/templates");
    };

    const handleProceed = () => {
        // Navigate to the survey creation form with AI template
        // The title is already set in the store by AIAssistantSetup
        navigate(`/survey/create?template=ai_creation`);
    };

    return (
        <AIAssistantSetup 
            onBack={handleBack} 
            onProceed={handleProceed} 
        />
    );
}
