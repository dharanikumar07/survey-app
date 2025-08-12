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

export function ContentTab({ items = [], onSelectItem = () => { } }) {
    const initialItems = useMemo(
        () =>
            items.length > 0
                ? [...items, { id: 'add', content: 'Add question', type: 'action' }]
                : [
                    { id: '1', content: 'How likely are you to recommend us to a friend?', type: 'rating' },
                    { id: '2', content: 'How easy was it to purchase from our online store?', type: 'rating' },
                    { id: '3', content: 'How could we improve?', type: 'text' },
                    { id: 'add', content: 'Add question', type: 'action' },
                    { id: '4', content: 'Thank You Card', type: 'card' },
                ],
        [items]
    );

    const [list, setList] = useState(initialItems);
    const [addPopoverActive, setAddPopoverActive] = useState(false);
    const dragIdRef = useRef(null);

    const moveItem = (fromId, toId) => {
        if (!fromId || !toId || fromId === toId) return;
        if (toId === 'add' || fromId === 'add') return; // no dragging of UI-only row
        const current = [...list];
        const fromIndex = current.findIndex((i) => i.id === fromId);
        const toIndex = current.findIndex((i) => i.id === toId);
        if (fromIndex < 0 || toIndex < 0) return;
        const [moved] = current.splice(fromIndex, 1);
        current.splice(toIndex, 0, moved);
        setList(current);
    };

    const handleDragStart = (id) => () => {
        dragIdRef.current = id;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (overId) => (e) => {
        e.preventDefault();
        moveItem(dragIdRef.current, overId);
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
        const nextId = `${Date.now()}`;
        const newItem = { id: nextId, content: templates[type] || 'New question', type: type === 'short' ? 'text' : type };
        const addIndex = list.findIndex((i) => i.id === 'add');
        const next = [...list];
        next.splice(addIndex, 0, newItem);
        setList(next);
        setAddPopoverActive(false);
    };

    const Row = ({ item }) => {
        const isAction = item.type === 'action';
        const iconSource = isAction ? PlusIcon : getTypeIcon(item.type);

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
                // borderColor="border"
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
                background="bg-fill-secondary"
                // borderWidth="025"
                // borderColor="border-subdued"
                borderRadius="200"
                shadow="xs"
            >
                <div
                    style={{
                        userSelect: 'none',
                        cursor: 'grab',
                        maxWidth: '100%',
                    }}
                    draggable
                    onDragStart={handleDragStart(item.id)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop(item.id)}
                    onClick={() => onSelectItem(item.id)}
                >
                    <InlineStack
                        gap="150"
                        blockAlign="center"
                        align="start"
                        wrap={false}
                    >
                        {/* <Box paddingInlineEnd="100">
                            <Icon source={DragHandleIcon} color="subdued" />
                        </Box> */}
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
                    {list.map((item) => (
                        <Row key={item.id} item={item} />
                    ))}
                </BlockStack>
            </Box>
        </BlockStack>
    );
}
