import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, BlockStack, Divider, Button, TextField, Icon, InlineStack, Checkbox, Scrollable, Popover, Card, DatePicker } from '@shopify/polaris';
import { DeleteIcon, DragHandleIcon, ArrowUpIcon, ArrowDownIcon, CalendarIcon } from '@shopify/polaris-icons';
import { useSurveyState } from '../../hooks/useSurveyState';
import { validateQuestion, getQuestionTypeDisplayName } from '../../utils/surveyHelpers';

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
    } = useSurveyState();

    // Find the currently selected question
    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

    // If no question is selected or found, show a message
    if (!selectedQuestion) {
        return (
            <Box
                padding="400"
                background="bg-surface"
                borderInlineStartWidth="1"
                borderColor="border"
                minHeight="calc(100vh - 120px)"
            >
                <BlockStack gap="400" align="center">
                    <Text variant="headingMd" as="h2">Question</Text>
                    <Box padding="400" background="bg-surface-secondary" borderRadius="300">
                        <Text variant="bodyMd" alignment="center" color="subdued">
                            No question selected. Please select a question from the left panel.
                        </Text>
                    </Box>
                </BlockStack>
            </Box>
        );
    }

    console.log('QuestionSettings: selectedQuestionId:', selectedQuestionId);
    console.log('QuestionSettings: selectedQuestion:', selectedQuestion);
    console.log('QuestionSettings: all questions:', questions);

    const [headingValue, setHeadingValue] = useState(selectedQuestion.content);
    const [descriptionValue, setDescriptionValue] = useState(selectedQuestion.description || '');
    const [allowSkip, setAllowSkip] = useState(false);

    // Date picker state for date-type questions
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(selectedQuestion.selectedDate ? new Date(selectedQuestion.selectedDate) : new Date());
    const [{ month, year }, setDate] = useState({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
    });
    const datePickerRef = useRef(null);

    // Update local state when selected question changes
    useEffect(() => {
        console.log('QuestionSettings: selectedQuestion changed, updating local state');
        setHeadingValue(selectedQuestion.content);
        setDescriptionValue(selectedQuestion.description || '');
        // Reset other local state as needed
    }, [selectedQuestion]);

    // Also update when selectedQuestionId changes
    useEffect(() => {
        console.log('QuestionSettings: selectedQuestionId changed to:', selectedQuestionId);
    }, [selectedQuestionId]);

    // Update the heading when input changes
    const handleHeadingChange = (value) => {
        const updatedQuestion = { ...selectedQuestion, content: value };
        const errors = validateQuestion(updatedQuestion);

        if (errors.length === 0) {
            setHeadingValue(value);
            updateQuestion(selectedQuestionId, { content: value });
        } else {
            console.error('Validation errors:', errors);
            // TODO: Show validation errors to user
            // For now, still update but log errors
            setHeadingValue(value);
            updateQuestion(selectedQuestionId, { content: value });
        }
    };

    // Update the description when input changes
    const handleDescriptionChange = (value) => {
        const updatedQuestion = { ...selectedQuestion, description: value };
        const errors = validateQuestion(updatedQuestion);

        if (errors.length === 0) {
            setDescriptionValue(value);
            updateQuestion(selectedQuestionId, { description: value });
        } else {
            console.error('Validation errors:', errors);
            // TODO: Show validation errors to user
            // For now, still update but log errors
            setDescriptionValue(value);
            updateQuestion(selectedQuestionId, { description: value });
        }
    };

    // Handle checkbox change for allowing skipping questions
    const handleAllowSkipChange = (checked) => {
        setAllowSkip(checked);
    };

    // Date picker handlers
    const handleDatePickerOpen = () => {
        setDatePickerVisible(true);
    };

    const handleDatePickerClose = () => {
        setDatePickerVisible(false);
    };

    const handleMonthChange = (month, year) => {
        setDate({ month, year });
    };

    const handleDateSelection = ({ end: newSelectedDate }) => {
        setSelectedDate(newSelectedDate);
        setDatePickerVisible(false);
        // Update the question with the selected date
        updateQuestion(selectedQuestionId, { selectedDate: newSelectedDate.toISOString() });
    };

    // Update date state when selected question changes
    useEffect(() => {
        if (selectedQuestion.selectedDate) {
            const newDate = new Date(selectedQuestion.selectedDate);
            setSelectedDate(newDate);
            setDate({
                month: newDate.getMonth(),
                year: newDate.getFullYear(),
            });
        }
    }, [selectedQuestion.selectedDate]);

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
                className="th-sf-answer-option"
            >
                <InlineStack gap="200" blockAlign="center" wrap={false}>
                    <div className="th-sf-answer-option-content">
                        <TextField
                            value={option.text}
                            onChange={(value) => updateAnswerOption(selectedQuestionId, option.id, value)}
                            autoComplete="off"
                        />
                    </div>
                    <InlineStack gap="100" className="th-sf-answer-option-controls">
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
                // shadow
                horizontal={false}
                style={{
                    height: 'calc(100vh - 120px)',
                    maxHeight: 'calc(100vh - 120px)'
                }}
            // focusable
            >
                <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">Question</Text>
                    <BlockStack gap="300">
                        <Text variant="bodySm" as="h3">Question type</Text>
                        <div className="th-sf-question-type-display">
                            <Text variant="bodySm" fontWeight="medium">
                                {getQuestionTypeDisplayName(selectedQuestion.type)}
                            </Text>
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

                    {/* Date picker for date-type questions */}
                    {selectedQuestion.type === 'date' && (
                        <BlockStack gap="300">
                            <Text variant="bodySm" as="h3">Default date</Text>
                            <Popover
                                active={datePickerVisible}
                                activator={
                                    <TextField
                                        role="combobox"
                                        label="Select a date"
                                        prefix={<Icon source={CalendarIcon} />}
                                        value={selectedDate.toISOString().slice(0, 10)}
                                        onFocus={handleDatePickerOpen}
                                        onChange={() => { }} // Read-only for date picker
                                        autoComplete="off"
                                        readOnly
                                    />
                                }
                                onClose={handleDatePickerClose}
                                preferredAlignment="left"
                                fullWidth
                                preferInputActivator={false}
                                preferredPosition="below"
                            >
                                <Card ref={datePickerRef}>
                                    <DatePicker
                                        month={month}
                                        year={year}
                                        selected={selectedDate}
                                        onMonthChange={handleMonthChange}
                                        onChange={handleDateSelection}
                                    />
                                </Card>
                            </Popover>
                        </BlockStack>
                    )}

                    {/* Left and Right labels for satisfaction questions */}
                    {selectedQuestion.type === 'satisfaction' && (
                        <BlockStack gap="300">
                            <Text variant="bodySm" as="h3">Satisfaction scale labels</Text>
                            <InlineStack gap="300" className="th-sf-satisfaction-labels">
                                <div className="th-sf-satisfaction-label">
                                    <TextField
                                        label="Left label"
                                        value={selectedQuestion.leftLabel || 'Not satisfied'}
                                        onChange={(value) => updateQuestion(selectedQuestionId, { leftLabel: value })}
                                        autoComplete="off"
                                        placeholder="e.g., Not satisfied"
                                    />
                                </div>
                                <div className="th-sf-satisfaction-label">
                                    <TextField
                                        label="Right label"
                                        value={selectedQuestion.rightLabel || 'Very satisfied'}
                                        onChange={(value) => updateQuestion(selectedQuestionId, { rightLabel: value })}
                                        autoComplete="off"
                                        placeholder="e.g., Very satisfied"
                                    />
                                </div>
                            </InlineStack>
                        </BlockStack>
                    )}

                    {/* Left and Right labels for star rating questions */}
                    {selectedQuestion.type === 'rating' && (
                        <BlockStack gap="300">
                            <Text variant="bodySm" as="h3">Star rating labels</Text>
                            <InlineStack gap="300" className="th-sf-satisfaction-labels">
                                <div className="th-sf-satisfaction-label">
                                    <TextField
                                        label="Left label"
                                        value={selectedQuestion.leftLabel || 'Hate it'}
                                        onChange={(value) => updateQuestion(selectedQuestionId, { leftLabel: value })}
                                        autoComplete="off"
                                        placeholder="e.g., Hate it"
                                    />
                                </div>
                                <div className="th-sf-satisfaction-label">
                                    <TextField
                                        label="Right label"
                                        value={selectedQuestion.rightLabel || 'Love it'}
                                        onChange={(value) => updateQuestion(selectedQuestionId, { rightLabel: value })}
                                        autoComplete="off"
                                        placeholder="e.g., Love it"
                                    />
                                </div>
                            </InlineStack>
                        </BlockStack>
                    )}

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
                            <div className="th-sf-image-upload-area">
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
