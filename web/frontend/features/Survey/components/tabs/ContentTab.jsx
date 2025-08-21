import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Box, BlockStack, Text, InlineStack, Icon, Button, Popover, ActionList } from '@shopify/polaris';
import {
    DragHandleIcon,
    StarFilledIcon,
    TextAlignLeftIcon,
    IdentityCardIcon,
    PlusIcon,
    EditIcon,
    DuplicateIcon,
    DeleteIcon,
    CalendarIcon,
    ListNumberedIcon
} from '@shopify/polaris-icons';
import { useSurveyState } from '../../hooks/useSurveyState';

function getTypeIcon(type) {
    switch (type) {
        case 'rating':
            return StarFilledIcon;
        case 'text':
            return TextAlignLeftIcon;
        case 'card':
            return IdentityCardIcon;
        case 'number-scale':
            return ListNumberedIcon;
        case 'date':
            return CalendarIcon;
        default:
            return EditIcon;
    }
}

export function ContentTab() {
    const {
        questions,
        addQuestion,
        reorderQuestions,
        selectedQuestionId,
        setSelectedQuestionId
    } = useSurveyState();

    const [addPopoverActive, setAddPopoverActive] = useState(false);
    const dragIdRef = useRef(null);

    // Auto-select first question if none is selected
    useEffect(() => {
        if (questions.length > 0 && !selectedQuestionId) {
            const firstQuestion = questions.find(q => q.id !== 'thankyou');
            if (firstQuestion) {
                console.log('ContentTab: Auto-selecting first question:', firstQuestion.id);
                setSelectedQuestionId(firstQuestion.id);
            }
        }
    }, [questions, selectedQuestionId, setSelectedQuestionId]);

    // Create display list with "Add question" item inserted before the thank you card
    const displayList = useMemo(() => {
        const newList = [...questions];
        // Insert "Add question" item before the thank you card
        const insertIndex = newList.findIndex(q => q.id === 'thankyou');
        if (insertIndex !== -1) {
            newList.splice(insertIndex, 0, { id: 'add', content: 'Add question', type: 'action' });
        } else {
            // If thank you card doesn't exist, add it at the end
            newList.push({ id: 'add', content: 'Add question', type: 'action' });
        }
        return newList;
    }, [questions]);

    const handleDragStart = (id) => () => {
        const item = questions.find(q => q.id === id);
        if (item && item.isDraggable !== false) {
            dragIdRef.current = id;
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (overId) => (e) => {
        e.preventDefault();
        if (!dragIdRef.current || !overId || dragIdRef.current === overId) return;
        if (overId === 'add') return; // Don't allow dropping onto "Add question"

        // Find the item being dropped onto
        const overItem = questions.find(q => q.id === overId);

        // If dropping onto a non-draggable item or it's the thank you card, don't allow it
        if (overItem && (overItem.isDraggable === false || overId === 'thankyou')) return;

        reorderQuestions(dragIdRef.current, overId);
        dragIdRef.current = null;
    };

    const toggleAddPopover = () => setAddPopoverActive((v) => !v);

    const insertQuestionByType = (type) => {
        const templates = {
            'single-choice': 'How did you hear about us?',
            'multiple-choice': 'Which of our products have you used?',
            'number-scale': 'How would you rate our customer service?',
            'rating': 'How likely are you to recommend us to a friend?',
            'satisfaction': 'How satisfied are you with your recent purchase?',
            'text': 'What could we do to improve our service?',
            'date': 'When did you first visit our website?',
            'matrix': 'Rate our services across different aspects',
            'ranking': 'Rank these features by importance',
            'demographic': 'What is your age group?',
        };

        // Additional templates for common survey scenarios
        const getEnhancedTemplate = (type) => {
            const enhancedTemplates = {
                'single-choice': 'How did you hear about us?',
                'multiple-choice': 'Which of our products have you used?',
                'number-scale': 'How would you rate our customer service?',
                'rating': 'How likely are you to recommend us to a friend?',
                'satisfaction': 'How satisfied are you with your recent purchase?',
                'text': 'What could we do to improve our service?',
                'date': 'When did you first visit our website?',
                'matrix': 'Rate our services across different aspects',
                'ranking': 'Rank these features by importance',
                'demographic': 'What is your age group?',
            };
            return enhancedTemplates[type] || 'New question';
        };

        const questionType = {
            'single-choice': 'Single choice',
            'multiple-choice': 'Multiple choice',
            'number-scale': 'Number scale',
            'rating': 'Star rating',
            'satisfaction': 'Satisfaction',
            'text': 'Short answer',
            'date': 'Date',
            'matrix': 'Matrix',
            'ranking': 'Ranking',
            'demographic': 'Demographic',
        };

        // Default answer options for each question type based on web best practices
        const getDefaultOptions = (type) => {
            switch (type) {
                case 'single-choice':
                    return [
                        { id: `${Date.now()}_1`, text: 'Word of mouth' },
                        { id: `${Date.now()}_2`, text: 'Social media' },
                        { id: `${Date.now()}_3`, text: 'Search engine' },
                        { id: `${Date.now()}_4`, text: 'Advertisement' },
                        { id: `${Date.now()}_5`, text: 'Other' }
                    ];
                case 'multiple-choice':
                    return [
                        { id: `${Date.now()}_1`, text: 'Product A' },
                        { id: `${Date.now()}_2`, text: 'Product B' },
                        { id: `${Date.now()}_3`, text: 'Product C' },
                        { id: `${Date.now()}_4`, text: 'Service X' },
                        { id: `${Date.now()}_5`, text: 'Service Y' }
                    ];
                case 'number-scale':
                    return [
                        { id: `${Date.now()}_1`, text: '1 - Poor' },
                        { id: `${Date.now()}_2`, text: '2 - Fair' },
                        { id: `${Date.now()}_3`, text: '3 - Good' },
                        { id: `${Date.now()}_4`, text: '4 - Very Good' },
                        { id: `${Date.now()}_5`, text: '5 - Excellent' }
                    ];
                case 'rating':
                    return [
                        { id: `${Date.now()}_1`, text: '1 - Not likely' },
                        { id: `${Date.now()}_2`, text: '2 - Somewhat likely' },
                        { id: `${Date.now()}_3`, text: '3 - Likely' },
                        { id: `${Date.now()}_4`, text: '4 - Very likely' },
                        { id: `${Date.now()}_5`, text: '5 - Extremely likely' }
                    ];
                case 'satisfaction':
                    return [
                        { id: `${Date.now()}_1`, text: 'Very Dissatisfied' },
                        { id: `${Date.now()}_2`, text: 'Dissatisfied' },
                        { id: `${Date.now()}_3`, text: 'Neutral' },
                        { id: `${Date.now()}_4`, text: 'Satisfied' },
                        { id: `${Date.now()}_5`, text: 'Very Satisfied' }
                    ];
                case 'matrix':
                    return [
                        { id: `${Date.now()}_1`, text: 'Product Quality' },
                        { id: `${Date.now()}_2`, text: 'Customer Service' },
                        { id: `${Date.now()}_3`, text: 'Value for Money' },
                        { id: `${Date.now()}_4`, text: 'Ease of Use' },
                        { id: `${Date.now()}_5`, text: 'Overall Experience' }
                    ];
                case 'ranking':
                    return [
                        { id: `${Date.now()}_1`, text: 'Price' },
                        { id: `${Date.now()}_2`, text: 'Quality' },
                        { id: `${Date.now()}_3`, text: 'Customer Service' },
                        { id: `${Date.now()}_4`, text: 'Brand Reputation' },
                        { id: `${Date.now()}_5`, text: 'Innovation' }
                    ];
                case 'demographic':
                    return [
                        { id: `${Date.now()}_1`, text: '18-24 years' },
                        { id: `${Date.now()}_2`, text: '25-34 years' },
                        { id: `${Date.now()}_3`, text: '35-44 years' },
                        { id: `${Date.now()}_4`, text: '45-54 years' },
                        { id: `${Date.now()}_5`, text: '55+ years' }
                    ];
                case 'text':
                case 'date':
                    return []; // No answer options for text/date questions
                default:
                    return [
                        { id: `${Date.now()}_1`, text: 'Option 1' },
                        { id: `${Date.now()}_2`, text: 'Option 2' }
                    ];
            }
        };

        const nextId = `${Date.now()}`;
        const newItem = {
            id: nextId,
            content: getEnhancedTemplate(type),
            type: type === 'short' ? 'text' : type,
            description: getDefaultDescription(type),
            questionType: questionType[type] || 'Custom',
            isDraggable: true,
            answerOptions: getDefaultOptions(type)
        };

        addQuestion(newItem);
        setAddPopoverActive(false);
        setSelectedQuestionId(nextId);
    };

    // Get default description based on question type
    const getDefaultDescription = (type) => {
        switch (type) {
            case 'single-choice':
                return 'Select the option that best describes your answer.';
            case 'multiple-choice':
                return 'Select all options that apply to you.';
            case 'number-scale':
                return 'Rate your experience on a scale from 1 (Poor) to 5 (Excellent).';
            case 'rating':
                return 'Rate your likelihood on a scale from 1 (Not likely) to 5 (Extremely likely).';
            case 'satisfaction':
                return 'Please indicate your level of satisfaction with our service.';
            case 'text':
                return 'Please provide your feedback in detail.';
            case 'date':
                return 'Please select the date from the calendar.';
            case 'matrix':
                return 'Rate each aspect on a scale from 1 (Poor) to 5 (Excellent).';
            case 'ranking':
                return 'Drag and drop to rank these items in order of importance to you.';
            case 'demographic':
                return 'This information helps us better understand our customer base.';
            default:
                return 'Please provide your response.';
        }
    };

    const handleSelectItem = (id) => {
        if (id !== 'add') {
            console.log('ContentTab: Selecting question with ID:', id);
            console.log('ContentTab: Current selectedQuestionId:', selectedQuestionId);
            setSelectedQuestionId(id);
            console.log('ContentTab: setSelectedQuestionId called with:', id);
        }
    };

    const Row = ({ item }) => {
        const isAction = item.type === 'action';
        const iconSource = isAction ? PlusIcon : getTypeIcon(item.type);
        const isDraggable = item.isDraggable !== false && !isAction;

        if (isAction) {
            // Non-draggable Add question row with popover
            return (
                <Box
                    key={item.id}
                    padding="200"
                    background="bg-surface-secondary"
                    borderRadius="200"
                    borderStyle="dashed"
                    borderWidth="025"
                >
                    <InlineStack
                        gap="150"
                        blockAlign="center"
                        align="start"
                        wrap={false}
                    >
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <Popover
                                active={addPopoverActive}
                                activator={
                                    <Button variant='plain' onClick={toggleAddPopover} icon={PlusIcon} iconPosition="end">
                                        Add question
                                    </Button>
                                }
                                onClose={() => setAddPopoverActive(false)}
                                preferredAlignment="left"
                            >
                                <ActionList
                                    actionRole="menuitem"
                                    items={[
                                        { content: 'Single choice', onAction: () => insertQuestionByType('single-choice') },
                                        { content: 'Multiple choice', onAction: () => insertQuestionByType('multiple-choice') },
                                        { content: 'Number scale', onAction: () => insertQuestionByType('number-scale') },
                                        { content: 'Star rating', onAction: () => insertQuestionByType('rating') },
                                        { content: 'Satisfaction', onAction: () => insertQuestionByType('satisfaction') },
                                        { content: 'Matrix', onAction: () => insertQuestionByType('matrix') },
                                        { content: 'Ranking', onAction: () => insertQuestionByType('ranking') },
                                        { content: 'Demographic', onAction: () => insertQuestionByType('demographic') },
                                        { content: 'Short answer', onAction: () => insertQuestionByType('text') },
                                        { content: 'Date', onAction: () => insertQuestionByType('date') },
                                    ]}
                                />
                            </Popover>
                        </div>
                    </InlineStack>
                </Box>
            );
        }

        return (
            <Box
                key={item.id}
                padding="200"
                background={selectedQuestionId === item.id ? "bg-fill" : "bg-fill-secondary"}
                borderRadius="200"
                shadow="xs"
                borderWidth={selectedQuestionId === item.id ? "025" : "0"}
                borderColor={selectedQuestionId === item.id ? "border" : "transparent"}
            >
                <div
                    className="th-sf-question-row"
                    draggable={isDraggable}
                    onDragStart={isDraggable ? handleDragStart(item.id) : undefined}
                    onDragOver={isDraggable ? handleDragOver : undefined}
                    onDrop={isDraggable ? handleDrop(item.id) : undefined}
                    onClick={() => handleSelectItem(item.id)}
                >
                    <InlineStack
                        gap="150"
                        blockAlign="center"
                        align="start"
                        wrap={false}
                    >
                        <Icon source={iconSource} color="subdued" />
                        <div style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                            <Text
                                as="span"
                                variant="bodySm"
                                fontWeight={selectedQuestionId === item.id ? "semibold" : "regular"}
                                color={selectedQuestionId === item.id ? "base" : "subdued"}
                            >
                                {item.content}
                            </Text>
                        </div>
                    </InlineStack>
                </div>
            </Box>
        );
    };

    return (
        <BlockStack gap="300">
            <Box padding="200" background="bg-surface" borderRadius="300">
                <BlockStack gap="200">
                    {displayList.map((item) => (
                        <Row key={item.id} item={item} />
                    ))}
                </BlockStack>
            </Box>
        </BlockStack>
    );
}