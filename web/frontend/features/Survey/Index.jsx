import { useState } from "react";
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
    ActionList
} from "@shopify/polaris";
import { Modal, TitleBar } from '@shopify/app-bridge-react';
import {
    MenuVerticalIcon,
    InfoIcon,
    DuplicateIcon,
    EditIcon,
    DeleteIcon,
    ViewIcon,
    DisabledIcon
} from "@shopify/polaris-icons";
import ModalHeader from "./components/ModalHeader";
import SurveyModalContent from "./components/SurveyModalContent";
import { PolarisProvider } from "../../components/providers";
import { PortalsManager } from "@shopify/polaris";

export default function Survey() {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalTitle, setModalTitle] = useState("Create new survey");
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

    // Filter surveys based on active tab
    const filteredSurveys = mockSurveys.filter(survey => {
        if (activeTab === 0) return true; // All
        if (activeTab === 1) return survey.status === "Active"; // Active
        if (activeTab === 2) return survey.status === "Inactive"; // Inactive
        return true;
    });

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

    const handleTabChange = (selectedTabIndex) => setActiveTab(selectedTabIndex);

    const handleCreateSurvey = () => {
        setModalTitle("Create new survey");
        setModalOpen(true);
    };

    const handleEditSurvey = (surveyId) => {
        setModalTitle(`Edit survey #${surveyId}`);
        setModalOpen(true);
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

                <Card>
                    <Tabs tabs={tabs} selected={activeTab} onSelect={handleTabChange} />
                    <IndexTable
                        resourceName={resourceName}
                        itemCount={filteredSurveys.length}
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
                        {filteredSurveys.map((survey, index) => (
                            <IndexTable.Row
                                id={survey.id}
                                key={survey.id}
                                position={index}
                            >
                                <IndexTable.Cell>
                                    <Text variant="bodyMd" fontWeight="bold" as="a" onClick={() => handleEditSurvey(survey.id)} style={{ cursor: 'pointer', color: '#2c6ecb' }}>
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
                                    <BlockStack gap="100">
                                        {survey.channels.map((channel, idx) => (
                                            <Badge key={idx} tone="info">{channel}</Badge>
                                        ))}
                                    </BlockStack>
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
                                            <Button plain monochrome icon={MenuVerticalIcon} onClick={(e) => {
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
                            <div style={{ marginLeft: '16px' }}>
                                <Text variant="bodySm" as="span">Showing {filteredSurveys.length} of {filteredSurveys.length} surveys</Text>
                            </div>
                            <div style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Text variant="bodySm" as="span">Items per page:</Text>
                                <ButtonGroup segmented>
                                    <Button size="slim" pressed>10</Button>
                                    <Button size="slim">25</Button>
                                    <Button size="slim">50</Button>
                                </ButtonGroup>
                            </div>
                        </InlineStack>
                    </Box>
                </Card>

                <Modal
                    id="survey-modal"
                    open={modalOpen}
                    variant="max"
                    onHide={() => setModalOpen(false)}
                >
                    <TitleBar title={modalTitle} />
                    <PolarisProvider>
                        <PortalsManager>
                            <div>
                                <ModalHeader />
                                <SurveyModalContent />
                            </div>
                        </PortalsManager>
                    </PolarisProvider>
                </Modal>
            </BlockStack>
        </Page>
    );
}
