import React from 'react';
import { Box, Text, Card, BlockStack } from '@shopify/polaris';
import { useSurveyState } from '../../hooks/useSurveyState';

function SurveyPreview() {
    const { questions, selectedQuestionId } = useSurveyState();

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
                <BlockStack gap="200" align="center">
                    <Text variant="headingLg" as="h3" alignment="center">
                        Thank you for your feedback!
                    </Text>
                    <Text variant="bodyMd" as="p" alignment="center">
                        We appreciate your time and input.
                    </Text>
                </BlockStack>
            );
        }

        return (
            <BlockStack gap="200">
                <Text variant="headingLg" as="h3" alignment="center">
                    {selectedQuestion.content}
                </Text>

                {selectedQuestion.description && (
                    <Text variant="bodyMd" as="p" alignment="center">
                        {selectedQuestion.description}
                    </Text>
                )}

                <Box paddingBlockStart="400" paddingBlockEnd="400">
                    <BlockStack gap="400" align="center">
                        {/* Emoji */}
                        {selectedQuestion.type === 'rating' && (
                            <div style={{ fontSize: '48px', textAlign: 'center' }}>
                                😐
                            </div>
                        )}

                        {/* Rating Text */}
                        {selectedQuestion.type === 'rating' && (
                            <Text alignment="center">Not likely</Text>
                        )}

                        {/* Rating Scale */}
                        {(selectedQuestion.type === 'rating' || selectedQuestion.type === 'number-scale') && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '8px',
                                width: '100%',
                                paddingTop: '10px'
                            }}>
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <button
                                        key={num}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            background: num === 3 ? '#f1f8ff' : 'white',
                                            color: '#000',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Multiple choice options */}
                        {selectedQuestion.answerOptions && selectedQuestion.answerOptions.length > 0 && (
                            <div style={{
                                width: '100%',
                                maxWidth: '500px',
                                padding: '10px'
                            }}>
                                {selectedQuestion.answerOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '12px 16px',
                                            marginBottom: '8px',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            marginRight: '12px'
                                        }} />
                                        {option.text}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Text input for text type questions */}
                        {selectedQuestion.type === 'text' && (
                            <div style={{
                                width: '100%',
                                maxWidth: '500px',
                                padding: '10px'
                            }}>
                                <div style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    minHeight: '80px',
                                    background: '#fff'
                                }}></div>
                            </div>
                        )}
                    </BlockStack>
                </Box>
            </BlockStack>
        );
    };

    return (
        <Box
            padding="400"
            background="bg-surface-secondary"
            minHeight="calc(100vh - 100px)"
            overflow="auto"
        >
            <BlockStack gap="400" align="center">
                {/* Survey Card */}
                <Card>
                    <BlockStack gap="600" align="center">
                        <Box paddingBlockStart="500">
                            {renderQuestionContent()}
                        </Box>

                        {/* Survey Navigation */}
                        <Box borderBlockStartWidth="1" borderColor="border" paddingBlockStart="400" width="100%">
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{ width: '80px' }}></div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#000', borderRadius: '50%' }}></div>
                                    <div style={{ width: '8px', height: '8px', background: '#ddd', borderRadius: '50%' }}></div>
                                    <div style={{ width: '8px', height: '8px', background: '#ddd', borderRadius: '50%' }}></div>
                                </div>
                                <button style={{
                                    padding: '8px 16px',
                                    background: '#1a1a1a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                                    Next
                                </button>
                            </div>
                        </Box>
                    </BlockStack>
                </Card>

                {/* Branding Footer */}
                <Box paddingBlockEnd="400">
                    <Text variant="bodySm" color="text-subdued" alignment="center">
                        Want your logo to shine in the survey? <a href="#" style={{ color: '#2c6ecb' }}>Let us help</a>
                    </Text>
                </Box>
            </BlockStack>
        </Box>
    );
}

export default SurveyPreview;
