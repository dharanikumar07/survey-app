import React, { useState } from 'react';
import { 
    Page, 
    Card, 
    Text, 
    BlockStack, 
    TextField, 
    Button, 
    InlineStack,
    Banner 
} from '@shopify/polaris';
import { apiClient } from '../../../../api';
import useStore from '../../../../State/store';

export default function AIAssistantSetup({ onBack, onProceed }) {
    const [prompt, setPrompt] = useState('');
    const [generatedTitle, setGeneratedTitle] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const setSurveyTitle = useStore(state => state.setSurveyTitle);

    const handleGenerate = async () => {
        const base = prompt.trim();
        if (!base) return;
        
        setIsGenerating(true);
        setError('');
        
        try {
            const res = await apiClient('POST', '/assistant/generate-title', { prompt: base });
            const title = res?.data?.title || '';
            if (title) {
                setGeneratedTitle(title);
                setSurveyTitle(title);
            } else {
                throw new Error('No title generated');
            }
        } catch (e) {
            console.error('AI title generation failed', e);
            setError(e.data?.message || e.message || 'Failed to generate title. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClear = () => {
        setPrompt('');
        setGeneratedTitle('');
        setError('');
    };

    const handleProceed = () => {
        if (generatedTitle) {
            // Store AI data for template loading
            const aiData = {
                surveyTitle: generatedTitle
            };
            localStorage.setItem('aiSurveyData', JSON.stringify(aiData));
            console.log('AI data stored for template loading:', aiData);
            
            onProceed();
        }
    };

    return (
        <Page
            title="Create with AI"
            subtitle="Answer a few quick questions so we can draft the right survey."
            backAction={{ content: 'Templates', onAction: onBack }}
            fullWidth
        >
            <BlockStack gap="500">
                {error && (
                    <Banner title="Generation Failed" tone="critical" onDismiss={() => setError('')}>
                        <p>{error}</p>
                    </Banner>
                )}

                <Card padding="400" shadow="md">
                    <BlockStack gap="300">
                        <Text variant="headingMd" as="h3">Generate survey title</Text>
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
                                {isGenerating ? 'Generating...' : 'Generate title'}
                            </Button>
                            {generatedTitle && (
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
                        {generatedTitle && (
                            <BlockStack gap="100">
                                <Text tone="subdued">✨ Suggested title</Text>
                                <Text variant="headingMd" as="p">"{generatedTitle}"</Text>
                                <Text variant="bodyMd" tone="subdued">
                                    You can always edit this title later in the survey builder.
                                </Text>
                            </BlockStack>
                        )}
                        {isGenerating && (
                            <BlockStack gap="100">
                                <Text tone="subdued">🤖 AI is working its magic...</Text>
                                <Text variant="bodyMd" tone="subdued">
                                    This usually takes just a few seconds. Powered by Gemini 2.0 Flash ✨
                                </Text>
                            </BlockStack>
                        )}
                    </BlockStack>
                </Card>
            </BlockStack>
        </Page>
    );
}
