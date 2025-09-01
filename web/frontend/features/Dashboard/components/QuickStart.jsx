import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Card, Text, ProgressBar, BlockStack, Box } from "@shopify/polaris";
import Accordion from "../../../components/Accordion";
import { useExtensionStatus } from "../hooks/useExtensionStatus";

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Quickstart() {
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
                description: "Start gathering feedback by creating a survey.",
                cta: "Create",
            },
            {
                id: "visualize",
                title: "Visualize how it appears",
                description: "Preview the survey placement and styling.",
                cta: "Preview",
            },
        ],
        [],
    );

    const [activeStepId, setActiveStepId] = useState("activate");

    // Check extension status on component mount
    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    // Update activate step status based on extension status
    useEffect(() => {
        if (extensionLoading) {
            setStatusByStep(prev => ({ ...prev, activate: "loading" }));
        } else if (isExtensionEnabled) {
            setStatusByStep(prev => ({ ...prev, activate: "complete" }));
        } else {
            setStatusByStep(prev => ({ ...prev, activate: "idle" }));
        }
    }, [isExtensionEnabled, extensionLoading]);

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
            <BlockStack gap="400">
                <Text as="h3" variant="headingSm">
                    Quickstart
                </Text>
                <Box>
                    <Text as="p" variant="bodySm" tone="subdued">
                        {completedCount} of {steps.length} tasks completed
                    </Text>
                    <ProgressBar progress={progress} size="small" tone={progress === 100 ? "success" : undefined} />
                </Box>

                {extensionError && (
                    <Text as="p" tone="critical">
                        Error checking extension status: {extensionError}
                    </Text>
                )}

                <Accordion
                    items={steps.map((step, index) => ({
                        id: step.id,
                        title: step.title,
                        description: step.description,
                        isComplete: statusByStep[step.id] === "complete",
                        isLoading: statusByStep[step.id] === "loading",
                        ctaLabel: statusByStep[step.id] === "complete" ? "Completed" : step.cta,
                        onPrimaryClick: () => runStep(step.id),
                        secondaryLabel: index === 0 ? "Refresh" : undefined,
                        onSecondaryClick: index === 0 ? () => refreshStep(step.id) : undefined,
                    }))}
                    activeId={activeStepId}
                    onChange={(id) => setActiveStepId(id)}
                />
            </BlockStack>
        </Card>
    );
}


