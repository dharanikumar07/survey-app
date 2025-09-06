import React, { useMemo, useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import { validateQuestion, getQuestionTypeDisplayName } from '../../utils/surveyHelpers';

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

export function ContentTab({ surveyPreviewRef }) {
    const {
        questions,
        addQuestion,
        reorderQuestions,
        selectedQuestionId,
        setSelectedQuestionId,
        currentQuestionIndex
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

    // Sync selected question with iframe
    useEffect(() => {
        if (selectedQuestionId && surveyPreviewRef?.current) {
            // Find the index of the selected question
            const questionIndex = questions.findIndex(q => q.id === selectedQuestionId);

            if (questionIndex !== -1) {
                // Navigate the iframe to show the selected question
                surveyPreviewRef.current.setQuestionIndex(questionIndex);
            }
        }
    }, [selectedQuestionId, questions, surveyPreviewRef]);

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

    // Fixed to use the store's addQuestion method that uses templates
    const insertQuestionByType = (type) => {
        // Call the store's addQuestion with just the type
        // This will use our template system from JSON
        addQuestion(type);
        setAddPopoverActive(false);

        // Trigger refresh after successfully adding question
        setTimeout(() => {
            if (surveyPreviewRef?.current) {
                // Refresh the iframe
                surveyPreviewRef.current.refreshIframe();

                // The selectedQuestionId effect will handle navigation to the new question
                // after the iframe is refreshed, since addQuestion sets selectedQuestionId
            }
        }, 100); // Small delay to ensure state is updated
    };

    // This function is no longer needed since we use templates from JSON
    // but we'll keep it here as a reference for future use
    /*
    const getDefaultDescription = (type) => {
        // Description is now handled by templates in surveyData.json
        return '';
    };
    */

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
                                        { content: 'Short answer', onAction: () => insertQuestionByType('text') },
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
                background={(selectedQuestionId === item.id ||
                    (currentQuestionIndex !== undefined &&
                        questions[currentQuestionIndex]?.id === item.id)) ? "bg-fill" : "bg-fill-secondary"}
                borderRadius="200"
                shadow="xs"
                borderWidth={(selectedQuestionId === item.id ||
                    (currentQuestionIndex !== undefined &&
                        questions[currentQuestionIndex]?.id === item.id)) ? "025" : "0"}
                borderColor={(selectedQuestionId === item.id ||
                    (currentQuestionIndex !== undefined &&
                        questions[currentQuestionIndex]?.id === item.id)) ? "border" : "transparent"}
                style={{
                    backgroundColor: (selectedQuestionId === item.id ||
                        (currentQuestionIndex !== undefined &&
                            questions[currentQuestionIndex]?.id === item.id)) ? '#f6f6f7' : undefined,
                    transition: 'all 0.2s ease'
                }}
            >
                <div
                    className={`th-sf-question-row ${(currentQuestionIndex !== undefined &&
                        questions[currentQuestionIndex]?.id === item.id) ? 'active-slide' : ''}`}
                    draggable={isDraggable}
                    onDragStart={isDraggable ? handleDragStart(item.id) : undefined}
                    onDragOver={isDraggable ? handleDragOver : undefined}
                    onDrop={isDraggable ? handleDrop(item.id) : undefined}
                    onClick={() => handleSelectItem(item.id)}
                    style={{
                        cursor: 'pointer',
                        borderRadius: '6px',
                        padding: '4px',
                        transition: 'all 0.2s ease'
                    }}
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
                                fontWeight={(selectedQuestionId === item.id ||
                                    (currentQuestionIndex !== undefined &&
                                        questions[currentQuestionIndex]?.id === item.id)) ? "semibold" : "regular"}
                                color={(selectedQuestionId === item.id ||
                                    (currentQuestionIndex !== undefined &&
                                        questions[currentQuestionIndex]?.id === item.id)) ? "base" : "subdued"}
                                style={{
                                    color: (selectedQuestionId === item.id ||
                                        (currentQuestionIndex !== undefined &&
                                            questions[currentQuestionIndex]?.id === item.id)) ? '#202223' : undefined
                                }}
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

            <style>
                {`
                    .th-sf-question-row:hover {
                        background-color: #f8f9fa;
                        transform: translateY(-1px);
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    .th-sf-question-row:active {
                        transform: translateY(0);
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
                    }
                    
                    /* Enhanced highlighting for active slide */
                    .th-sf-question-row.active-slide {
                        background-color: #e1f5fe !important;
                        border-left: 4px solid #2196f3 !important;
                        animation: slideHighlight 0.5s ease-in-out;
                    }
                    
                    @keyframes slideHighlight {
                        0% { 
                            background-color: #f6f6f7;
                            border-left-width: 0px;
                        }
                        50% { 
                            background-color: #e3f2fd;
                            border-left-width: 6px;
                        }
                        100% { 
                            background-color: #e1f5fe;
                            border-left-width: 4px;
                        }
                    }
                    
                    /* Smooth transitions for all highlighting changes */
                    .th-sf-question-row,
                    .th-sf-question-row * {
                        transition: all 0.3s ease;
                    }
                `}
            </style>
        </BlockStack>
    );
}