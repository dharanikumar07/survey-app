import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useSurveyState } from '../../hooks/useSurveyState';

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
 * 
 * // The HTML content includes all inline styles and can be directly
 * // embedded in storefront pages or stored in the backend.
 */
const SurveyPreview = forwardRef((props, ref) => {
    const { questions, selectedQuestionId } = useSurveyState();
    const previewRef = useRef(null);

    // Expose method to get HTML content for backend storage
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
        }
    }));

    // Find the currently selected question
    const selectedQuestion = questions.find(q => q.id === selectedQuestionId) || {
        id: '1',
        content: 'How likely are you to recommend us to a friend?',
        type: 'rating',
        description: '',
        questionType: 'Number scale'
    };

    // Different UI based on question type
    const renderQuestionContent = () => {
        if (selectedQuestion.type === 'card') {
            return (
                <div
                    className="th-sf-survey-thank-you-card"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        alignItems: 'center',
                        textAlign: 'center'
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
                    {selectedQuestion.content}
                </h3>

                {selectedQuestion.description && (
                    <p
                        className="th-sf-survey-question-description"
                        style={{
                            fontSize: '16px',
                            margin: '0',
                            color: '#6d7175',
                            textAlign: 'center'
                        }}
                    >
                        {selectedQuestion.description}
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
                        {selectedQuestion.type === 'rating' && (
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
                        {selectedQuestion.type === 'rating' && (
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

                        {/* Rating Scale */}
                        {(selectedQuestion.type === 'rating' || selectedQuestion.type === 'number-scale') && (
                            <div
                                className="th-sf-survey-rating-scale"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    paddingTop: '10px'
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <button
                                        key={num}
                                        className={`th-sf-survey-rating-option ${num === 3 ? 'th-sf-survey-rating-option-selected' : ''}`}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            background: num === 3 ? '#f1f8ff' : 'white',
                                            color: '#000',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = '#f8f9fa';
                                            e.target.style.borderColor = '#999';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = num === 3 ? '#f1f8ff' : 'white';
                                            e.target.style.borderColor = '#ccc';
                                        }}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Multiple choice options */}
                        {selectedQuestion.answerOptions && selectedQuestion.answerOptions.length > 0 && (
                            <div
                                className="th-sf-survey-multiple-choice-container"
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    padding: '10px'
                                }}
                            >
                                {selectedQuestion.answerOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className="th-sf-survey-multiple-choice-option"
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '12px 16px',
                                            marginBottom: '8px',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = '#f8f9fa';
                                            e.target.style.borderColor = '#999';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = '#fff';
                                            e.target.style.borderColor = '#ccc';
                                        }}
                                    >
                                        <div
                                            className="th-sf-survey-multiple-choice-radio"
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                border: '1px solid #ccc',
                                                marginRight: '12px'
                                            }}
                                        />
                                        <span className="th-sf-survey-multiple-choice-text">{option.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Text input for text type questions */}
                        {selectedQuestion.type === 'text' && (
                            <div
                                className="th-sf-survey-text-input-container"
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    padding: '10px'
                                }}
                            >
                                <div
                                    className="th-sf-survey-text-input-field"
                                    style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        minHeight: '80px',
                                        background: '#fff',
                                        cursor: 'text'
                                    }}
                                ></div>
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
                                width: '100%'
                            }}
                        >
                            {renderQuestionContent()}
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
                                <div className="th-sf-survey-nav-spacer" style={{ width: '80px' }}></div>
                                <div
                                    className="th-sf-survey-progress-indicators"
                                    style={{
                                        display: 'flex',
                                        gap: '4px'
                                    }}
                                >
                                    <div
                                        className="th-sf-survey-progress-dot th-sf-survey-progress-dot-active"
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            background: '#000',
                                            borderRadius: '50%'
                                        }}
                                    ></div>
                                    <div
                                        className="th-sf-survey-progress-dot"
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            background: '#ddd',
                                            borderRadius: '50%'
                                        }}
                                    ></div>
                                    <div
                                        className="th-sf-survey-progress-dot"
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            background: '#ddd',
                                            borderRadius: '50%'
                                        }}
                                    ></div>
                                </div>
                                <button
                                    className="th-sf-survey-next-button"
                                    style={{
                                        padding: '8px 16px',
                                        background: '#1a1a1a',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = '#333';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = '#1a1a1a';
                                    }}>
                                    Next
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

                {/* Test HTML Capture Button (for development only) */}
                {/* {process.env.NODE_ENV === 'development' && (
                    <div
                        className="th-sf-survey-test-button-container"
                        style={{
                            paddingBottom: '16px',
                            textAlign: 'center'
                        }}
                    >
                        <button
                            className="th-sf-survey-test-button"
                            onClick={() => {
                                if (ref && ref.current) {
                                    const bodyContent = ref.current.getBodyContent();
                                    const fullHTML = ref.current.getHTMLContent();
                                    console.log('Body Content:', bodyContent);
                                    console.log('Full HTML:', fullHTML);

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
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Test HTML Capture (Dev Only)
                        </button>
                    </div>
                )} */}
            </div>
        </div>
    );
});

export default SurveyPreview;
