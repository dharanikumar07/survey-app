import React from 'react';
import { Box, BlockStack, Text, InlineStack, Button, ButtonGroup, Divider, Modal, TextField } from '@shopify/polaris';
import { EditIcon } from '@shopify/polaris-icons';
import { ContentTab } from '../tabs/ContentTab';
import { ChannelTab } from '../tabs/ChannelTab';
import { DiscountTab } from '../tabs/DiscountTab';
import useStore from '../../../../State/store';

function QuestionList() {
    const {
        selectedTab,
        setSelectedTab,
        editModalOpen,
        setEditModalOpen,
        surveyTitle,
        setSurveyTitle
    } = useStore();

    const handleTabChange = (selectedTabIndex) => {
        setSelectedTab(selectedTabIndex);
    };

    const handleSave = () => {
        setEditModalOpen(false);
    };

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <ContentTab />;
            case 1:
                return <ChannelTab />;
            case 2:
                return <DiscountTab />;
            default:
                return <ContentTab />;
        }
    };

    return (
        <Box
            background="bg-surface"
            borderInlineEndWidth="1"
            borderColor="border"
            padding="400"
            minHeight="calc(100vh - 100px)"
            overflow="auto"
        >
            <BlockStack gap="400">
                {/* Header Section */}
                <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingLg" as="h2">{surveyTitle}</Text>
                    <Button size="slim" variant="plain" icon={EditIcon} accessibilityLabel="Edit survey" onClick={() => setEditModalOpen(true)} />
                </InlineStack>
                <Divider />
                {/* Tabs Section */}
                <Box>
                    <ButtonGroup variant="segmented" fullWidth>
                        <Button
                            pressed={selectedTab === 0}
                            onClick={() => handleTabChange(0)}
                            variant='tertiary'
                        >
                            Content
                        </Button>
                        <Button
                            pressed={selectedTab === 1}
                            onClick={() => handleTabChange(1)}
                            variant='tertiary'
                        >
                            Channel
                        </Button>
                        <Button
                            pressed={selectedTab === 2}
                            onClick={() => handleTabChange(2)}
                            variant='tertiary'
                        >
                            Discount
                        </Button>
                    </ButtonGroup>
                    <Box paddingBlockStart="400">
                        <Divider />
                        {renderTabContent()}
                    </Box>
                </Box>
            </BlockStack>

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
