import React, { useState, useCallback } from 'react';
import {
    Box,
    Text,
    BlockStack,
    InlineStack,
    Button,
    Divider,
    Tabs,
    Modal,
    TextField
} from '@shopify/polaris';
import { EditIcon } from '@shopify/polaris-icons';
import { ContentTab } from './tabs/ContentTab';
import { ChannelTab } from './tabs/ChannelTab';
import { DiscountTab } from './tabs/DiscountTab';

function Sidebar({ items = [], onSelectItem = () => { } }) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [editOpen, setEditOpen] = useState(false);
    const [surveyTitle, setSurveyTitle] = useState('Survey #1');

    const handleTabChange = useCallback((selectedTabIndex) => {
        setSelectedTab(selectedTabIndex);
    }, []);

    const tabs = [
        {
            id: 'content',
            content: 'Content',
            accessibilityLabel: 'Content tab',
            panelID: 'content-panel',
        },
        {
            id: 'channel',
            content: 'Channel',
            accessibilityLabel: 'Channel tab',
            panelID: 'channel-panel',
        },
        {
            id: 'discount',
            content: 'Discount',
            accessibilityLabel: 'Discount tab',
            panelID: 'discount-panel',
        },
    ];

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <ContentTab items={items} onSelectItem={onSelectItem} />;
            case 1:
                return <ChannelTab />;
            case 2:
                return <DiscountTab />;
            default:
                return <ContentTab items={items} onSelectItem={onSelectItem} />;
        }
    };

    const handleSave = () => {
        setEditOpen(false);
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
                    <Button size="slim" variant="plain" icon={EditIcon} accessibilityLabel="Edit survey" onClick={() => setEditOpen(true)} />
                </InlineStack>
                <Divider />
                {/* Tabs Section */}
                <div style={{ width: '100%', minWidth: 0 }}>
                    <Tabs
                        fitted
                        tabs={tabs}
                        selected={selectedTab}
                        onSelect={handleTabChange}
                        disclosureText=""
                    >
                        <Box paddingBlockStart="400">
                            <Divider />
                            {renderTabContent()}
                        </Box>
                    </Tabs>
                </div>
            </BlockStack>

            {/* Edit Survey Modal (Polaris) */}
            <Modal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                title="Edit survey"
                primaryAction={{ content: 'Save', onAction: handleSave }}
                secondaryActions={[{ content: 'Cancel', onAction: () => setEditOpen(false) }]}
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

export default Sidebar;