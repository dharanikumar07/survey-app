import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
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
    const { questions, selectedQuestionId } = useSurveyState();
    const previewRef = useRef(null);
    const jsContentRef = useRef('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

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
    const currentQuestion = questions[currentQuestionIndex] || questions.find(q => q.id === selectedQuestionId) || {
        id: '1',
        content: 'How likely are you to recommend us to a friend?',
        type: 'rating',
        description: '',
        questionType: 'Number scale'
    };

    // Handle next button click
    const handleNext = () => {
        console.log('Next clicked. Current:', currentQuestionIndex, 'Total:', questions.length);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            console.log('Moving to next question:', currentQuestionIndex + 1);
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
            setCurrentQuestionIndex(prev => prev - 1);
            console.log('Moving to previous question:', currentQuestionIndex - 1);
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
                        gap: '32px',
                        alignItems: 'center',
                        textAlign: 'center',
                        paddingTop: '40px',
                        paddingBottom: '40px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
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
                        fontSize: '24px',
                        fontWeight: '600',
                        margin: '0',
                        color: '#202223',
                        textAlign: 'center'
                    }}
                >
                    {currentQuestion.content}
                </h3>

                {currentQuestion.description && (
                    <p
                        className="th-sf-survey-question-description"
                        style={{
                            fontSize: '16px',
                            margin: '0',
                            color: '#6d7175',
                            textAlign: 'center'
                        }}
                    >
                        {currentQuestion.description}
                    </p>
                )}

                <div
                    className="th-sf-survey-answer-area"
                    style={{
                        paddingTop: '32px',
                        paddingBottom: '32px',
                        width: '100%'
                    }}
                >
                    <div
                        className="th-sf-survey-answer-content"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '32px',
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
                                {/* Rating Numbers */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        width: '100%'
                                    }}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => {
                                        const isSelected = answers[currentQuestionIndex]?.rating === num.toString();
                                        return (
                                            <button
                                                key={num}
                                                className={`th-sf-survey-rating-option ${isSelected ? 'th-sf-survey-rating-option-selected' : ''}`}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    border: '2px solid',
                                                    borderColor: isSelected ? '#2c6ecb' : '#ccc',
                                                    borderRadius: '50%',
                                                    background: isSelected ? '#2c6ecb' : 'white',
                                                    color: isSelected ? 'white' : '#000',
                                                    fontSize: '16px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    fontWeight: isSelected ? '600' : '400'
                                                }}
                                                onClick={() => {
                                                    console.log('Rating number clicked:', num);
                                                    const currentAnswer = answers[currentQuestionIndex] || {};
                                                    const newAnswer = {
                                                        ...currentAnswer,
                                                        rating: num.toString()
                                                    };
                                                    handleAnswerSelect(currentQuestionIndex, newAnswer);
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
                                {/* Selected Answers Display */}
                                {answers[currentQuestionIndex] && (answers[currentQuestionIndex].rating || answers[currentQuestionIndex].option || answers[currentQuestionIndex].multipleChoice) && (
                                    <div
                                        style={{
                                            padding: '12px 16px',
                                            background: '#f1f8ff',
                                            border: '1px solid #2c6ecb',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                            color: '#2c6ecb',
                                            fontWeight: '500',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {answers[currentQuestionIndex].rating && (
                                            <div>Rating: {answers[currentQuestionIndex].rating}</div>
                                        )}
                                        {answers[currentQuestionIndex].optionLabel && (
                                            <div>Option: {answers[currentQuestionIndex].optionLabel}</div>
                                        )}
                                        {answers[currentQuestionIndex].multipleChoice && (
                                            <div>Multiple Choice: {answers[currentQuestionIndex].multipleChoice}</div>
                                        )}
                                    </div>
                                )}
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
                                        gap: '8px',
                                        width: '100%'
                                    }}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => {
                                        const isSelected = answers[currentQuestionIndex] === num.toString();
                                        return (
                                            <button
                                                key={num}
                                                className={`th-sf-survey-number-option ${isSelected ? 'th-sf-survey-number-option-selected' : ''}`}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    border: '2px solid',
                                                    borderColor: isSelected ? '#2c6ecb' : '#ccc',
                                                    borderRadius: '50%',
                                                    background: isSelected ? '#2c6ecb' : 'white',
                                                    color: isSelected ? 'white' : '#000',
                                                    fontSize: '16px',
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
                                    maxWidth: '500px',
                                    padding: '10px'
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
                                                borderRadius: '8px',
                                                padding: '16px 20px',
                                                marginBottom: '12px',
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
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            ref={previewRef}
            id="th-sf-survey-preview-container"
            className="th-sf-survey-preview-container"
            style={{
                padding: '32px',
                background: '#f6f6f7',
                minHeight: 'calc(100vh - 100px)',
                overflow: 'auto'
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
                `}
            </style>
            <div
                data-preview-content
                className="th-sf-survey-preview-content"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    alignItems: 'center'
                }}
            >
                {/* Survey Card */}
                <div
                    className="th-sf-survey-card"
                    style={{
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        width: '100%',
                        maxWidth: '600px'
                    }}
                >
                    <div
                        className="th-sf-survey-card-content"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '48px',
                            alignItems: 'center'
                        }}
                    >
                        <div
                            className="th-sf-survey-question-area"
                            style={{
                                paddingTop: '40px',
                                width: '100%',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Enhanced transition with slide effect */}
                            <div
                                className="th-sf-survey-question-content"
                                key={`question-${currentQuestionIndex}`}
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
                                paddingTop: '32px',
                                width: '100%'
                            }}
                        >
                            <div
                                className="th-sf-survey-navigation-content"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '0 32px 32px 32px'
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
                        paddingBottom: '32px'
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
                {process.env.NODE_ENV === 'development' && (
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
                )}
            </div>
        </div>
    );
});

export default SurveyPreview;
