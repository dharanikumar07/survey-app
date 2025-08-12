import React from 'react';
import { Box, Grid, Text, Card, BlockStack, Icon, Badge, Divider } from '@shopify/polaris';
import Sidebar from './Sidebar';
import useStore from '../../../State/store';
// import { HelpIcon, QuestionIcon } from '@shopify/polaris-icons';

function SurveyModalContent() {
    const { selectedQuestionId, setSelectedQuestionId } = useStore();

    const handleSelectQuestion = (id) => {
        setSelectedQuestionId(id);
    };

    return (
        <Box padding="0">
            <Grid>
                {/* Left Sidebar with Question List */}
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                    <Sidebar onSelectItem={handleSelectQuestion} />
                </Grid.Cell>

                {/* Center Survey Preview */}
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Box
                        padding="400"
                        background="bg-surface-secondary"
                        minHeight="calc(100vh - 100px)"
                        overflow="auto"
                    >
                        <BlockStack gap="400" align="center">
                            {/* Logo */}
                            {/* <Box padding="400" width="200px">
                                <img
                                    src="https://via.placeholder.com/200x80?text=SEA+Logo"
                                    alt="SEA Logo"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </Box> */}

                            {/* Survey Card */}
                            <Card>
                                <BlockStack gap="600" align="center">
                                    <Box paddingBlockStart="500">
                                        <BlockStack gap="200">
                                            <Text variant="headingLg" as="h3" alignment="center">
                                                How likely are you to recommend us to a friend?
                                            </Text>

                                            <Box paddingBlockStart="400" paddingBlockEnd="400">
                                                <BlockStack gap="400" align="center">
                                                    {/* Emoji */}
                                                    <div style={{ fontSize: '48px', textAlign: 'center' }}>
                                                        😐
                                                    </div>

                                                    {/* Rating Text */}
                                                    <Text alignment="center">Not likely</Text>

                                                    {/* Rating Scale */}
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        width: '100%',
                                                        paddingTop: '10px'
                                                    }}>
                                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                                            <button
                                                                key={num}
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    border: '1px solid #ccc',
                                                                    borderRadius: '4px',
                                                                    background: num === 3 ? '#f1f8ff' : 'white',
                                                                    color: '#000',
                                                                    fontSize: '16px'
                                                                }}
                                                            >
                                                                {num}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </BlockStack>
                                            </Box>
                                        </BlockStack>
                                    </Box>

                                    {/* Survey Navigation */}
                                    <Box borderBlockStartWidth="1" borderColor="border" paddingBlockStart="400" width="100%">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <div style={{ width: '80px' }}></div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <div style={{ width: '8px', height: '8px', background: '#000', borderRadius: '50%' }}></div>
                                                <div style={{ width: '8px', height: '8px', background: '#ddd', borderRadius: '50%' }}></div>
                                                <div style={{ width: '8px', height: '8px', background: '#ddd', borderRadius: '50%' }}></div>
                                            </div>
                                            <button style={{
                                                padding: '8px 16px',
                                                background: '#1a1a1a',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}>
                                                Next
                                            </button>
                                        </div>
                                    </Box>
                                </BlockStack>
                            </Card>

                            {/* Branding Footer */}
                            <Box paddingBlockEnd="400">
                                <Text variant="bodySm" color="text-subdued" alignment="center">
                                    Want your logo to shine in the survey? <a href="#" style={{ color: '#2c6ecb' }}>Let us help</a>
                                </Text>
                            </Box>
                        </BlockStack>
                    </Box>
                </Grid.Cell>

                {/* Right Panel - Question Settings */}
                <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                    <Box
                        padding="400"
                        background="bg-surface"
                        borderInlineStartWidth="1"
                        borderColor="border"
                        minHeight="calc(100vh - 100px)"
                        overflow="auto"
                    >
                        <BlockStack gap="400">
                            <Text variant="headingMd" as="h2">Question</Text>

                            <BlockStack gap="300">
                                <Text variant="bodySm" as="h3">Question type</Text>
                                <div style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '10px 12px'
                                }}>
                                    <Text variant="bodySm">Number scale</Text>
                                </div>
                            </BlockStack>

                            <BlockStack gap="300">
                                <Text variant="bodySm" as="h3">Heading</Text>
                                <div style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '10px 12px'
                                }}>
                                    <Text variant="bodySm">How likely are you to recommend us to a friend?</Text>
                                </div>
                            </BlockStack>

                            <BlockStack gap="300">
                                <Text variant="bodySm" as="h3">Description</Text>
                                <div style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '10px 12px',
                                    height: '80px'
                                }}>
                                </div>
                            </BlockStack>

                            <BlockStack gap="300">
                                <Text variant="bodySm" as="h3">Image</Text>
                                <div style={{
                                    border: '1px dashed #ddd',
                                    borderRadius: '4px',
                                    padding: '20px',
                                    textAlign: 'center'
                                }}>
                                    <BlockStack gap="200" align="center">
                                        <Text variant="bodySm">Add Image</Text>
                                        <Text variant="bodySm" color="text-subdued">
                                            Accepts .svg, .jpg, .jpeg, and .png
                                        </Text>
                                    </BlockStack>
                                </div>
                            </BlockStack>

                            <Divider />

                            <Box>
                                <Text variant="bodySm" tone="critical">Delete question</Text>
                            </Box>
                        </BlockStack>
                    </Box>
                </Grid.Cell>
            </Grid>
        </Box>
    );
}

export default SurveyModalContent;