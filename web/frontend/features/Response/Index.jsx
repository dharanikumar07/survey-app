import React, { useState, useCallback } from 'react';
import {
    Page,
    Card,
    Text,
    BlockStack,
    Button,
    IndexTable,
    Badge,
    Box,
    Banner,
    InlineStack,
    Pagination,
    Modal,
    IndexFilters,
    ChoiceList,
    useIndexResourceState,
    useSetIndexFiltersMode
} from "@shopify/polaris";
import {
    ViewIcon,
    DeleteIcon,
    ExportIcon,
    SortIcon
} from "@shopify/polaris-icons";
import { mockResponses } from './mockData';

export default function Response() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showExportBanner, setShowExportBanner] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);

    // IndexFilters state
    const [queryValue, setQueryValue] = useState('');
    const [status, setStatus] = useState('active');
    const [taggedWith, setTaggedWith] = useState('all');

    // Use the mode state hook for IndexFilters
    const { mode, setMode } = useSetIndexFiltersMode();
    const [itemStrings, setItemStrings] = useState(['All', 'Active', 'Archived']);
    const [selected, setSelected] = useState(0);

    // Filter responses based on IndexFilters
    const filteredResponses = mockResponses.filter(response => {
        // Filter by status based on tab selection
        if (selected === 1) return response.status === 'Active';
        if (selected === 2) return response.status === 'Archived';
        return true; // 'All' tab
    }).filter(response => {
        // Filter by answer type
        if (taggedWith === 'number_scale') return response.questions.some(q => q.answerType === "Number scale");
        if (taggedWith === 'short_answer') return response.questions.some(q => q.answerType === "Short answer");
        if (taggedWith === 'yes_no') return response.questions.some(q => q.answerType === "Yes/No");
        return true;
    });

    // Search and filter responses
    const searchedResponses = filteredResponses.filter(response => {
        if (queryValue) {
            return response.id.toLowerCase().includes(queryValue.toLowerCase()) ||
                response.surveyName.toLowerCase().includes(queryValue.toLowerCase());
        }
        return true;
    });

    // Sort responses (you'll need to implement your sorting logic)
    const sortedResponses = [...searchedResponses];

    // Pagination
    const totalPages = Math.ceil(sortedResponses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResponses = sortedResponses.slice(startIndex, endIndex);

    // Flatten responses for table display
    const tableRows = paginatedResponses.flatMap(response =>
        response.questions.map((question, index) => ({
            id: `${response.id}-${question.id}`,
            responseId: response.id,
            survey: response.surveyName,
            question: question.question,
            answerType: question.answerType,
            answer: question.answer,
            date: response.date,
            actions: response.id
        }))
    );

    // Bulk actions state using useIndexResourceState hook
    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(mockResponses);

    // IndexFilters configuration
    const filters = [
        {
            key: 'status',
            label: 'Status',
            filter: (
                <ChoiceList
                    title="Status"
                    titleHidden
                    choices={[
                        { label: 'Active', value: 'active' },
                        { label: 'Archived', value: 'archived' },
                    ]}
                    selected={[status]}
                    onChange={([selectedStatus]) => setStatus(selectedStatus)}
                    allowMultiple={false}
                />
            ),
            shortcut: true,
        },
        {
            key: 'taggedWith',
            label: 'Answer type',
            filter: (
                <ChoiceList
                    title="Answer type"
                    titleHidden
                    choices={[
                        { label: 'All types', value: 'all' },
                        { label: 'Number scale', value: 'number_scale' },
                        { label: 'Short answer', value: 'short_answer' },
                        { label: 'Yes/No', value: 'yes_no' },
                    ]}
                    selected={[taggedWith]}
                    onChange={([selectedType]) => setTaggedWith(selectedType)}
                    allowMultiple={false}
                />
            ),
            shortcut: true,
        },
    ];

    const appliedFilters = [];
    if (status !== 'active') {
        appliedFilters.push({
            key: 'status',
            label: `Status: ${status === 'active' ? 'Active' : 'Archived'}`,
            onRemove: () => setStatus('active'),
        });
    }
    if (taggedWith !== 'all') {
        appliedFilters.push({
            key: 'taggedWith',
            label: `Answer type: ${taggedWith === 'number_scale' ? 'Number scale' : taggedWith === 'short_answer' ? 'Short answer' : 'Yes/No'}`,
            onRemove: () => setTaggedWith('all'),
        });
    }

    // Bulk actions configuration
    const bulkActions = [
        {
            content: 'Delete selected',
            onAction: () => {
                console.log('Delete selected responses:', selectedResources);
                // Implement bulk delete logic here
            },
            destructive: true,
        },
        {
            content: 'Export selected',
            onAction: () => {
                console.log('Export selected responses:', selectedResources);
                // Implement bulk export logic here
            },
        },
    ];

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleViewResponse = (responseId) => {
        const response = mockResponses.find(r => r.id === responseId);
        setSelectedResponse(response);
        setModalOpen(true);
    };

    const handleDeleteResponse = (responseId) => {
        console.log(`Delete response ${responseId}`);
        // Implement delete logic here
    };

    const resourceName = {
        singular: "response",
        plural: "responses",
    };

    const rowMarkup = tableRows.map(
        ({ id, responseId, survey, question, answerType, answer, date, actions }, index) => (
            <IndexTable.Row
                id={responseId}
                key={id}
                selected={selectedResources.includes(responseId)}
                position={index}
            >
                <IndexTable.Cell>
                    <InlineStack align="start" gap="2">
                        <div>
                            <Text variant="bodyMd" fontWeight="semibold" as="span">
                                #{responseId}
                            </Text>
                            <br />
                            <Text variant="bodySm" as="span" tone="subdued">
                                {date}
                            </Text>
                        </div>
                    </InlineStack>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {survey}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {question}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge tone="info" size="small">
                        {answerType}
                    </Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {answerType === "Number scale" || answerType === "Yes/No" ? (
                        <Badge tone="info" size="small">
                            {answer}
                        </Badge>
                    ) : (
                        <Text variant="bodyMd" as="span">
                            {answer}
                        </Text>
                    )}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div className='flex gap-2'>
                        <Button
                            icon={ViewIcon}
                            size="slim"
                            variant='plain'
                            onClick={() => handleViewResponse(responseId)}
                            aria-label={`View response ${responseId}`}
                        />
                        <Button
                            icon={DeleteIcon}
                            size="slim"
                            variant='plain'
                            tone="critical"
                            onClick={() => handleDeleteResponse(responseId)}
                            aria-label={`Delete response ${responseId}`}
                        />
                    </div>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <Page
            title={
                <InlineStack align="center" gap="2">
                    <Text variant="headingLg" as="h1">
                        Responses
                    </Text>
                </InlineStack>
            }
            subtitle="All responses"
            fullWidth
        >
            <BlockStack gap="4">
                {/* Main Content Card */}
                <Card padding="200">
                    <BlockStack gap="4">
                        {/* IndexFilters */}
                        <IndexFilters
                            queryValue={queryValue}
                            queryPlaceholder="Search responses..."
                            onQueryChange={setQueryValue}
                            onQueryClear={() => setQueryValue('')}
                            cancelAction={{
                                onAction: () => {
                                    setQueryValue('');
                                    setStatus('active');
                                    setTaggedWith('all');
                                    setSelected(0);
                                },
                                disabled: false,
                            }}
                            tabs={itemStrings.map((item, index) => ({
                                content: item,
                                id: index.toString(),
                                accessibilityLabel: `${item} tab`,
                                // Remove the isLocked property to make all tabs clickable
                            }))}
                            selected={selected}
                            onSelect={setSelected}
                            filters={filters}
                            appliedFilters={appliedFilters}
                            onClearAll={() => {
                                setQueryValue('');
                                setStatus('active');
                                setTaggedWith('all');
                                setSelected(0);
                            }}
                            mode={mode}
                            setMode={setMode}
                            canCreateNewView={false}
                            hideQueryField={false}
                        />

                        {/* Response Table */}
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={tableRows.length}
                            selectedItemsCount={
                                allResourcesSelected ? 'All' : selectedResources.length
                            }
                            onSelectionChange={handleSelectionChange}
                            headings={[
                                { title: 'Response ID' },
                                { title: 'Survey' },
                                { title: 'Question' },
                                { title: 'Answer type' },
                                { title: 'Answer' },
                                { title: 'Actions' },
                            ]}
                            bulkActions={bulkActions}
                        >
                            {rowMarkup}
                        </IndexTable>

                        {/* Pagination */}
                        <InlineStack align="center" justify="space-between">
                            <Pagination
                                hasPrevious={currentPage > 1}
                                onPrevious={handlePrevious}
                                hasNext={currentPage < totalPages}
                                onNext={handleNext}
                            />
                        </InlineStack>
                    </BlockStack>
                </Card>
            </BlockStack>

            {/* Response Detail Modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Response #${selectedResponse?.id}`}
                primaryAction={{
                    content: 'Close',
                    onAction: () => setModalOpen(false),
                }}
            >
                <Modal.Section>
                    {selectedResponse && (
                        <BlockStack gap="4">
                            <Box padding="4" background="bg-surface-secondary">
                                <Text variant="bodyMd" as="p">
                                    <strong>Survey:</strong> {selectedResponse.surveyName}
                                </Text>
                                <Text variant="bodyMd" as="p">
                                    <strong>Date:</strong> {selectedResponse.date}
                                </Text>
                            </Box>

                            {selectedResponse.questions.map((question, index) => (
                                <Box key={question.id} padding="4" border="divider" borderRadius="2">
                                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                                        Question {index + 1}: {question.question}
                                    </Text>
                                    <Text variant="bodyMd" as="p">
                                        <strong>Answer Type:</strong> {question.answerType}
                                    </Text>
                                    <Text variant="bodyMd" as="p">
                                        <strong>Answer:</strong> {question.answer}
                                    </Text>
                                </Box>
                            ))}
                        </BlockStack>
                    )}
                </Modal.Section>
            </Modal>
        </Page>
    );
}