import React, { useState } from "react";
import {
    Page,
    Card,
    Text,
    BlockStack,
    TextField,
    Button,
    InlineStack,
    Banner,
} from "@shopify/polaris";
import { apiClient } from "../../../../api";

export default function AIAssistantSetup({ onBack, onProceed }) {
    const [prompt, setPrompt] = useState("");
    const [generatedTitle, setGeneratedTitle] = useState("");
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        const base = prompt.trim();
        if (!base) return;

        setIsGenerating(true);
        setError("");

        try {
            // Call the new comprehensive generation endpoint
            const res = await apiClient("POST", "/assistant/generate-survey", {
                prompt: base,
            });
            const surveyData = res?.data;

            if (surveyData?.surveyTitle && surveyData?.questions) {
                setGeneratedTitle(surveyData.surveyTitle);
                setGeneratedQuestions(surveyData.questions);
                // Don't call setSurveyTitle here - let template loading handle it
            } else {
                throw new Error("Invalid survey data generated");
            }
        } catch (e) {
            console.error("AI survey generation failed", e);
            setError(
                e.data?.message ||
                    e.message ||
                    "Failed to generate survey. Please try again.",
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClear = () => {
        setPrompt("");
        setGeneratedTitle("");
        setGeneratedQuestions([]);
        setError("");
    };

    const handleProceed = () => {
        if (generatedTitle && generatedQuestions.length > 0) {
            // Store complete AI data for template loading
            const aiData = {
                surveyTitle: generatedTitle,
                questions: generatedQuestions,
            };
            localStorage.setItem("aiSurveyData", JSON.stringify(aiData));
            console.log("AI data stored for template loading:", aiData);

            onProceed();
        }
    };

    return (
        <Page
            title="Create with AI"
            subtitle="Answer a few quick questions so we can draft the right survey."
            backAction={{ content: "Templates", onAction: onBack }}
            fullWidth
        >
            <BlockStack gap="500">
                {error && (
                    <Banner
                        title="Generation Failed"
                        tone="critical"
                        onDismiss={() => setError("")}
                    >
                        <p>{error}</p>
                    </Banner>
                )}

                <Card padding="400" shadow="md">
                    <BlockStack gap="300">
                        <Text variant="headingMd" as="h3">
                            Generate complete survey
                        </Text>
                        <TextField
                            label="Describe your survey goal"
                            value={prompt}
                            onChange={setPrompt}
                            autoComplete="off"
                            multiline={3}
                            helpText="Examples: 'Customer satisfaction after purchase', 'Marketing attribution for new customers', 'Exit intent survey for cart abandoners'"
                            disabled={isGenerating}
                        />
                        <InlineStack gap="200" align="start">
                            <Button
                                size="slim"
                                variant="secondary"
                                onClick={handleClear}
                                disabled={isGenerating}
                            >
                                Clear
                            </Button>
                            <Button
                                size="slim"
                                variant="primary"
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || isGenerating}
                                loading={isGenerating}
                            >
                                {isGenerating
                                    ? "Generating..."
                                    : "Generate survey"}
                            </Button>
                            {generatedTitle &&
                                generatedQuestions.length > 0 && (
                                    <Button
                                        size="slim"
                                        variant="primary"
                                        onClick={handleProceed}
                                        disabled={isGenerating}
                                    >
                                        Use this and continue
                                    </Button>
                                )}
                        </InlineStack>
                        {generatedTitle && generatedQuestions.length > 0 && (
                            <BlockStack gap="200">
                                <Text tone="subdued" as="h4">
                                    Generated survey
                                </Text>
                                <Text variant="headingMd" as="p">
                                    "{generatedTitle}"
                                </Text>
                                <BlockStack gap="100">
                                    <Text variant="bodyMd" tone="subdued">
                                        Questions generated:
                                    </Text>
                                    {generatedQuestions
                                        .slice(0, -1)
                                        .map((question, index) => (
                                            <Text
                                                key={question.id}
                                                variant="bodyMd"
                                                tone="subdued"
                                            >
                                                {index + 1}. {question.content}{" "}
                                                ({question.questionType})
                                            </Text>
                                        ))}
                                </BlockStack>
                                <Text variant="headingMd" tone="base">
                                    You can always edit the survey later in the
                                    survey builder.
                                </Text>
                            </BlockStack>
                        )}
                        {isGenerating && (
                            <BlockStack gap="100">
                                <Text tone="subdued">
                                    AI is generating your complete survey...
                                </Text>
                                <Text variant="bodyMd" tone="subdued">
                                    Creating title, questions, and answers. This
                                    usually takes just a few seconds. Powered by
                                    AI{" "}
                                </Text>
                            </BlockStack>
                        )}
                    </BlockStack>
                </Card>
            </BlockStack>
        </Page>
    );
}
