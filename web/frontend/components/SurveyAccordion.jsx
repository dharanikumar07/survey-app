import React from 'react';
import { Box, InlineStack, Text, Collapsible, Icon, Divider } from '@shopify/polaris';
import CustomToggle from '../features/Survey/components/common/CustomToggle';
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
            <InlineStack blockAlign="center" gap="200" wrap={false}>
                <Box onClick={() => onToggleExpand(item.id)} className="th-sf-accordion-header">
                    <InlineStack blockAlign="center" gap="300">
                        <Box>
                            <Icon
                                source={item.isExpanded ? ChevronUpIcon : ChevronDownIcon}
                                color="subdued"
                            />
                        </Box>
                        <Box>
                            <Icon source={getIcon(item.icon)} color="base" />
                        </Box>
                        <Text variant="bodyMd" fontWeight="medium">
                            {item.title}
                        </Text>
                    </InlineStack>
                </Box>
                <Box>
                    <CustomToggle
                        checked={item.isEnabled}
                        onChange={() => onToggleEnabled(item.id)}
                    />
                </Box>
                {/* <Divider /> */}
            </InlineStack>

            <Collapsible
                id={`content-${item.id}`}
                open={item.isExpanded}
                transition={{ duration: '200ms' }}
            >
                <Box paddingBlockStart="400" paddingInlineStart="600">
                    <Text variant="bodyMd">Configuration options for {item.title}</Text>
                </Box>
            </Collapsible>
        </Box>
    );
}
