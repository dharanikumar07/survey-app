import React from 'react';
import { Box, InlineStack, Text, Collapsible, Icon } from '@shopify/polaris';
import { ChevronDownIcon, ChevronUpIcon } from '@shopify/polaris-icons';

export default function SectionRow({
    title,
    icon,
    isExpanded,
    onToggle,
    children,
}) {
    return (
        <Box
            paddingBlockStart="300"
            paddingBlockEnd="300"
            paddingInlineStart="400"
            paddingInlineEnd="400"
            borderBlockEndWidth="0165"
            borderColor="border-disabled"
        >
            <InlineStack blockAlign="center" gap="200" wrap={false}>
                <Box onClick={onToggle} style={{ cursor: 'pointer', flex: 1 }}>
                    <InlineStack blockAlign="center" gap="300">
                        <Box>
                            <Icon source={isExpanded ? ChevronUpIcon : ChevronDownIcon} color="subdued" />
                        </Box>
                        {icon ? (
                            <Box>
                                <Icon source={icon} color="base" />
                            </Box>
                        ) : null}
                        <Text variant="bodyMd" fontWeight="medium">
                            {title}
                        </Text>
                    </InlineStack>
                </Box>
            </InlineStack>

            <Collapsible open={isExpanded} transition={{ duration: '200ms' }}>
                <Box paddingBlockStart="400" paddingInlineStart="600">
                    {children}
                </Box>
            </Collapsible>
        </Box>
    );
}
