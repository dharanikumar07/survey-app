import React, { useState, useEffect } from 'react';
import { Box, Text, BlockStack, Divider, Button, TextField, Icon, InlineStack, Checkbox, Scrollable } from '@shopify/polaris';
import { DeleteIcon, DragHandleIcon, ArrowUpIcon, ArrowDownIcon } from '@shopify/polaris-icons';
import useStore from '../../../../State/store';

function QuestionSettings() {
    const {
        selectedQuestionId,
        setSelectedQuestionId,
        questions,
        updateQuestion,
        deleteQuestion,
        updateAnswerOption,
        deleteAnswerOption,
        addAnswerOption,
        reorderAnswerOptions
    } = useStore();

    // Find the currently selected question
    const selectedQuestion = questions.find(q => q.id === selectedQuestionId) || {
        id: '1',
        content: 'How likely are you to recommend us to a friend?',
        type: 'rating',
        description: '',
        questionType: 'Number scale',
        answerOptions: []
    };

    const [headingValue, setHeadingValue] = useState(selectedQuestion.content);
    const [descriptionValue, setDescriptionValue] = useState(selectedQuestion.description || '');
    const [allowSkip, setAllowSkip] = useState(false);

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

    // Handle checkbox change for allowing skipping questions
    const handleAllowSkipChange = (checked) => {
        setAllowSkip(checked);
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

    // Add a new answer option
    const handleAddAnswerOption = () => {
        addAnswerOption(selectedQuestionId, 'New option');
    };

    // Move an option up in the list
    const handleMoveUp = (optionId, index) => {
        if (index > 0) {
            reorderAnswerOptions(selectedQuestionId, index, index - 1);
        }
    };

    // Move an option down in the list
    const handleMoveDown = (optionId, index) => {
        if (index < selectedQuestion.answerOptions.length - 1) {
            reorderAnswerOptions(selectedQuestionId, index, index + 1);
        }
    };

    // Render an answer option item
    const renderAnswerOption = (option, index) => {
        const isFirst = index === 0;
        const isLast = index === selectedQuestion.answerOptions.length - 1;

        return (
            <Box
                key={option.id}
                padding="300"
                background="bg-surface-secondary"
                borderRadius="100"
                style={{ marginBottom: '8px' }}
            >
                <InlineStack gap="200" blockAlign="center" wrap={false}>
                    <div style={{ flex: 1 }}>
                        <TextField
                            value={option.text}
                            onChange={(value) => updateAnswerOption(selectedQuestionId, option.id, value)}
                            autoComplete="off"
                        />
                    </div>
                    <InlineStack gap="100">
                        <Button
                            icon={ArrowUpIcon}
                            variant="plain"
                            onClick={() => handleMoveUp(option.id, index)}
                            disabled={isFirst}
                            accessibilityLabel="Move up"
                        />
                        <Button
                            icon={ArrowDownIcon}
                            variant="plain"
                            onClick={() => handleMoveDown(option.id, index)}
                            disabled={isLast}
                            accessibilityLabel="Move down"
                        />
                        <Button
                            icon={DeleteIcon}
                            variant="tertiary"
                            tone="critical"
                            onClick={() => deleteAnswerOption(selectedQuestionId, option.id)}
                            accessibilityLabel="Delete option"
                        />
                    </InlineStack>
                </InlineStack>
            </Box>
        );
    };

    return (
        <Box
            padding="400"
            background="bg-surface"
            borderInlineStartWidth="1"
            borderColor="border"
            minHeight="calc(100vh - 120px)"
        >
            <Scrollable
                shadow
                horizontal={false}
                style={{
                    height: 'calc(100vh - 120px)',
                    maxHeight: 'calc(100vh - 120px)'
                }}
                focusable
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
                            multiline={4}
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
                            <Text variant="bodySm" as="h3">Answer(s)</Text>

                            {/* Answer options list with up/down controls instead of drag-and-drop */}
                            {selectedQuestion.answerOptions && selectedQuestion.answerOptions.length > 0 ? (
                                <BlockStack gap="200">
                                    {selectedQuestion.answerOptions.map((option, index) =>
                                        renderAnswerOption(option, index)
                                    )}
                                </BlockStack>
                            ) : (
                                <Box padding="300" background="bg-surface-secondary" borderRadius="100">
                                    <Text variant="bodyMd" alignment="center" color="subdued">No answer options yet</Text>
                                </Box>
                            )}

                            <Box paddingBlockStart="300">
                                <Button onClick={handleAddAnswerOption}>
                                    Add option
                                </Button>
                            </Box>

                            <Box paddingBlockStart="300">
                                <Checkbox
                                    label="Allow customers to skip this question"
                                    checked={allowSkip}
                                    onChange={handleAllowSkipChange}
                                />
                            </Box>
                        </BlockStack>
                    )}

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
                                icon={DeleteIcon}
                            >
                                Delete question
                            </Button>
                        </Box>
                    )}
                </BlockStack>
            </Scrollable>
        </Box>
    );
}

export default QuestionSettings;
