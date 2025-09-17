import React, { useCallback, useMemo, useState, useEffect } from "react";
import { 
    Card, 
    Text, 
    ProgressBar, 
    BlockStack, 
    Box, 
    InlineStack, 
    Button, 
    ButtonGroup,
    Collapsible,
    Banner,
    Icon
} from "@shopify/polaris";
import { ChevronUpIcon, ExternalIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";
import { useExtensionStatus } from "../hooks/useExtensionStatus";
import "./QuickStart.css";

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Custom checkbox icon component
const CheckboxIcon = ({ isComplete, isLoading }) => {
    if (isLoading) {
        return (
            <div className="QuickStartTask__CheckboxIcon">
                <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '2px solid #8C9196', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#8C9196',
                        borderRadius: '50%',
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                </div>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="QuickStartTask__CheckboxIcon">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10.5" cy="10" r="10" fill="#040404"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.2831 5.96934C16.4235 6.10997 16.5024 6.30059 16.5024 6.49934C16.5024 6.69809 16.4235 6.88871 16.2831 7.02934L9.78308 13.5293C9.64246 13.6698 9.45183 13.7487 9.25308 13.7487C9.05433 13.7487 8.86371 13.6698 8.72308 13.5293L5.47308 10.2793C5.3994 10.2107 5.34029 10.1279 5.2993 10.0359C5.25831 9.94388 5.23627 9.84456 5.23449 9.74386C5.23271 9.64316 5.25124 9.54313 5.28896 9.44974C5.32668 9.35635 5.38283 9.27152 5.45404 9.2003C5.52526 9.12908 5.6101 9.07294 5.70349 9.03522C5.79687 8.9975 5.8969 8.97897 5.99761 8.98075C6.09831 8.98252 6.19762 9.00457 6.28962 9.04556C6.38162 9.08655 6.46442 9.14565 6.53308 9.21934L9.25308 11.9393L15.2231 5.96934C15.3637 5.82889 15.5543 5.75 15.7531 5.75C15.9518 5.75 16.1425 5.82889 16.2831 5.96934Z" fill="white"/>
                </svg>
            </div>
        );
    }

    return (
        <div className="QuickStartTask__CheckboxIcon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="QuickStartIcon__CircleNotCheck">
                <rect x="1" y="1.27246" width="18" height="18" rx="8" fill="white" stroke="#8C9196" strokeWidth="2" strokeDasharray="4 4" className="QuickStartIcon__CircleNotCheck--path"/>
                <circle cx="10" cy="10" r="9" fill="#F6F6F7" stroke="#999EA4" strokeWidth="2" strokeDasharray="4 4" className="QuickStartIcon__CircleNotCheck--circle"/>
            </svg>
        </div>
    );
};

export default function Quickstart() {
    const navigate = useNavigate();
    const { 
        status, 
        loading: extensionLoading, 
        error: extensionError,
        checkStatus, 
        activateExtension,
        isExtensionEnabled 
    } = useExtensionStatus();

    const [statusByStep, setStatusByStep] = useState({
        activate: "idle",
        create: "idle",
        visualize: "idle",
    });

    const [isCollapsed, setIsCollapsed] = useState(false);

    const steps = useMemo(
        () => [
            {
                id: "activate",
                title: "Activate app",
                description: "Enable our app to see it visible on your store.",
                cta: "Activate",
            },
            {
                id: "create",
                title: "Create your first survey",
                description: "Set up your survey with various templates.",
                cta: "Create new survey",
            },
            {
                id: "visualize",
                title: "Visualize how it appears",
                description: "If you published a survey which is a widget, you could visualize it on your store now.",
                cta: "Activate survey",
                secondaryCta: "View on store",
                showWarning: true,
            },
        ],
        [],
    );

    const [activeStepId, setActiveStepId] = useState("create");

    // Check extension status on component mount
    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    // Removed the effect that updates the activate step based on extension status
    // The first step is now always complete regardless of API response

    const completedCount = useMemo(
        () => Object.values(statusByStep).filter((s) => s === "complete").length,
        [statusByStep],
    );

    const progress = Math.round((completedCount / steps.length) * 100);

    const runStep = useCallback(async (id) => {
        if (id === "activate") {
            // For activate step, open the deeplink
            activateExtension();
            return;
        }

        if (id === "create") {
            // Navigate to survey templates page
            navigate('/survey/templates');
            return;
        }

        setStatusByStep((prev) => ({ ...prev, [id]: "loading" }));
        // Fake API call: simulate axios request latency
        await wait(2000);
        setStatusByStep((prev) => {
            const updated = { ...prev, [id]: "complete" };
            // After completion, move to the next incomplete step
            const currentIndex = steps.findIndex((s) => s.id === id);
            const next = steps.slice(currentIndex + 1).find((s) => updated[s.id] !== "complete");
            setActiveStepId(next ? next.id : null);
            return updated;
        });
    }, [activateExtension, steps]);

    const refreshStep = useCallback(async (id) => {
        if (id === "activate") {
            try {
                await checkStatus(true); // Force refresh
            } catch (error) {
                // Error is handled by the hook
            }
        } else {
        // Fake recheck; keep it simple and instant for UX
        setStatusByStep((prev) => ({ ...prev }));
        }
    }, [checkStatus]);

    return (
        <Card>
            <BlockStack gap="0">
                {/* Header */}
                <Box padding="400">
                    <InlineStack align="space-between" blockAlign="center">
                <Text as="h3" variant="headingSm">
                    Quickstart
                </Text>
                        <Button
                            variant="plain"
                            icon={ChevronUpIcon}
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            accessibilityLabel={isCollapsed ? "Expand" : "Collapse"}
                        />
                    </InlineStack>
                </Box>

                {/* Divider */}
                <Box>
                    <hr style={{ 
                        border: 'none', 
                        borderTop: '1px solid var(--p-color-border-secondary)',
                        margin: 0 
                    }} />
                </Box>

                {/* Progress Section */}
                <Box padding="400">
                    <InlineStack gap="300" blockAlign="center">
                        <Text variant="bodySm" tone="subdued">
                        {completedCount} of {steps.length} tasks completed
                    </Text>
                        <ProgressBar 
                            progress={progress} 
                            size="small" 
                            tone={progress === 100 ? "success" : "primary"}
                        />
                    </InlineStack>
                </Box>

                {/* Collapsible Content */}
                <Collapsible
                    open={!isCollapsed}
                    id="QuickStart__Collapsible"
                    transition={{ duration: '200ms', timingFunction: 'ease-in-out' }}
                >
                    <Box paddingBlockEnd="200" paddingInlineStart="200" paddingInlineEnd="200">
                        <BlockStack gap="200">
                            {steps.map((step, index) => {
                                const isActive = activeStepId === step.id;
                                const isComplete = statusByStep[step.id] === "complete";
                                const isLoading = statusByStep[step.id] === "loading";

                                return (
                                    <BlockStack key={step.id} gap="200">
                                        <div 
                                            className={`QuickStartTask ${isActive ? 'QuickStartTask__Selected' : ''}`}
                                            onClick={() => setActiveStepId(isActive ? null : step.id)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setActiveStepId(isActive ? null : step.id);
                                                }
                                            }}
                                        >
                                            <div className="QuickStartTask__Checkbox">
                                                <CheckboxIcon isComplete={isComplete} isLoading={isLoading} />
                                            </div>
                                            <div className="QuickStartTask__Container">
                                                <div className="QuickStartTask__ContainerBody">
                                                    <BlockStack gap="200">
                                                        <Text 
                                                            variant="bodyMd" 
                                                            fontWeight={isActive ? "medium" : "regular"}
                                                        >
                                                            {step.title}
                                                        </Text>
                                                        
                                                        <Collapsible
                                                            open={isActive}
                                                            id="QuickStart-Collapsible__Task"
                                                            transition={{ duration: '200ms', timingFunction: 'ease-in-out' }}
                                                        >
                                                            <BlockStack gap="200">
                                                                <Text variant="bodyMd">
                                                                    {step.description}
                                                                </Text>
                                                                
                                                                {step.showWarning && !isComplete && (
                                                                    <Banner tone="warning" onDismiss={() => {}}>
                                                                        Please create your first survey
                                                                    </Banner>
                                                                )}

                                                                <ButtonGroup>
                                                                    <Button
                                                                        variant="primary"
                                                                        size="medium"
                                                                        loading={isLoading}
                                                                        disabled={isComplete}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            runStep(step.id);
                                                                        }}
                                                                    >
                                                                        {isComplete ? "Completed" : step.cta}
                                                                    </Button>
                                                                    
                                                                    {index === 0 && (
                                                                        <Button
                                                                            variant="plain"
                                                                            size="medium"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                refreshStep(step.id);
                                                                            }}
                                                                        >
                                                                            Refresh
                                                                        </Button>
                                                                    )}
                                                                    
                                                                    {step.secondaryCta && (
                                                                        <Button
                                                                            variant="secondary"
                                                                            size="medium"
                                                                            icon={ExternalIcon}
                                                                            disabled={!isComplete}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                // Handle secondary action
                                                                            }}
                                                                        >
                                                                            {step.secondaryCta}
                                                                        </Button>
                                                                    )}
                                                                </ButtonGroup>
                                                            </BlockStack>
                                                        </Collapsible>
                                                    </BlockStack>
                                                </div>
                                            </div>
                                        </div>
                                    </BlockStack>
                                );
                            })}
                        </BlockStack>
                    </Box>
                </Collapsible>

                {extensionError && (
                    <Box padding="400">
                        <Banner tone="critical">
                            Error checking extension status: {extensionError}
                        </Banner>
                    </Box>
                )}
            </BlockStack>
        </Card>
    );
}


