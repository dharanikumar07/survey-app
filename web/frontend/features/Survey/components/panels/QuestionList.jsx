import React from 'react';
import { Box, Text, BlockStack, InlineStack, Button, Divider, Modal, TextField, Scrollable } from '@shopify/polaris';
import { EditIcon } from '@shopify/polaris-icons';
import TabsContent from '../common/TabsContent';
import { useSurveyState } from '../../hooks/useSurveyState';

function QuestionList({ surveyPreviewRef }) {
    const {
        editModalOpen,
        setEditModalOpen,
        surveyTitle,
        setSurveyTitle
    } = useSurveyState();

    const handleSave = () => {
        setEditModalOpen(false);
    };

    return (
        <Box
            background="bg-surface"
            borderInlineEndWidth="1"
            borderColor="border"
            padding="400"
            height="100%"
            overflow="hidden"
        >
            <Scrollable
                horizontal={false}
                style={{
                    height: 'calc(100vh - 120px)',
                    maxHeight: 'calc(100vh - 120px)'
                }}
            // focusable
            >
                <BlockStack gap="400" paddingBlockEnd="400" paddingInlineStart="200" paddingInlineEnd="200">
                    {/* Header Section */}
                    <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingLg" as="h2">{surveyTitle}</Text>
                        <Button size="slim" variant="plain" icon={EditIcon} accessibilityLabel="Edit survey" onClick={() => setEditModalOpen(true)} />
                    </InlineStack>
                    <Divider />
                    {/* Tabs Section */}
                    <TabsContent surveyPreviewRef={surveyPreviewRef} />
                </BlockStack>
            </Scrollable>

            {/* Edit Survey Modal (Polaris) */}
            <Modal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit survey"
                primaryAction={{ content: 'Save', onAction: handleSave }}
                secondaryActions={[{ content: 'Cancel', onAction: () => setEditModalOpen(false) }]}
            >
                <Box padding="400">
                    <BlockStack gap="300">
                        <TextField label="Survey title" value={surveyTitle} onChange={setSurveyTitle} autoComplete="off" />
                    </BlockStack>
                </Box>
            </Modal>
        </Box>
    );
}

export default QuestionList;
