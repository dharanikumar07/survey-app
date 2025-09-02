import React, { useState, useCallback, useEffect } from "react";
import {
    Page,
    Layout,
    Card,
    Text,
    BlockStack,
    Box,
    Button,
    InlineGrid,
    Select,
    ChoiceList,
    DatePicker,
    Popover,
    Icon,
    Banner,
    Tag,
    ButtonGroup,
    ActionList
} from "@shopify/polaris";
import { CalendarIcon, ChartDonutIcon, ChartVerticalFilledIcon } from "@shopify/polaris-icons";

function Analytics() {
    // State for survey selection
    const [selectedSurvey, setSelectedSurvey] = useState("3");
    const surveyOptions = [
        { label: "Survey #1", value: "1" },
        { label: "Survey #2", value: "2" },
        { label: "Survey #3", value: "3" },
    ];

    // State for date range selection
    const [dateRange, setDateRange] = useState("last_30_days");
    const [datePickerActive, setDatePickerActive] = useState(false);
    const [selectedDates, setSelectedDates] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)),
        end: new Date(),
    });

    // Date picker state
    const [{ month, year }, setDate] = useState({
        month: selectedDates.start.getMonth(),
        year: selectedDates.start.getFullYear(),
    });

    const dateRangeOptions = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Last 7 days", value: "last_7_days" },
        { label: "Last 30 days", value: "last_30_days" },
        { label: "Last 90 days", value: "last_90_days" },
        { label: "Custom", value: "custom" },
    ];

    // State for channel selection
    const [selectedChannel, setSelectedChannel] = useState("all");
    const [channelPopoverActive, setChannelPopoverActive] = useState(false);
    const channelOptions = [
        { label: "All channels", value: "all" },
        { label: "Post-purchase", value: "post_purchase" },
        { label: "Email", value: "email" },
        { label: "Website", value: "website" },
    ];

    // State for question filter
    const [selectedQuestion, setSelectedQuestion] = useState("where_did_you_find_us");
    const [questionPopoverActive, setQuestionPopoverActive] = useState(false);
    const questionOptions = [
        { label: "Where did you find us?", value: "where_did_you_find_us" },
        { label: "How was your experience?", value: "how_was_your_experience" },
        { label: "Would you recommend us?", value: "would_you_recommend" },
    ];

    // Mock data
    const conversionRate = 0;
    const timesDisplayed = 0;
    const hasAnswerRateData = false;
    const emailEnabled = false;

    // Update date picker month/year when selected dates change
    useEffect(() => {
        if (selectedDates.start) {
            setDate({
                month: selectedDates.start.getMonth(),
                year: selectedDates.start.getFullYear(),
            });
        }
    }, [selectedDates.start]);

    // Handle date range selection
    const handleDateRangeChange = useCallback((value) => {
        console.log("handleDateRangeChange", value);
        setDateRange(value);
        if (value !== "custom") {
            setDatePickerActive(false);

            const end = new Date();
            let start = new Date();

            switch (value) {
                case "today":
                    // Start is already today
                    break;
                case "yesterday":
                    start = new Date(new Date().setDate(new Date().getDate() - 1));
                    end.setDate(end.getDate() - 1);
                    break;
                case "last_7_days":
                    start = new Date(new Date().setDate(new Date().getDate() - 7));
                    break;
                case "last_30_days":
                    start = new Date(new Date().setDate(new Date().getDate() - 30));
                    break;
                case "last_90_days":
                    start = new Date(new Date().setDate(new Date().getDate() - 90));
                    break;
                default:
                    break;
            }

            setSelectedDates({ start, end });
        } else {
            setDatePickerActive(true);
        }
    }, []);

    const handleDatePickerChange = useCallback(({ start, end }) => {
        setSelectedDates({ start, end });
    }, []);

    const handleMonthChange = useCallback((month, year) => {
        setDate({ month, year });
    }, []);

    const handleQuestionSelection = useCallback((questionValue) => {
        setSelectedQuestion(questionValue);
        setQuestionPopoverActive(false);
    }, []);

    // Format the date range for display
    const formatDateRange = useCallback(() => {
        if (dateRange === "custom") {
            const formatDate = (date) => {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            };
            return `${formatDate(selectedDates.start)} - ${formatDate(selectedDates.end)}`;
        }

        const option = dateRangeOptions.find(option => option.value === dateRange);
        return option ? option.label : "Last 30 days";
    }, [dateRange, selectedDates, dateRangeOptions]);

    return (
        <Page title="Analytics">
            <Layout>
                <Layout.Section>
                    <BlockStack gap="400">
                        {/* Filter controls */}
                        <InlineGrid columns={{ xs: 1, sm: 3 }} gap="300">
                            <Select
                                label=""
                                labelHidden
                                options={surveyOptions}
                                value={selectedSurvey}
                                onChange={setSelectedSurvey}
                            />

                            <Popover
                                active={datePickerActive}
                                activator={
                                    <Button
                                        icon={CalendarIcon}
                                        onClick={() => setDatePickerActive(!datePickerActive)}
                                    >
                                        {formatDateRange()}
                                    </Button>
                                }
                                onClose={() => setDatePickerActive(false)}
                            >
                                <Popover.Pane>
                                    <div style={{ padding: "16px" }}>
                                        <BlockStack gap="400">
                                            <ChoiceList
                                                title="Date range"
                                                choices={dateRangeOptions}
                                                selected={[dateRange]}
                                                onChange={(selected) => handleDateRangeChange(selected[0])}
                                            />

                                            {dateRange === "custom" && (
                                                <div style={{ padding: "8px 0" }}>
                                                    <DatePicker
                                                        month={month}
                                                        year={year}
                                                        onChange={handleDatePickerChange}
                                                        selected={selectedDates}
                                                        onMonthChange={handleMonthChange}
                                                        allowRange
                                                    />
                                                </div>
                                            )}
                                        </BlockStack>
                                    </div>
                                </Popover.Pane>
                            </Popover>

                            <div style={{ textAlign: "right" }}>
                                <Popover
                                    active={channelPopoverActive}
                                    activator={
                                        <Button onClick={() => setChannelPopoverActive(!channelPopoverActive)}>
                                            Channel
                                        </Button>
                                    }
                                    onClose={() => setChannelPopoverActive(false)}
                                >
                                    <Popover.Pane>
                                        <div style={{ padding: "16px", minWidth: "200px" }}>
                                            <ChoiceList
                                                title="Channel"
                                                choices={channelOptions}
                                                selected={[selectedChannel]}
                                                onChange={(selected) => {
                                                    setSelectedChannel(selected[0]);
                                                    setChannelPopoverActive(false);
                                                }}
                                            />
                                        </div>
                                    </Popover.Pane>
                                </Popover>
                            </div>
                        </InlineGrid>

                        {/* Metrics cards */}
                        <InlineGrid columns={{ xs: 1, sm: 3 }} gap="400">
                            {/* Conversion rate */}
                            <Card>
                                <BlockStack gap="300">
                                    <Text as="h3" variant="headingSm">Conversion rate</Text>
                                    <div>
                                        <Text as="p" variant="heading2xl">
                                            {conversionRate}%
                                        </Text>
                                        <Text as="p" variant="bodySm" color="subdued">
                                            of responses were submitted, while this survey was displayed {timesDisplayed} times
                                        </Text>
                                    </div>
                                    <div style={{
                                        backgroundColor: "#FFF4F4",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        height: "120px"
                                    }}>
                                        {/* Empty chart placeholder */}
                                    </div>
                                </BlockStack>
                            </Card>

                            {/* Answer rate per question */}
                            <Card>
                                <BlockStack gap="300">
                                    <Text as="h3" variant="headingSm">Answer rate per question</Text>
                                    <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {!hasAnswerRateData ? (
                                            <Text as="p" variant="bodyMd" color="subdued">
                                                There was no data found for this date range.
                                            </Text>
                                        ) : (
                                            <div>{/* Chart would go here */}</div>
                                        )}
                                    </div>
                                </BlockStack>
                            </Card>

                            {/* Emails sent */}
                            <Card>
                                <BlockStack gap="300">
                                    <Text as="h3" variant="headingSm">Emails sent</Text>
                                    <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
                                        {!emailEnabled ? (
                                            <Text as="p" variant="bodyMd" alignment="center" color="subdued">
                                                Enable "Post-purchase email" channel to start collecting email sent data
                                            </Text>
                                        ) : (
                                            <div>{/* Email stats would go here */}</div>
                                        )}
                                    </div>
                                </BlockStack>
                            </Card>
                        </InlineGrid>

                        {/* Question filter */}

                        <Box padding="400">
                            <Popover
                                active={questionPopoverActive}
                                activator={
                                    <Button
                                        onClick={() => setQuestionPopoverActive(!questionPopoverActive)}
                                        disclosure
                                    >
                                        {questionOptions.find(q => q.value === selectedQuestion)?.label || "Select a question"}
                                    </Button>
                                }
                                onClose={() => setQuestionPopoverActive(false)}
                            >
                                <ActionList
                                    items={questionOptions.map(question => ({
                                        content: question.label,
                                        onAction: () => handleQuestionSelection(question.value)
                                    }))}
                                />
                            </Popover>
                        </Box>

                        {/* Analytics Results Section */}
                        <InlineGrid columns={{ xs: 1, sm: 2 }} gap="400">
                            {/* Number of votes per answer */}
                            <Card>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <Text as="h3" variant="headingSm">Number of votes per answer</Text>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <ButtonGroup variant="segmented">
                                            <Button
                                                size="slim"
                                                icon={ChartVerticalFilledIcon}
                                            />
                                            <Button
                                                size="slim"
                                                icon={ChartDonutIcon}
                                            />
                                        </ButtonGroup>
                                    </div>
                                </div>
                                <div style={{
                                    height: '180px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text as="p" variant="bodyMd" color="subdued">
                                        There was no data found for this date range.
                                    </Text>
                                </div>
                            </Card>

                            {/* Trends */}
                            <Card>
                                <BlockStack gap="300">
                                    <Text as="h3" variant="headingSm">Trends</Text>
                                    <div style={{
                                        height: '180px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text as="p" variant="bodyMd" color="subdued">
                                            There was no data found for this date range.
                                        </Text>
                                    </div>
                                </BlockStack>
                            </Card>
                        </InlineGrid>
                    </BlockStack>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Analytics;