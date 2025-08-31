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
    Icon,
    Tabs,
    Box,
    Banner,
    InlineStack,
    Tooltip,
    ButtonGroup,
    Popover,
    ActionList,
    Pagination
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

export default function Survey() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [popoverActive, setPopoverActive] = useState({});

    const resourceName = {
        singular: "survey",
        plural: "surveys",
    };

    const mockSurveys = [
        {
            id: "1",
            name: "SEA Customer Survey",
            status: "Active",
            created: "Aug 06, 2025 at 23:45 PM",
            channels: ["Branded survey page", "On-site survey", "Post-purchase page"],
            responses: 125
        },
        {
            id: "2",
            name: "Post-purchase Satisfaction",
            status: "Active",
            created: "Aug 01, 2025 at 14:23 PM",
            channels: ["Post-purchase page"],
            responses: 83
        },
        {
            id: "3",
            name: "Product Feedback",
            status: "Inactive",
            created: "Jul 15, 2025 at 09:12 AM",
            channels: ["Branded survey page"],
            responses: 47
        },
    ];

    // Pagination settings
    const itemsPerPage = 10;
    const totalPages = Math.ceil(mockSurveys.length / itemsPerPage);

    // Filter surveys based on active tab
    const filteredSurveys = mockSurveys.filter(survey => {
        if (activeTab === 0) return true; // All
        if (activeTab === 1) return survey.status === "Active"; // Active
        if (activeTab === 2) return survey.status === "Inactive"; // Inactive
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
                // Handle view action
                console.log(`View survey ${id}`);
                break;
            case 'duplicate':
                // Handle duplicate action
                console.log(`Duplicate survey ${id}`);
                break;
            case 'activate':
                // Handle activate/deactivate action
                console.log(`Activate/deactivate survey ${id}`);
                break;
            case 'delete':
                // Handle delete action
                console.log(`Delete survey ${id}`);
                break;
            default:
                break;
        }
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
                        // Open help center
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
                                id={survey.id}
                                key={survey.id}
                                position={index}
                            >
                                <IndexTable.Cell>
                                    <Text
                                        variant="bodyMd"
                                        fontWeight="bold"
                                        as="a"
                                        onClick={() => handleEditSurvey(survey.id)}
                                        className="th-sf-survey-edit-link"
                                    >
                                        {survey.name}
                                    </Text>
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    <InlineStack gap="200">
                                        <Badge tone={survey.status === "Active" ? "success" : "attention"}>{survey.status}</Badge>
                                    </InlineStack>
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    {survey.created}
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    <InlineStack gap="200">
                                        {survey.channels.map((channel, idx) => (
                                            <Badge key={idx} tone="info">{channel}</Badge>
                                        ))}
                                    </InlineStack>
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    <Text variant="bodyMd" fontWeight="bold">
                                        {survey.responses}
                                    </Text>
                                </IndexTable.Cell>
                                <IndexTable.Cell>
                                    <Popover
                                        active={popoverActive[survey.id]}
                                        activator={
                                            <Button variant="plain" icon={MenuVerticalIcon} onClick={(e) => {
                                                e.stopPropagation();
                                                togglePopover(survey.id);
                                            }} />
                                        }
                                        onClose={() => togglePopover(survey.id)}
                                        preferredAlignment="right"
                                    >
                                        <ActionList
                                            actionRole="menuitem"
                                            items={[
                                                {
                                                    content: 'Edit',
                                                    icon: EditIcon,
                                                    onAction: () => handleSurveyAction('edit', survey.id)
                                                },
                                                {
                                                    content: 'View live survey',
                                                    icon: ViewIcon,
                                                    onAction: () => handleSurveyAction('view', survey.id)
                                                },
                                                {
                                                    content: 'Duplicate',
                                                    icon: DuplicateIcon,
                                                    onAction: () => handleSurveyAction('duplicate', survey.id)
                                                },
                                                {
                                                    content: survey.status === 'Active' ? 'Deactivate' : 'Activate',
                                                    icon: survey.status === 'Active' ? DisabledIcon : InfoIcon,
                                                    onAction: () => handleSurveyAction('activate', survey.id)
                                                },
                                                {
                                                    content: 'Delete',
                                                    icon: DeleteIcon,
                                                    destructive: true,
                                                    onAction: () => handleSurveyAction('delete', survey.id)
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
        </Page>
    );
}