import React, { useState, useEffect } from 'react';
import { Box, Text, BlockStack, Divider, Button, TextField } from '@shopify/polaris';
import useStore from '../../../../State/store';

function QuestionSettings() {
    const {
        selectedQuestionId,
        setSelectedQuestionId,
        questions,
        updateQuestion,
        deleteQuestion
    } = useStore();

    // Find the currently selected question
    const selectedQuestion = questions.find(q => q.id === selectedQuestionId) || {
        id: '1',
        content: 'How likely are you to recommend us to a friend?',
        type: 'rating',
        description: '',
        questionType: 'Number scale'
    };

    const [headingValue, setHeadingValue] = useState(selectedQuestion.content);
    const [descriptionValue, setDescriptionValue] = useState(selectedQuestion.description || '');

    // Update local state when selected question changes
    useEffect(() => {
        setHeadingValue(selectedQuestion.content);
        setDescriptionValue(selectedQuestion.description || '');
    }, [selectedQuestion]);

    // Update the heading when input changes
    const handleHeadingChange = (value) => {
        setHeadingValue(value);
        updateQuestion(selectedQuestionId, { content: value });
    };

    // Update the description when input changes
    const handleDescriptionChange = (value) => {
        setDescriptionValue(value);
        updateQuestion(selectedQuestionId, { description: value });
    };

    // Delete the current question
    const handleDeleteQuestion = () => {
        if (questions.length <= 1 || selectedQuestionId === 'thankyou') return; // Don't delete if it's the last question or thank you card

        const currentIndex = questions.findIndex(q => q.id === selectedQuestionId);
        let nextId = selectedQuestionId;

        if (currentIndex > 0) {
            // Select previous question if available
            nextId = questions[currentIndex - 1].id;
        } else if (questions.length > 1) {
            // Otherwise select next question
            nextId = questions[1].id;
        }

        // Delete the question
        deleteQuestion(selectedQuestionId);

        // Set the new selected question
        setSelectedQuestionId(nextId);
    };

    return (
        <Box
            padding="400"
            background="bg-surface"
            borderInlineStartWidth="1"
            borderColor="border"
            minHeight="calc(100vh - 100px)"
            overflow="auto"
        >
            <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Question</Text>

                <BlockStack gap="300">
                    <Text variant="bodySm" as="h3">Question type</Text>
                    <div style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '10px 12px'
                    }}>
                        <Text variant="bodySm">{selectedQuestion.questionType}</Text>
                    </div>
                </BlockStack>

                <BlockStack gap="300">
                    <Text variant="bodySm" as="h3">Heading</Text>
                    <TextField
                        value={headingValue}
                        onChange={handleHeadingChange}
                        autoComplete="off"
                        multiline={2}
                        disabled={selectedQuestionId === 'thankyou'}
                    />
                </BlockStack>

                <BlockStack gap="300">
                    <Text variant="bodySm" as="h3">Description</Text>
                    <TextField
                        value={descriptionValue}
                        onChange={handleDescriptionChange}
                        autoComplete="off"
                        multiline={3}
                        placeholder="Add a description (optional)"
                        disabled={selectedQuestionId === 'thankyou'}
                    />
                </BlockStack>

                {selectedQuestionId !== 'thankyou' && (
                    <BlockStack gap="300">
                        <Text variant="bodySm" as="h3">Image</Text>
                        <div style={{
                            border: '1px dashed #ddd',
                            borderRadius: '4px',
                            padding: '20px',
                            textAlign: 'center'
                        }}>
                            <BlockStack gap="200" align="center">
                                <Text variant="bodySm">Add Image</Text>
                                <Text variant="bodySm" color="text-subdued">
                                    Accepts .svg, .jpg, .jpeg, and .png
                                </Text>
                            </BlockStack>
                        </div>
                    </BlockStack>
                )}

                <Divider />

                {selectedQuestionId !== 'thankyou' && (
                    <Box>
                        <Button
                            variant="plain"
                            tone="critical"
                            onClick={handleDeleteQuestion}
                            disabled={questions.length <= 1}
                        >
                            Delete question
                        </Button>
                    </Box>
                )}
            </BlockStack>
        </Box>
    );
}

export default QuestionSettings;
