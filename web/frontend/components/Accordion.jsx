import React from "react";
import { Box, BlockStack, InlineStack, Text, Button, Icon } from "@shopify/polaris";
import { AlertCircleIcon, StatusActiveIcon } from "@shopify/polaris-icons";

/**
 * Reusable single-open accordion component
 *
 * Props:
 * - items: Array<{
 *     id: string,
 *     title: string,
 *     description?: string,
 *     isComplete?: boolean,
 *     isLoading?: boolean,
 *     ctaLabel?: string,
 *     onPrimaryClick?: () => void,
 *     secondaryLabel?: string,
 *     onSecondaryClick?: () => void,
 *   }>
 * - activeId: string | null
 * - onChange: (id: string) => void
 */
export default function Accordion({ items, activeId, onChange }) {
    console.log(items);
    return (

        <BlockStack gap="300">
            {items.map((item, index) => {
                const { id, title, description, isComplete, isLoading } = item;
                const isActive = activeId === id;
                const isFirst = index === 0;

                return (
                    <Box
                        key={id}
                        background={isActive || isFirst ? "bg-surface-secondary" : undefined}
                        padding="400"
                        borderStartStartRadius="200"
                        borderStartEndRadius="200"
                        borderEndStartRadius="200"
                        borderEndEndRadius="200"
                    >
                        <InlineStack align="space-between" blockAlign="center">
                            {/* Header click target */}
                            <InlineStack
                                gap="300"
                                blockAlign="center"
                                onClick={() => onChange(id)}
                                role="button"
                                aria-expanded={isActive}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onChange(id);
                                    }
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <Icon
                                    source={isComplete ? StatusActiveIcon : AlertCircleIcon}
                                    tone={isComplete ? "success" : "subdued"}
                                />
                                <BlockStack gap="050">
                                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                                        {title}
                                    </Text>
                                    {description ? (
                                        <Text as="p" tone="subdued">
                                            {description}
                                        </Text>
                                    ) : null}
                                </BlockStack>
                            </InlineStack>

                            {/* Right side CTA(s) visible only when active */}
                            {isActive ? (
                                <InlineStack gap="200" blockAlign="center">
                                    {item.onPrimaryClick ? (
                                        <Button
                                            primary
                                            loading={Boolean(isLoading)}
                                            disabled={Boolean(isComplete)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                item.onPrimaryClick();
                                            }}
                                        >
                                            {item.ctaLabel ?? "Continue"}
                                        </Button>
                                    ) : null}
                                    {item.secondaryLabel && item.onSecondaryClick ? (
                                        <Button
                                            variant="plain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                item.onSecondaryClick();
                                            }}
                                        >
                                            {item.secondaryLabel}
                                        </Button>
                                    ) : null}
                                </InlineStack>
                            ) : null}
                        </InlineStack>
                    </Box>
                );
            })}
        </BlockStack>
    );
}


