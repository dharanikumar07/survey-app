import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState, useCallback } from 'react';
import { Box, Text, Button } from '@shopify/polaris';
import { useSurveyState } from '../../hooks/useSurveyState';
import SurveyIframe from './SurveyIframe';

/**
 * SurveyIframeProduction Component
 * 
 * Production-ready version of the survey iframe with:
 * - No debug code or console logs
 * - Clean, minimal implementation
 * - Full compatibility with SurveyPreview API
 * - Refresh button for content updates
 * 
 * Usage with ref (same as SurveyPreview):
 * const surveyPreviewRef = useRef(null);
 * 
 * // To get the HTML content for backend storage:
 * const htmlContent = surveyPreviewRef.current.getBodyContent();
 * const fullHTML = surveyPreviewRef.current.getHTMLContent();
 * const jsContent = surveyPreviewRef.current.getJavaScriptContent();
 */
const SurveyIframeProduction = forwardRef((props, ref) => {
    const { questions, selectedQuestionId, selectedView, currentQuestionIndex, setCurrentQuestionIndex } = useSurveyState();
    const iframeRef = useRef(null);
    const [iframeState, setIframeState] = useState({
        currentQuestionIndex: 0,
        answers: {},
        isReady: false
    });

    // State to track iframe refresh
    const [iframeKey, setIframeKey] = useState(0);
    const [preservedState, setPreservedState] = useState(null);

    // Sync with parent component state
    useEffect(() => {
        if (iframeRef.current && iframeRef.current.getCurrentState) {
            const state = iframeRef.current.getCurrentState();
            if (state.isReady && state.currentQuestionIndex !== currentQuestionIndex) {
                setCurrentQuestionIndex(state.currentQuestionIndex);
            }
        }
    }, [iframeState.currentQuestionIndex, currentQuestionIndex, setCurrentQuestionIndex]);

    // Update iframe when parent state changes
    useEffect(() => {
        if (iframeRef.current && iframeState.isReady) {
            iframeRef.current.setQuestionIndex(currentQuestionIndex);
        }
    }, [currentQuestionIndex, iframeState.isReady]);

    // Reset to first question when questions change
    useEffect(() => {
        setCurrentQuestionIndex(0);
        if (iframeRef.current) {
            iframeRef.current.resetSurvey();
        }
    }, [questions, setCurrentQuestionIndex]);

    // Update currentQuestionIndex when selectedQuestionId changes
    useEffect(() => {
        if (selectedQuestionId && questions.length > 0) {
            const questionIndex = questions.findIndex(q => q.id === selectedQuestionId);
            if (questionIndex !== -1) {
                setCurrentQuestionIndex(questionIndex);
                if (iframeRef.current) {
                    iframeRef.current.setQuestionIndex(questionIndex);
                }
            }
        }
    }, [selectedQuestionId, questions, setCurrentQuestionIndex]);

    // Auto-select first question if none is selected
    useEffect(() => {
        if (questions.length > 0 && !selectedQuestionId) {
            const firstQuestion = questions.find(q => q.id !== 'thankyou');
            if (firstQuestion) {
                // First question auto-selection happens in parent component
            }
        }
    }, [questions, selectedQuestionId]);

    // Handle iframe refresh while preserving state
    const handleRefresh = useCallback(() => {
        if (iframeRef.current) {
            // Store current state before refresh
            const currentState = iframeRef.current.getCurrentState();
            setPreservedState(currentState);

            // Force iframe to reload by changing the key
            setIframeKey(prev => prev + 1);
        }
    }, []);

    // Restore state after iframe refresh
    useEffect(() => {
        if (preservedState && iframeRef.current && iframeState.isReady) {
            // Restore the preserved state
            if (preservedState.currentQuestionIndex !== undefined) {
                iframeRef.current.setQuestionIndex(preservedState.currentQuestionIndex);
            }

            if (preservedState.answers && Object.keys(preservedState.answers).length > 0) {
                iframeRef.current.setAnswers(preservedState.answers);
            }

            // Clear preserved state
            setPreservedState(null);
        }
    }, [preservedState, iframeState.isReady]);

    // Expose methods to get HTML content for backend storage (same API as SurveyPreview)
    useImperativeHandle(ref, () => ({
        getHTMLContent: () => {
            if (iframeRef.current) {
                return iframeRef.current.getHTMLContent();
            }
            return '';
        },
        getBodyContent: () => {
            if (iframeRef.current) {
                return iframeRef.current.getBodyContent();
            }
            return '';
        },
        getCompleteHTML: () => {
            if (iframeRef.current) {
                return iframeRef.current.getCompleteHTML();
            }
            return '';
        },
        getCleanHTML: () => {
            if (iframeRef.current) {
                return iframeRef.current.getCleanHTML();
            }
            return '';
        },
        getJavaScriptContent: () => {
            if (iframeRef.current) {
                return iframeRef.current.getJavaScriptContent();
            }
            return '';
        },

        // Additional iframe-specific methods
        setQuestionIndex: (index) => {
            if (iframeRef.current) {
                iframeRef.current.setQuestionIndex(index);
            }
        },
        setAnswers: (answers) => {
            if (iframeRef.current) {
                iframeRef.current.setAnswers(answers);
            }
        },
        resetSurvey: () => {
            if (iframeRef.current) {
                iframeRef.current.resetSurvey();
            }
        },
        refreshIframe: () => {
            handleRefresh();
        },
        getCurrentState: () => {
            if (iframeRef.current) {
                return iframeRef.current.getCurrentState();
            }
            return {
                currentQuestionIndex: 0,
                answers: {},
                surveyData: { questions, name: 'Survey' },
                isReady: false
            };
        }
    }));

    // Handle iframe state updates
    const handleIframeStateUpdate = (newState) => {
        setIframeState(newState);
    };

    // If no questions are available, show a message
    if (!questions || questions.length === 0) {
        return (
            <Box padding="400" background="bg-surface-secondary" borderRadius="300">
                <Text variant="bodyMd" alignment="center">
                    No questions available. Please add questions to see the preview.
                </Text>
            </Box>
        );
    }

    // Prepare survey data for iframe
    const surveyData = {
        name: 'Survey',
        questions: questions.filter(q => q.id !== 'thankyou') // Exclude thank you question
    };

    return (
        <Box>
            {/* Iframe with key for refresh */}
            <Box paddingTop="400">
                <SurveyIframe
                    key={iframeKey}
                    ref={iframeRef}
                    surveyData={surveyData}
                    selectedView={selectedView}
                    onSurveyComplete={props.onSurveyComplete}
                    onStateUpdate={handleIframeStateUpdate}
                />
            </Box>
        </Box>
    );
});

export default SurveyIframeProduction;
