import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Page,
    Card,
    Text,
    BlockStack,
    Button,
    IndexTable,
    Badge,
    Tabs,
    Box,
    Banner,
    InlineStack,
    Popover,
    ActionList,
    Pagination,
    Modal
} from "@shopify/polaris";
import {
    MenuVerticalIcon,
    InfoIcon,
    DuplicateIcon,
    EditIcon,
    DeleteIcon,
    ViewIcon,
    DisabledIcon
} from "@shopify/polaris-icons";
import { useSurveyApi } from "./action/use-survey-api";
import { useQueryEvents } from "../../components/helper/use-query-event";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/helper/toast-helper";

export default function Survey() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [surveys, setSurveys] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [popoverActive, setPopoverActive] = useState({});
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const [surveyToDelete, setSurveyToDelete] = useState(null);
    const { getSurveys, deleteSurvey } = useSurveyApi();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    // Delete mutation
    const deleteSurveyMutation = useMutation({
        mutationFn: deleteSurvey,
        onSuccess: (response) => {
            const message = response?.data?.message || "Survey deleted successfully";
            showToast({ message, type: "success" });
            setDeleteModalActive(false);
            setSurveyToDelete(null);
            // Invalidate and refetch surveys
            queryClient.invalidateQueries({ queryKey: ["surveys"] });
        },
        onError: (error) => {
            const errorMessage = error?.data?.error || "Failed to delete survey";
            showToast({ message: errorMessage, type: "error" });
            setDeleteModalActive(false);
            setSurveyToDelete(null);
        },
        onSettled: () => {
            // Reset mutation state after completion (success or error)
            deleteSurveyMutation.reset();
        }
    });

    const { data, isLoading, isError, isPending } = useQueryEvents(
        useQuery({
            queryKey: ["surveys", activeTab, currentPage],
            queryFn: () => getSurveys({ status: activeTab, page: currentPage }),
        }),
        {
            onSuccess: (data) => {
                setSurveys(data.data.data);
            },
            onError: (error) => {
                // Handle error silently or show toast if needed
            },
        }
    )
    const resourceName = {
        singular: "survey",
        plural: "surveys",
    };



    // Pagination settings
    const itemsPerPage = 10;
    const totalPages = Math.ceil(surveys.length / itemsPerPage);

    // Filter surveys based on active tab
    const filteredSurveys = surveys.filter(survey => {
        if (activeTab === 0) return true; // All
        if (activeTab === 1) return survey.status === "active"; // Active
        if (activeTab === 2) return survey.status === "inactive"; // Inactive
        return true;
    });

    // Paginate the filtered surveys
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSurveys = filteredSurveys.slice(startIndex, endIndex);

    const tabs = [
        {
            id: "all",
            content: "All",
            accessibilityLabel: "All surveys",
            panelID: "all-surveys",
        },
        {
            id: "active",
            content: "Active",
            accessibilityLabel: "Active surveys",
            panelID: "active-surveys",
        },
        {
            id: "inactive",
            content: "Inactive",
            accessibilityLabel: "Inactive surveys",
            panelID: "inactive-surveys",
        },
    ];

    const handleTabChange = (selectedTabIndex) => {
        setActiveTab(selectedTabIndex);
        setCurrentPage(1); // Reset to first page when changing tabs
    };

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

    const handleCreateSurvey = () => {
        navigate("/survey/templates");
    };

    const handleEditSurvey = (surveyId) => {
        navigate(`/survey/edit/${surveyId}`);
    };

    const togglePopover = (id) => {
        setPopoverActive(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSurveyAction = (action, id) => {
        // Close the popover
        setPopoverActive(prev => ({
            ...prev,
            [id]: false
        }));

        // Handle the action
        switch (action) {
            case 'edit':
                handleEditSurvey(id);
                break;
            case 'view':
                // Handle view action - TODO: Implement view functionality
                break;
            case 'duplicate':
                // Handle duplicate action - TODO: Implement duplicate functionality
                break;
            case 'activate':
                // Handle activate/deactivate action - TODO: Implement activate/deactivate functionality
                break;
            case 'delete':
                // Handle delete action - show confirmation modal
                const survey = surveys.find(s => s.uuid === id);
                setSurveyToDelete(survey);
                setDeleteModalActive(true);
                // Reset mutation state to ensure clean state
                deleteSurveyMutation.reset();
                break;
            default:
                break;
        }
    };

    const handleDeleteConfirm = () => {
        if (surveyToDelete) {
            deleteSurveyMutation.mutate(surveyToDelete.uuid);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalActive(false);
        setSurveyToDelete(null);
        // Reset mutation state when cancelling
        deleteSurveyMutation.reset();
    };

    return (
        <Page
            title="Surveys"
            primaryAction={{
                content: "Create new survey",
                onAction: handleCreateSurvey,
            }}
            secondaryActions={[
                {
                    content: 'Help center',
                    accessibilityLabel: 'Access help center',
                    icon: InfoIcon,
                    onAction: () => {
                        // TODO: Implement help center functionality
                    },
                },
            ]}
        >
            <BlockStack gap="400">
                <Banner
                    title=""
                    icon={InfoIcon}
                    status="info"
                    onDismiss={() => { }}
                >
                    The most recently activated survey will be displayed first on the store. Once it stops showing according to its Widget recurrence settings, other surveys in the same position will be shown subsequently
                </Banner>

                <Card padding="200">
                    <Tabs tabs={tabs} selected={activeTab} onSelect={handleTabChange} />
                    <IndexTable
                        resourceName={resourceName}
                        loading={isLoading || isPending || deleteSurveyMutation.isPending}
                        itemCount={paginatedSurveys.length}
                        headings={[
                            { title: "Survey name" },
                            { title: "Status" },
                            { title: "Created" },
                            { title: "Channel" },
                            { title: "Responses" },
                            { title: "Actions" },
                        ]}
                        selectable={false}
                    >
                        {paginatedSurveys.map((survey, index) => (
                            <IndexTable.Row
                                id={survey.uuid}
                                key={survey.uuid}
                                position={index}
                            >
                                <IndexTable.Cell>
                                    <Text
                                        variant="bodyMd"
                                        fontWeight="bold"
                                        as="a"
                                        onClick={() => handleEditSurvey(survey.uuid)}
                                        className="th-sf-survey-edit-link"
                                    >
                                        {survey.name}
                                    </Text>
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    <InlineStack gap="200">
                                        <Badge tone={survey.status === "active" ? "success" : "attention"}>
                                            {survey.status === "active" ? "Active" : "Inactive"}
                                        </Badge>
                                    </InlineStack>
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    {new Date(survey.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    <InlineStack gap="200">
                                        {survey.survey_meta_data?.channelTypes?.map((channel, idx) => (
                                            <Badge key={idx} tone="info">
                                                {channel === "dedicatedPageSurvey" ? "Branded survey page" :
                                                    channel === "thankyou" ? "Post-purchase page" :
                                                        channel === "onSite" ? "On-site survey" : channel}
                                            </Badge>
                                        )) || <Badge tone="info">No channels</Badge>}
                                    </InlineStack>
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    <Text variant="bodyMd" fontWeight="bold">
                                        {survey.total_responses || 0}
                                    </Text>
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    <Popover
                                        active={popoverActive[survey.uuid]}
                                        activator={
                                            <Button variant="plain" icon={MenuVerticalIcon} onClick={(e) => {
                                                e.stopPropagation();
                                                togglePopover(survey.uuid);
                                            }} />
                                        }
                                        onClose={() => togglePopover(survey.uuid)}
                                        preferredAlignment="right"
                                    >
                                        <ActionList
                                            actionRole="menuitem"
                                            items={[
                                                {
                                                    content: 'Edit',
                                                    icon: EditIcon,
                                                    onAction: () => handleSurveyAction('edit', survey.uuid)
                                                },
                                                {
                                                    content: 'View live survey',
                                                    icon: ViewIcon,
                                                    onAction: () => handleSurveyAction('view', survey.uuid)
                                                },
                                                {
                                                    content: 'Duplicate',
                                                    icon: DuplicateIcon,
                                                    onAction: () => handleSurveyAction('duplicate', survey.uuid)
                                                },
                                                {
                                                    content: survey.status === 'active' ? 'Deactivate' : 'Activate',
                                                    icon: survey.status === 'active' ? DisabledIcon : InfoIcon,
                                                    onAction: () => handleSurveyAction('activate', survey.uuid)
                                                },
                                                {
                                                    content: 'Delete',
                                                    icon: DeleteIcon,
                                                    destructive: true,
                                                    onAction: () => handleSurveyAction('delete', survey.uuid)
                                                },
                                            ]}
                                        />
                                    </Popover>
                                </IndexTable.Cell>
                            </IndexTable.Row>
                        ))}
                    </IndexTable>

                    <Box paddingBlockStart="400" paddingBlockEnd="400">
                        <InlineStack align="space-between" blockAlign="center">
                            <div className="th-sf-survey-margin-left">
                                <Text variant="bodySm" color="subdued">
                                    Showing {startIndex + 1}-{Math.min(endIndex, filteredSurveys.length)} of {filteredSurveys.length} surveys
                                </Text>
                            </div>
                            <div className="th-sf-survey-margin-right">
                                <Pagination
                                    hasPrevious={currentPage > 1}
                                    onPrevious={handlePrevious}
                                    hasNext={currentPage < Math.ceil(filteredSurveys.length / itemsPerPage)}
                                    onNext={handleNext}
                                />
                            </div>
                        </InlineStack>
                    </Box>
                </Card>
            </BlockStack>

            {/* Delete Confirmation Modal */}
            <Modal
                open={deleteModalActive}
                onClose={handleDeleteCancel}
                title="Delete Survey"
                primaryAction={{
                    content: 'Delete',
                    destructive: true,
                    onAction: handleDeleteConfirm,
                    loading: deleteSurveyMutation.isPending,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleDeleteCancel,
                    },
                ]}
            >
                <Modal.Section>
                    <Text variant="bodyMd">
                        Are you sure you want to delete "{surveyToDelete?.name}"? This action cannot be undone.
                    </Text>
                </Modal.Section>
            </Modal>
        </Page>
    );
}