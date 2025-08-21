import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Box, Text } from '@shopify/polaris';
import { useSurveyState } from '../../hooks/useSurveyState';
import { generateSurveyJavaScript } from '../../utils/surveyTransitions';

/**
 * SurveyPreview Component
 * 
 * This component renders a preview of the survey with pure HTML and inline styles.
 * It's designed to be easily captured as HTML content for backend storage and
 * later rendering in Shopify storefronts.
 * 
 * Usage with ref:
 * const surveyPreviewRef = useRef(null);
 * 
 * // To get the HTML content for backend storage:
 * const htmlContent = surveyPreviewRef.current.getBodyContent();
 * const fullHTML = surveyPreviewRef.current.getHTMLContent();
 * const jsContent = surveyPreviewRef.current.getJavaScriptContent();
 * 
 * // The HTML content includes all inline styles and can be directly
 * // embedded in storefront pages or stored in the backend.
 * // The JavaScript content provides slide transitions between questions.
 */
const SurveyPreview = forwardRef((props, ref) => {
    const { questions, selectedQuestionId, selectedView } = useSurveyState();
    const previewRef = useRef(null);
    const jsContentRef = useRef('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    // Get survey card width based on view mode
    const getSurveyCardWidth = () => {
        switch (selectedView) {
            case 'mobile':
                return { width: '100%', maxWidth: '375px' }; // Mobile width
            case 'maximize':
                return { width: '100%', maxWidth: '800px' }; // Fullscreen width
            default: // desktop
                return { width: '100%', maxWidth: '600px' }; // Default width
        }
    };

    const surveyCardStyle = getSurveyCardWidth();

    // Generate JavaScript content when questions change
    useEffect(() => {
        if (questions.length > 0) {
            const surveyData = {
                questions,
                selectedQuestionId,
            };

            // Generate JavaScript for the survey
            jsContentRef.current = generateSurveyJavaScript(surveyData);
        }
    }, [questions, selectedQuestionId]);

    // Reset to first question when questions change
    useEffect(() => {
        setCurrentQuestionIndex(0);
        setAnswers({});
    }, [questions]);

    // Update currentQuestionIndex when selectedQuestionId changes
    useEffect(() => {
        if (selectedQuestionId && questions.length > 0) {
            const questionIndex = questions.findIndex(q => q.id === selectedQuestionId);
            if (questionIndex !== -1) {
                setCurrentQuestionIndex(questionIndex);
                console.log('SurveyPreview: Updated currentQuestionIndex to:', questionIndex);
            }
        }
    }, [selectedQuestionId, questions]);

    // Auto-select first question if none is selected
    useEffect(() => {
        if (questions.length > 0 && !selectedQuestionId) {
            const firstQuestion = questions.find(q => q.id !== 'thankyou');
            if (firstQuestion) {
                console.log('SurveyPreview: Auto-selecting first question:', firstQuestion.id);
                // Note: We can't call setSelectedQuestionId here as it's not available in this component
                // This will be handled by the parent component or store
            }
        }
    }, [questions, selectedQuestionId]);

    // Expose methods to get HTML and JavaScript content for backend storage
    useImperativeHandle(ref, () => ({
        getHTMLContent: () => {
            if (previewRef.current) {
                return previewRef.current.outerHTML;
            }
            return '';
        },
        getBodyContent: () => {
            if (previewRef.current) {
                // Get only the content inside the main preview area (excluding the outer wrapper)
                const mainContent = previewRef.current.querySelector('[data-preview-content]');
                return mainContent ? mainContent.outerHTML : '';
            }
            return '';
        },
        getJavaScriptContent: () => {
            // Return the generated JavaScript content
            return jsContentRef.current;
        }
    }));

    // Get the current question to display (for preview mode)
    // FIXED: Always use currentQuestionIndex for navigation, not selectedQuestionId
    const currentQuestion = questions[currentQuestionIndex];

    // If no question is found, show a message
    if (!currentQuestion) {
        return (
            <div
                ref={previewRef}
                id="th-sf-survey-preview-container"
                className="th-sf-survey-preview-container"
                style={{
                    padding: '16px',
                    background: '#f6f6f7',
                    height: '100%',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center'
                    }}
                >
                    <Text variant="headingMd" as="h2">Survey Preview</Text>
                    <Box padding="400" background="bg-surface-secondary" borderRadius="300">
                        <Text variant="bodyMd" alignment="center" color="subdued">
                            No questions available. Please add questions to see the preview.
                        </Text>
                    </Box>
                </div>
            </div>
        );
    }

    console.log('SurveyPreview: selectedQuestionId:', selectedQuestionId);
    console.log('SurveyPreview: currentQuestionIndex:', currentQuestionIndex);
    console.log('SurveyPreview: currentQuestion:', currentQuestion);
    console.log('SurveyPreview: all questions:', questions);

    // Handle next button click
    const handleNext = () => {
        console.log('Next clicked. Current:', currentQuestionIndex, 'Total:', questions.length);
        if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            // console.log('Moving to next question:', nextIndex, 'Question type:', questions[nextIndex]?.type, 'Content:', questions[nextIndex]?.content);
        } else if (currentQuestionIndex === questions.length - 1) {
            // Show thank you card
            setCurrentQuestionIndex(questions.length);
            console.log('Showing thank you card');
        } else if (showThankYou) {
            // Handle submit action
            console.log('Submit clicked! All answers:', answers);
            // Here you would typically send the answers to your backend
            alert('Survey submitted! Thank you for your feedback.');
            // Reset to first question
            setCurrentQuestionIndex(0);
            setAnswers({});
        }
    };

    // Handle previous button click
    const handlePrevious = () => {
        console.log('Previous clicked. Current:', currentQuestionIndex);
        if (currentQuestionIndex > 0) {
            const prevIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(prevIndex);
            console.log('Moving to previous question:', prevIndex, 'Question type:', questions[prevIndex]?.type, 'Content:', questions[prevIndex]?.content);
        }
    };

    // Handle answer selection
    const handleAnswerSelect = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    // Check if we should show thank you card
    const showThankYou = currentQuestionIndex >= questions.length;

    // Helper function to check if current question is complete
    const isQuestionComplete = () => {
        if (!answers[currentQuestionIndex]) return false;

        // For rating questions, check if either rating OR multiple choice is selected
        if (currentQuestion.type === 'rating') {
            const hasRating = answers[currentQuestionIndex].rating;
            const hasOption = answers[currentQuestionIndex].option;
            const hasMultipleChoice = answers[currentQuestionIndex].multipleChoice;

            // Enable Next if ANY of these are selected
            return hasRating || hasOption || hasMultipleChoice;
        }

        return true; // For other question types, any answer is sufficient
    };

    // Different UI based on question type
    const renderQuestionContent = () => {
        if (showThankYou) {
            return (
                <div
                    className="th-sf-survey-thank-you-card"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        alignItems: 'center',
                        textAlign: 'center',
                        paddingTop: '24px',
                        paddingBottom: '24px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'center'
                        }}
                    >
                        <h3
                            className="th-sf-survey-thank-you-heading"
                            style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                margin: '0',
                                color: '#202223'
                            }}
                        >
                            Thank you for your feedback!
                        </h3>
                        <p
                            className="th-sf-survey-thank-you-description"
                            style={{
                                fontSize: '16px',
                                margin: '0',
                                color: '#6d7175'
                            }}
                        >
                            We appreciate your time and input.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div
                className="th-sf-survey-question-content"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    alignItems: 'center'
                }}
            >
                <h3
                    className="th-sf-survey-question-heading"
                    style={{
                        fontSize: selectedView === 'mobile' ? '20px' : '24px',
                        fontWeight: '600',
                        margin: '0',
                        color: '#202223',
                        textAlign: 'center',
                        padding: selectedView === 'mobile' ? '0 16px' : '0'
                    }}
                >
                    {currentQuestion.content}
                </h3>

                {currentQuestion.description && (
                    <p
                        className="th-sf-survey-question-description"
                        style={{
                            fontSize: selectedView === 'mobile' ? '14px' : '16px',
                            margin: '0',
                            color: '#6d7175',
                            textAlign: 'center',
                            padding: selectedView === 'mobile' ? '0 16px' : '0'
                        }}
                    >
                        {currentQuestion.description}
                    </p>
                )}

                <div
                    className="th-sf-survey-answer-area"
                    style={{
                        paddingTop: '16px',
                        paddingBottom: '16px',
                        width: '100%'
                    }}
                >
                    <div
                        className="th-sf-survey-answer-content"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            alignItems: 'center'
                        }}
                    >
                        {/* Emoji */}
                        {currentQuestion.type === 'rating' && (
                            <div
                                className="th-sf-survey-rating-emoji"
                                style={{
                                    fontSize: '48px',
                                    textAlign: 'center'
                                }}
                            >
                                😐
                            </div>
                        )}

                        {/* Rating Text */}
                        {currentQuestion.type === 'rating' && (
                            <p
                                className="th-sf-survey-rating-text"
                                style={{
                                    textAlign: 'center',
                                    margin: '0',
                                    fontSize: '16px',
                                    color: '#6d7175'
                                }}
                            >
                                Not likely
                            </p>
                        )}

                        {/* Rating Scale - Only for rating type questions */}
                        {currentQuestion.type === 'rating' && (
                            <div
                                className="th-sf-survey-rating-scale"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '16px',
                                    width: '100%',
                                    paddingTop: '10px'
                                }}
                            >
                                {/* Star Rating */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: selectedView === 'mobile' ? '4px' : '8px',
                                        width: '100%'
                                    }}
                                >
                                    {[1, 2, 3, 4, 5].map(num => {
                                        const isSelected = answers[currentQuestionIndex]?.rating === num.toString();
                                        return (
                                            <button
                                                key={num}
                                                className={`th-sf-survey-rating-option ${isSelected ? 'th-sf-survey-rating-option-selected' : ''}`}
                                                style={{
                                                    width: selectedView === 'mobile' ? '32px' : '40px',
                                                    height: selectedView === 'mobile' ? '32px' : '40px',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    fontSize: selectedView === 'mobile' ? '24px' : '32px',
                                                    color: isSelected ? '#ffd700' : '#ddd',
                                                    filter: isSelected ? 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))' : 'none'
                                                }}
                                                onClick={() => {
                                                    console.log('Star rating clicked:', num);
                                                    const currentAnswer = answers[currentQuestionIndex] || {};
                                                    const newAnswer = {
                                                        ...currentAnswer,
                                                        rating: num.toString()
                                                    };
                                                    handleAnswerSelect(currentQuestionIndex, newAnswer);
                                                }}
                                                onMouseOver={(e) => {
                                                    if (!isSelected) {
                                                        e.target.style.color = '#ffd700';
                                                        e.target.style.transform = 'scale(1.1)';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!isSelected) {
                                                        e.target.style.color = '#ddd';
                                                        e.target.style.transform = 'scale(1)';
                                                    }
                                                }}
                                            >
                                                ⭐
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Rating Labels */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        maxWidth: '300px',
                                        fontSize: '14px',
                                        color: '#6d7175'
                                    }}
                                >
                                    <span>{currentQuestion.leftLabel || 'Hate it'}</span>
                                    <span>{currentQuestion.rightLabel || 'Love it'}</span>
                                </div>
                            </div>
                        )}

                        {/* Satisfaction Scale - Only for satisfaction type questions */}
                        {currentQuestion.type === 'satisfaction' && (
                            <div
                                className="th-sf-survey-satisfaction-scale"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '16px',
                                    width: '100%',
                                    paddingTop: '10px'
                                }}
                            >
                                {/* Satisfaction Emojis */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: selectedView === 'mobile' ? '8px' : '16px',
                                        width: '100%'
                                    }}
                                >
                                    {[
                                        { emoji: '😠', label: 'Not satisfied', value: '1' },
                                        { emoji: '😞', label: 'Dissatisfied', value: '2' },
                                        { emoji: '😐', label: 'Neutral', value: '3' },
                                        { emoji: '🙂', label: 'Satisfied', value: '4' },
                                        { emoji: '🥰', label: 'Very satisfied', value: '5' }
                                    ].map((item, index) => {
                                        const isSelected = answers[currentQuestionIndex]?.rating === item.value;
                                        return (
                                            <button
                                                key={index}
                                                className={`th-sf-survey-satisfaction-option ${isSelected ? 'th-sf-survey-satisfaction-option-selected' : ''}`}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                                                }}
                                                onClick={() => {
                                                    console.log('Satisfaction rating clicked:', item.value);
                                                    const currentAnswer = answers[currentQuestionIndex] || {};
                                                    const newAnswer = {
                                                        ...currentAnswer,
                                                        rating: item.value
                                                    };
                                                    handleAnswerSelect(currentQuestionIndex, newAnswer);
                                                }}
                                                onMouseOver={(e) => {
                                                    if (!isSelected) {
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!isSelected) {
                                                        e.target.style.transform = 'scale(1)';
                                                    }
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: selectedView === 'mobile' ? '32px' : '48px',
                                                        filter: isSelected ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))' : 'none'
                                                    }}
                                                >
                                                    {item.emoji}
                                                </div>
                                                <span
                                                    style={{
                                                        fontSize: '12px',
                                                        color: isSelected ? '#2c6ecb' : '#6d7175',
                                                        fontWeight: isSelected ? '600' : '400',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {item.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Satisfaction Labels */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        maxWidth: '400px',
                                        fontSize: '14px',
                                        color: '#6d7175',
                                        marginTop: '8px'
                                    }}
                                >
                                    <span>{currentQuestion.leftLabel || 'Not satisfied'}</span>
                                    <span>{currentQuestion.rightLabel || 'Very satisfied'}</span>
                                </div>
                            </div>
                        )}

                        {/* Number Scale - Only for number-scale type questions */}
                        {currentQuestion.type === 'number-scale' && (
                            <div
                                className="th-sf-survey-number-scale"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '16px',
                                    width: '100%',
                                    paddingTop: '10px'
                                }}
                            >
                                {/* Number Scale */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: selectedView === 'mobile' ? '4px' : '8px',
                                        width: '100%'
                                    }}
                                >
                                    {[1, 2, 3, 4, 5].map(num => {
                                        const isSelected = answers[currentQuestionIndex] === num.toString();
                                        return (
                                            <button
                                                key={num}
                                                className={`th-sf-survey-number-option ${isSelected ? 'th-sf-survey-number-option-selected' : ''}`}
                                                style={{
                                                    width: selectedView === 'mobile' ? '32px' : '40px',
                                                    height: selectedView === 'mobile' ? '32px' : '40px',
                                                    border: '2px solid',
                                                    borderColor: isSelected ? '#2c6ecb' : '#ccc',
                                                    borderRadius: '50%',
                                                    background: isSelected ? '#2c6ecb' : 'white',
                                                    color: isSelected ? 'white' : '#000',
                                                    fontSize: selectedView === 'mobile' ? '14px' : '16px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    fontWeight: isSelected ? '600' : '400'
                                                }}
                                                onClick={() => {
                                                    console.log('Number scale clicked:', num);
                                                    handleAnswerSelect(currentQuestionIndex, num.toString());
                                                }}
                                                onMouseOver={(e) => {
                                                    if (!isSelected) {
                                                        e.target.style.background = '#f8f9fa';
                                                        e.target.style.borderColor = '#999';
                                                        e.target.style.transform = 'scale(1.1)';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!isSelected) {
                                                        e.target.style.background = 'white';
                                                        e.target.style.borderColor = '#ccc';
                                                        e.target.style.transform = 'scale(1)';
                                                    }
                                                }}
                                            >
                                                {num}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Number Scale Labels */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        maxWidth: '300px',
                                        fontSize: '14px',
                                        color: '#6d7175'
                                    }}
                                >
                                    <span>Poor</span>
                                    <span>Excellent</span>
                                </div>
                            </div>
                        )}

                        {/* Multiple choice options */}
                        {currentQuestion.answerOptions && currentQuestion.answerOptions.length > 0 && (
                            <div
                                className="th-sf-survey-multiple-choice-container"
                                style={{
                                    width: '100%',
                                    maxWidth: selectedView === 'mobile' ? '320px' : '500px',
                                    padding: selectedView === 'mobile' ? '8px' : '10px'
                                }}
                            >
                                {currentQuestion.answerOptions.map((option) => {
                                    const isSelected = answers[currentQuestionIndex]?.multipleChoice === option.text;
                                    return (
                                        <div
                                            key={option.id}
                                            className="th-sf-survey-multiple-choice-option"
                                            style={{
                                                border: '2px solid',
                                                borderColor: isSelected ? '#2c6ecb' : '#ccc',
                                                borderRadius: selectedView === 'mobile' ? '12px' : '8px',
                                                padding: selectedView === 'mobile' ? '12px 16px' : '16px 20px',
                                                marginBottom: selectedView === 'mobile' ? '8px' : '12px',
                                                background: isSelected ? '#f1f8ff' : '#fff',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'all 0.2s ease',
                                                transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                                            }}
                                            onClick={() => {
                                                console.log('Multiple choice option clicked:', option.text);
                                                const currentAnswer = answers[currentQuestionIndex] || {};
                                                const newAnswer = {
                                                    ...currentAnswer,
                                                    multipleChoice: option.text
                                                };
                                                handleAnswerSelect(currentQuestionIndex, newAnswer);
                                            }}
                                            onMouseOver={(e) => {
                                                if (!isSelected) {
                                                    e.target.style.background = '#f8f9fa';
                                                    e.target.style.borderColor = '#999';
                                                    e.target.style.transform = 'scale(1.02)';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (!isSelected) {
                                                    e.target.style.background = '#fff';
                                                    e.target.style.borderColor = '#ccc';
                                                    e.target.style.transform = 'scale(1)';
                                                }
                                            }}
                                        >
                                            <div
                                                className="th-sf-survey-multiple-choice-radio"
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    border: '2px solid',
                                                    borderColor: isSelected ? '#2c6ecb' : '#ccc',
                                                    marginRight: '16px',
                                                    background: isSelected ? '#2c6ecb' : 'transparent',
                                                    position: 'relative'
                                                }}
                                            >
                                                {isSelected && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            width: '8px',
                                                            height: '8px',
                                                            background: 'white',
                                                            borderRadius: '50%'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <span
                                                className="th-sf-survey-multiple-choice-text"
                                                style={{
                                                    fontSize: '16px',
                                                    fontWeight: isSelected ? '600' : '400',
                                                    color: isSelected ? '#2c6ecb' : '#202223'
                                                }}
                                            >
                                                {option.text}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Text input for text type questions */}
                        {currentQuestion.type === 'text' && (
                            <div
                                className="th-sf-survey-text-input-container"
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    padding: '10px'
                                }}
                            >
                                <textarea
                                    className="th-sf-survey-text-input-field"
                                    placeholder="Type your answer here..."
                                    style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        minHeight: '80px',
                                        background: '#fff',
                                        cursor: 'text',
                                        width: '100%',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                    value={answers[currentQuestionIndex] || ''}
                                    onChange={(e) => handleAnswerSelect(currentQuestionIndex, e.target.value)}
                                />
                            </div>
                        )}

                        {/* Date picker for date type questions */}
                        {currentQuestion.type === 'date' && (
                            <div
                                className="th-sf-survey-date-input-container"
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    padding: '10px'
                                }}
                            >
                                <div
                                    style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '12px',
                                        background: '#fff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span style={{ fontSize: '16px' }}>📅</span>
                                    <span style={{ color: '#6d7175' }}>
                                        {currentQuestion.selectedDate
                                            ? new Date(currentQuestion.selectedDate).toLocaleDateString()
                                            : 'Select a date'
                                        }
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            ref={previewRef}
            id="th-sf-survey-preview-container"
            className={`th-sf-survey-preview-container ${selectedView}`}
            style={{
                padding: '16px',
                background: '#f6f6f7',
                height: '100%',
                overflow: 'hidden'
            }}
        >
            <style>
                {`
                    @keyframes slideIn {
                        from { 
                            opacity: 0; 
                            transform: translateX(30px);
                        }
                        to { 
                            opacity: 1; 
                            transform: translateX(0);
                        }
                    }
                    
                    .th-sf-survey-question-content {
                        animation: slideIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
                    }

                    .th-sf-survey-preview-content {
                        scrollbar-width: thin;
                        scrollbar-color: #c1c1c1 #f1f1f1;
                    }

                    .th-sf-survey-preview-content::-webkit-scrollbar {
                        width: 8px;
                    }

                    .th-sf-survey-preview-content::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 4px;
                    }

                    .th-sf-survey-preview-content::-webkit-scrollbar-thumb {
                        background: #c1c1c1;
                        border-radius: 4px;
                    }

                    .th-sf-survey-preview-content::-webkit-scrollbar-thumb:hover {
                        background: #a8a8a8;
                    }

                    .th-sf-survey-preview-content {
                        overscroll-behavior: contain;
                        scroll-behavior: smooth;
                    }

                    /* View mode transitions */
                    .th-sf-survey-card {
                        transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                    }

                    /* Mobile view specific styles */
                    .th-sf-survey-preview-container.mobile-view .th-sf-survey-card {
                        max-width: 375px;
                        margin: 0 auto;
                    }

                    /* Fullscreen view specific styles */
                    .th-sf-survey-preview-container.maximize-view .th-sf-survey-card {
                        max-width: 800px;
                        margin: 0 auto;
                    }

                    /* Desktop view specific styles */
                    .th-sf-survey-preview-container.desktop-view .th-sf-survey-card {
                        max-width: 600px;
                        margin: 0 auto;
                    }

                    /* Smooth transitions for all view mode changes */
                    .th-sf-survey-preview-container,
                    .th-sf-survey-card,
                    .th-sf-survey-question-heading,
                    .th-sf-survey-question-description,
                    .th-sf-survey-multiple-choice-container,
                    .th-sf-survey-rating-scale {
                        transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                    }

                    /* View mode indicator animations */
                    .th-sf-view-mode-indicator {
                        animation: fadeInUp 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
                    }

                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    /* Enhanced star rating styles */
                    .th-sf-survey-rating-option {
                        transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                    }

                    .th-sf-survey-rating-option:hover {
                        transform: scale(1.1);
                    }

                    .th-sf-survey-rating-option-selected {
                        animation: starPulse 0.6s ease-in-out;
                    }

                    @keyframes starPulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                    }

                    /* Satisfaction scale styles */
                    .th-sf-survey-satisfaction-option {
                        transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                    }

                    .th-sf-survey-satisfaction-option:hover {
                        transform: scale(1.05);
                    }

                    .th-sf-survey-satisfaction-option-selected {
                        animation: emojiBounce 0.6s ease-in-out;
                    }

                    @keyframes emojiBounce {
                        0%, 100% { transform: scale(1.1); }
                        50% { transform: scale(1.3); }
                    }

                    /* Date input styles */
                    .th-sf-survey-date-input-container {
                        transition: all 0.2s ease;
                    }

                    .th-sf-survey-date-input-container:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                `}
            </style>
            <div
                data-preview-content
                className="th-sf-survey-preview-content"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    alignItems: 'center',
                    height: '100%',
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
            >
                {/* Survey Card */}
                <div
                    className="th-sf-survey-card"
                    style={{
                        background: 'white',
                        borderRadius: selectedView === 'mobile' ? '20px' : '8px',
                        boxShadow: selectedView === 'mobile'
                            ? '0 4px 20px rgba(0, 0, 0, 0.15)'
                            : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        width: surveyCardStyle.width,
                        maxWidth: surveyCardStyle.maxWidth,
                        border: 'none',
                        position: 'relative'
                    }}
                >
                    {/* Mobile device frame indicator */}
                    {selectedView === 'mobile' && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '6px',
                                background: '#1a1a1a',
                                borderRadius: '3px',
                                zIndex: 1
                            }}
                        />
                    )}

                    <div
                        className="th-sf-survey-card-content"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            alignItems: 'center',
                            padding: selectedView === 'mobile' ? '16px' : '0'
                        }}
                    >
                        <div
                            className="th-sf-survey-question-area"
                            style={{
                                paddingTop: '24px',
                                width: '100%',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Enhanced transition with slide effect */}
                            <div
                                className="th-sf-survey-question-content"
                                key={`question-${currentQuestionIndex}-${currentQuestion?.id}-${currentQuestion?.type}`}
                                style={{
                                    opacity: 1,
                                    transform: 'translateX(0)',
                                    transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                    width: '100%',
                                    animation: 'slideIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
                                }}
                            >
                                {renderQuestionContent()}
                            </div>
                        </div>

                        {/* Survey Navigation */}
                        <div
                            className="th-sf-survey-navigation"
                            style={{
                                borderTop: '1px solid #e1e3e5',
                                paddingTop: '16px',
                                width: '100%'
                            }}
                        >
                            <div
                                className="th-sf-survey-navigation-content"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '0 24px 24px 24px'
                                }}
                            >
                                {/* Previous Button - Only show when not on thank you card */}
                                {!showThankYou && (
                                    <button
                                        className="th-sf-survey-prev-button"
                                        onClick={handlePrevious}
                                        disabled={currentQuestionIndex === 0}
                                        style={{
                                            padding: '8px 16px',
                                            background: currentQuestionIndex === 0 ? '#f1f1f1' : '#6d7175',
                                            color: currentQuestionIndex === 0 ? '#999' : 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            transition: 'all 0.2s ease',
                                            opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                                            transform: 'scale(1)'
                                        }}
                                        onMouseOver={(e) => {
                                            if (currentQuestionIndex > 0) {
                                                e.target.style.background = '#5a5a5a';
                                                e.target.style.transform = 'scale(1.05)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (currentQuestionIndex > 0) {
                                                e.target.style.background = '#6d7175';
                                                e.target.style.transform = 'scale(1)';
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            if (currentQuestionIndex > 0) {
                                                e.target.style.transform = 'scale(0.95)';
                                            }
                                        }}
                                        onMouseUp={(e) => {
                                            if (currentQuestionIndex > 0) {
                                                e.target.style.transform = 'scale(1.05)';
                                            }
                                        }}>
                                        Previous
                                    </button>
                                )}

                                {/* Progress Indicators */}
                                <div
                                    className="th-sf-survey-progress-indicators"
                                    style={{
                                        display: 'flex',
                                        gap: '4px'
                                    }}
                                >
                                    {questions.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`th-sf-survey-progress-dot ${index <= currentQuestionIndex ? 'th-sf-survey-progress-dot-active' : ''}`}
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                background: index <= currentQuestionIndex ? '#000' : '#ddd',
                                                borderRadius: '50%',
                                                transition: 'background 0.2s ease'
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Next/Submit Button */}
                                <button
                                    className="th-sf-survey-next-button"
                                    onClick={handleNext}
                                    disabled={!showThankYou && !isQuestionComplete()}
                                    style={{
                                        padding: '8px 16px',
                                        background: (!showThankYou && !isQuestionComplete()) ? '#ccc' : '#1a1a1a',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: (!showThankYou && !isQuestionComplete()) ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.2s ease',
                                        transform: 'scale(1)',
                                        opacity: (!showThankYou && !isQuestionComplete()) ? 0.6 : 1
                                    }}
                                    onMouseOver={(e) => {
                                        if (!(!showThankYou && !isQuestionComplete())) {
                                            e.target.style.background = '#333';
                                            e.target.style.transform = 'scale(1.05)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!(!showThankYou && !isQuestionComplete())) {
                                            e.target.style.background = '#1a1a1a';
                                            e.target.style.transform = 'scale(1)';
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        if (!(!showThankYou && !isQuestionComplete())) {
                                            e.target.style.transform = 'scale(0.95)';
                                        }
                                    }}
                                    onMouseUp={(e) => {
                                        if (!(!showThankYou && !isQuestionComplete())) {
                                            e.target.style.transform = 'scale(1.05)';
                                        }
                                    }}>
                                    {showThankYou ? 'Submit' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Branding Footer */}
                <div
                    className="th-sf-survey-branding-footer"
                    style={{
                        paddingBottom: '16px'
                    }}
                >
                    <p
                        className="th-sf-survey-branding-text"
                        style={{
                            fontSize: '14px',
                            color: '#6d7175',
                            textAlign: 'center',
                            margin: '0'
                        }}
                    >
                        Want your logo to shine in the survey? <a
                            href="#"
                            className="th-sf-survey-branding-link"
                            style={{
                                color: '#2c6ecb',
                                textDecoration: 'none'
                            }}
                        >
                            Let us help
                        </a>
                    </p>
                </div>

                {/* Debug Info (for development only) */}
                {/* {process.env.NODE_ENV === 'development' && (
                    <div
                        className="th-sf-survey-debug-container"
                        style={{
                            padding: '16px',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            marginTop: '16px',
                            fontSize: '12px',
                            color: '#666'
                        }}
                    >
                        <div><strong>Debug Info:</strong></div>
                        <div>Current Question: {currentQuestionIndex + 1} of {questions.length}</div>
                        <div>Question ID: {currentQuestion?.id}</div>
                        <div>Question Type: {currentQuestion?.type}</div>
                        <div>Answers: {JSON.stringify(answers, null, 2)}</div>
                        <div>Show Thank You: {showThankYou ? 'Yes' : 'No'}</div>
                        <div>Total Questions: {questions.length}</div>
                        <div>Can Go Next: {currentQuestionIndex < questions.length - 1 ? 'Yes' : 'No'}</div>
                        <div>Can Go Previous: {currentQuestionIndex > 0 ? 'Yes' : 'No'}</div>
                        <div>Question Complete: {isQuestionComplete() ? 'Yes' : 'No'}</div>
                        <div>Rating Complete: {currentQuestion?.type === 'rating' ?
                            (answers[currentQuestionIndex]?.rating && answers[currentQuestionIndex]?.option ? 'Yes' : 'No') : 'N/A'}</div>
                        <div>Multiple Choice: {answers[currentQuestionIndex]?.multipleChoice || 'None'}</div>

                        <button
                            className="th-sf-survey-test-button"
                            onClick={() => {
                                if (ref && ref.current) {
                                    const bodyContent = ref.current.getBodyContent();
                                    const fullHTML = ref.current.getHTMLContent();
                                    const jsContent = ref.current.getJavaScriptContent();
                                    console.log('Body Content:', bodyContent);
                                    console.log('Full HTML:', fullHTML);
                                    console.log('JavaScript Content:', jsContent);

                                    // Create a new window to preview the captured HTML
                                    const previewWindow = window.open('', '_blank');
                                    previewWindow.document.write(fullHTML);
                                    previewWindow.document.close();
                                }
                            }}
                            style={{
                                padding: '8px 16px',
                                background: '#2c6ecb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                marginTop: '8px'
                            }}
                        >
                            Test HTML Capture
                        </button>
                    </div>
                )} */}
            </div>
        </div>
    );
});

export default SurveyPreview;
