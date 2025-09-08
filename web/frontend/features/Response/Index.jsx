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
// import { mockResponses } from './mockData';
import { useQueryEvents } from '../../components/helper/use-query-event';
import { useQuery } from '@tanstack/react-query';
import { useResponseApi } from './action/use-response-api';

export default function Response() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showExportBanner, setShowExportBanner] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [responses, setResponses] = useState([]);

    // IndexFilters state
    const [queryValue, setQueryValue] = useState('');
    const [status, setStatus] = useState('active');
    const [taggedWith, setTaggedWith] = useState('all');

    // Use the mode state hook for IndexFilters
    const { mode, setMode } = useSetIndexFiltersMode();
    const [itemStrings, setItemStrings] = useState(['All', 'Active', 'Archived']);
    const [selected, setSelected] = useState(0);

    const { getResponses } = useResponseApi();

    const { data: responseData = [] } = useQueryEvents(
        useQuery({
            queryKey: ['responses'],
            queryFn: getResponses
        }),
        {
            onSuccess: (data) => {
                console.log(data);
                setResponses(data.data.data);
            },
            onError: (error) => {
                console.log(error);
            }
        }
    )

    // Filter responses based on IndexFilters
    const filteredResponses = responses.filter(response => {
        // For now, we're showing all responses since we don't have status in the new data format
        // You can add status filtering logic when that field is available
        if (selected === 1) return true; // Active tab (can be updated based on your criteria)
        if (selected === 2) return false; // Archived tab (can be updated based on your criteria)
        return true; // 'All' tab
    }).filter(response => {
        // Since we don't have answerType in the new data structure, we'll skip this filtering for now
        // You can add custom filtering based on answer content or other criteria if needed
        return true;
    });

    // Search and filter responses
    const searchedResponses = filteredResponses.filter(response => {
        if (queryValue) {
            return response.id.toString().includes(queryValue.toLowerCase()) ||
                response.survey_name.toLowerCase().includes(queryValue.toLowerCase());
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
        response.answers.map((answer, index) => ({
            id: `${response.id}-${index}`,
            responseId: response.id,
            survey: response.survey_name,
            question: answer.question,
            // Since we don't have answerType in the new format, we'll set a default
            answerType: "Text",
            answer: answer.answer,
            date: new Date(response.created_at).toLocaleDateString(),
            actions: response.id
        }))
    );

    // Bulk actions state using useIndexResourceState hook
    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(responses);

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
        const response = responses.find(r => r.id === parseInt(responseId));
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
                    <Text variant="bodyMd" as="span">
                        {answer}
                    </Text>
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
                                    <strong>Survey:</strong> {selectedResponse.survey_name}
                                </Text>
                                <Text variant="bodyMd" as="p">
                                    <strong>Platform:</strong> {selectedResponse.platform}
                                </Text>
                                <Text variant="bodyMd" as="p">
                                    <strong>Date:</strong> {new Date(selectedResponse.created_at).toLocaleString()}
                                </Text>
                            </Box>

                            {selectedResponse.answers.map((answer, index) => (
                                <Box key={index} padding="4" border="divider" borderRadius="2">
                                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                                        Question {index + 1}: {answer.question}
                                    </Text>
                                    <Text variant="bodyMd" as="p">
                                        <strong>Answer:</strong> {answer.answer}
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