import React from 'react';
import {
    Box,
    InlineStack,
    Text,
    Collapsible,
    Icon
} from '@shopify/polaris';
import Knob from '../features/Survey/components/common/Knob';
import { ChannelConfigRenderer } from '../features/Survey/components/ChannelConfigMapping';
import {
    PageAddIcon,
    StoreFilledIcon,
    CheckIcon,
    EmailIcon,
    ExitIcon,
    CodeIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@shopify/polaris-icons';

export default function SurveyAccordion({ item, onToggleExpand, onToggleEnabled }) {
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'document':
                return PageAddIcon;
            case 'store':
                return StoreFilledIcon;
            case 'checkmark':
                return CheckIcon;
            case 'email':
                return EmailIcon;
            case 'exit':
                return ExitIcon;
            case 'code':
                return CodeIcon;
            default:
                return PageAddIcon;
        }
    };

    return (
        <Box
            paddingBlockStart="300"
            paddingBlockEnd="300"
            paddingInlineStart="400"
            paddingInlineEnd="400"
            // borderBlockEndWidth="1"
            // borderColor="border-subdued"
            borderBlockEndWidth="0165"
            borderColor="border-disabled"
        >
            <InlineStack blockAlign="center" gap="800" wrap={false}>
                <Box
                    onClick={() => onToggleExpand(item.id)}
                    className={`th-sf-accordion-header `}
                    style={{
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s ease',
                        // backgroundColor: item.isExpanded ? '#f0f8ff' : 'transparent'
                    }}
                >
                    <InlineStack blockAlign="center" gap="300">
                        <Box>
                            <Icon
                                source={item.isExpanded ? ChevronUpIcon : ChevronDownIcon}
                                color={item.isExpanded ? "info" : "subdued"}
                            />
                        </Box>
                        <Box>
                            <Icon source={getIcon(item.icon)} color={item.isExpanded ? "info" : "base"} />
                        </Box>
                        <Text
                            variant="bodyMd"
                            fontWeight={item.isExpanded ? "semibold" : "medium"}
                            color={item.isExpanded ? "info" : "base"}
                        >
                            {item.title}
                        </Text>
                    </InlineStack>
                </Box>
                <Box>
                    <Knob
                        selected={item.isEnabled}
                        onClick={() => onToggleEnabled(item.id)}
                        ariaLabel={`Toggle ${item.title}`}
                    />
                </Box>
            </InlineStack>

            {/* Configuration options text - always visible for onsite survey */}
            {/* {item.id === 'onsite' && (
                <Box paddingBlockStart="200" paddingInlineStart="600">
                    <Text variant="bodyMd" color="info" fontWeight="medium">
                        Configuration options for {item.title}
                    </Text>
                </Box>
            )} */}

            <Collapsible
                id={`content-${item.id}`}
                open={item.isExpanded}
                transition={{ duration: '200ms' }}
            >
                <Box paddingBlockStart="400">
                    <ChannelConfigRenderer item={item} />
                </Box>
            </Collapsible>
        </Box>
    );
}
