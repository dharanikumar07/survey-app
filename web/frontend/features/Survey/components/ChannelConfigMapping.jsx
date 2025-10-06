import React from 'react';
import { OnsiteSurveyConfig } from './OnsiteSurveyConfig';
import { ThankYouConfig } from './ThankYouConfig';
import { BrandedSurveyConfig } from './BrandedSurveyConfig';
import { BrandedSurveyLinkConfig } from './BrandedSurveyLinkConfig';

// Component mapping for different channel types
export const CHANNEL_CONFIG_COMPONENTS = {
    onsite: OnsiteSurveyConfig,
    thankyou: ThankYouConfig,
    branded: BrandedSurveyLinkConfig,
    // Add more channel types here as needed
    // exit: ExitIntentConfig,
    // embed: EmbedConfig,
};

// Default component for unknown channel types
const DefaultConfig = ({ item }) => (
    <div
        className="th-sf-default-config-container"
        style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '16px',
            border: '1px solid #e1e3e5',
            borderRadius: '8px',
            backgroundColor: '#fafafa'
        }}
    >
        <p>Configuration options for {item.title}</p>
    </div>
);

// Main component that renders the appropriate config based on channel type
export function ChannelConfigRenderer({ item }) {
    const ConfigComponent = CHANNEL_CONFIG_COMPONENTS[item.id] || DefaultConfig;

    return <ConfigComponent item={item} />;
}

// Helper function to get available channel types
export const getAvailableChannelTypes = () => Object.keys(CHANNEL_CONFIG_COMPONENTS);

// Helper function to check if a channel type has a specific config
export const hasChannelConfig = (channelId) => {
    return channelId in CHANNEL_CONFIG_COMPONENTS;
};