import React, { useMemo, useRef, useState } from 'react';
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
            'single-choice': 'Single choice question',
            'multiple-choice': 'Multiple choice question',
            'number-scale': 'Please rate us on a number scale',
            'rating': 'Star rating question',
            'satisfaction': 'How satisfied are you?',
            'text': 'Short answer',
            'date': 'Pick a date',
        };

        const questionType = {
            'single-choice': 'Single choice',
            'multiple-choice': 'Multiple choice',
            'number-scale': 'Number scale',
            'rating': 'Star rating',
            'satisfaction': 'Satisfaction',
            'text': 'Short answer',
            'date': 'Date',
        };

        const nextId = `${Date.now()}`;
        const newItem = {
            id: nextId,
            content: templates[type] || 'New question',
            type: type === 'short' ? 'text' : type,
            description: '',
            questionType: questionType[type] || 'Custom',
            isDraggable: true
        };

        addQuestion(newItem);
        setAddPopoverActive(false);
        setSelectedQuestionId(nextId);
    };

    const handleSelectItem = (id) => {
        if (id !== 'add') {
            setSelectedQuestionId(id);
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
            >
                <div
                    style={{
                        userSelect: 'none',
                        cursor: isDraggable ? 'grab' : 'pointer',
                        maxWidth: '100%',
                    }}
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