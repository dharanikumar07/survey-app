import React from 'react';
import { Box, Tabs } from '@shopify/polaris';
import useStore from '../../../State/store';

function TabsContent() {
    const { selectedTab, setSelectedTab } = useStore();

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

    const handleTabChange = (selectedTabIndex) => {
        setSelectedTab(selectedTabIndex);
    };

    return (
        <Box>
            <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
            <Box padding="400">
                {selectedTab === 0 && (
                    <div>
                        <p style={{ color: '#666' }}>Content tab placeholder - Survey form content will go here</p>
                    </div>
                )}
                {selectedTab === 1 && (
                    <div>
                        <p style={{ color: '#666' }}>Channel tab placeholder - Channel settings will go here</p>
                    </div>
                )}
                {selectedTab === 2 && (
                    <div>
                        <p style={{ color: '#666' }}>Discount tab placeholder - Discount settings will go here</p>
                    </div>
                )}
            </Box>
        </Box>
    );
}

export default TabsContent;