import React, { useState, useCallback, useEffect, useMemo } from "react";
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
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import useAnalyticsApi from "./action/use-analytics-api";
import { useQueryEvents } from "../../components/helper/use-query-event";
import { useQuery } from "@tanstack/react-query";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

function Analytics() {
    // State for survey selection
    const [selectedSurvey, setSelectedSurvey] = useState("");

    // Local state for analytics data
    const [analyticsData, setAnalyticsData] = useState(null);

    const { getAnalytics } = useAnalyticsApi();
    const { data: rawAnalyticsData, isLoading: isAnalyticsLoading } = useQueryEvents(
        useQuery({
            queryKey: ["analytics"],
            queryFn: getAnalytics,
        }),
        {
            onSuccess: (data) => {
                console.log("rawAnalyticsData", data.data.data);
                // Set the actual data from the nested structure
                setAnalyticsData(data?.data?.data || null);
            },
            onError: (error) => {
                console.log("error", error);
                setAnalyticsData(null);
            }
        }
    );

    // Generate survey options from API data
    const surveyOptions = useMemo(() => {
        if (!analyticsData?.surveys?.surveys) return [];

        return Object.entries(analyticsData.surveys.surveys).map(([uuid, survey]) => ({
            label: survey.name,
            value: uuid
        }));
    }, [analyticsData]);

    // Set default selected survey when data loads
    useEffect(() => {
        if (analyticsData?.surveys?.highest_response_survey?.uuid && !selectedSurvey) {
            setSelectedSurvey(analyticsData.surveys.highest_response_survey.uuid);
        }
    }, [analyticsData, selectedSurvey]);

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
    const [selectedQuestion, setSelectedQuestion] = useState("rating");
    const [questionPopoverActive, setQuestionPopoverActive] = useState(false);

    // State for chart type toggle
    const [chartType, setChartType] = useState('bar');

    // Calculate metrics from API data
    const selectedSurveyData = useMemo(() => {
        if (!analyticsData?.surveys?.surveys || !selectedSurvey) return null;
        return analyticsData.surveys.surveys[selectedSurvey];
    }, [analyticsData, selectedSurvey]);

    // Generate question options based on selected survey data
    const questionOptions = useMemo(() => {
        if (!selectedSurveyData?.questions) return [];

        const questions = selectedSurveyData.questions;
        const options = [];

        if (questions.rating) {
            options.push({ label: "Rating", value: "rating" });
        }
        if (questions.satisfaction) {
            options.push({ label: "Satisfaction", value: "satisfaction" });
        }
        if (questions['number-scale']) {
            options.push({ label: "Number Scale", value: "number-scale" });
        }
        if (questions.short_answer) {
            options.push({ label: "Short Answer", value: "short_answer" });
        }
        if (questions.single) {
            options.push({ label: "Single Choice", value: "single" });
        }
        if (questions.multiple) {
            options.push({ label: "Multiple Choice", value: "multiple" });
        }

        return options;
    }, [selectedSurveyData]);

    // Set default selected question when survey data changes
    useEffect(() => {
        if (questionOptions.length > 0 && !questionOptions.find(q => q.value === selectedQuestion)) {
            setSelectedQuestion(questionOptions[0].value);
        }
    }, [questionOptions, selectedQuestion]);

    const conversionRate = useMemo(() => {
        if (!selectedSurveyData) return 0;
        // For now, we'll use total_responses as a proxy for conversion rate
        // In a real implementation, you'd need display count data
        return selectedSurveyData.total_responses > 0 ? 100 : 0;
    }, [selectedSurveyData]);

    const timesDisplayed = useMemo(() => {
        // This would need to come from your API - for now using total_responses as proxy
        return selectedSurveyData?.total_responses || 0;
    }, [selectedSurveyData]);

    const hasAnswerRateData = useMemo(() => {
        if (!selectedSurveyData?.questions) return false;

        const questions = selectedSurveyData.questions;
        return Object.values(questions).some(questionData => {
            if (typeof questionData === 'object' && questionData !== null) {
                return Object.values(questionData).some(value =>
                    typeof value === 'number' && value > 0
                );
            }
            return false;
        });
    }, [selectedSurveyData]);

    const emailEnabled = useMemo(() => {
        return selectedSurveyData?.type === 'post_purchase';
    }, [selectedSurveyData]);

    // Chart data for ratings distribution from selected survey
    const ratingsChartData = useMemo(() => {
        if (!selectedSurveyData?.questions?.rating) return null;

        const { stars_1, stars_2, stars_3, stars_4, stars_5 } = selectedSurveyData.questions.rating;

        return {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [
                {
                    label: 'Number of Ratings',
                    data: [stars_1, stars_2, stars_3, stars_4, stars_5],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [selectedSurveyData]);

    // Chart data for question types from selected survey
    const questionTypesChartData = useMemo(() => {
        if (!selectedSurveyData?.questions) return null;

        const questions = selectedSurveyData.questions;
        const textCount = questions.short_answer?.total_count || 0;
        const satisfactionCount = Object.values(questions.satisfaction || {}).reduce((sum, count) => sum + count, 0);
        const ratingCount = Object.values(questions.rating || {}).reduce((sum, count) => sum + count, 0);
        const numberScaleCount = Object.values(questions['number-scale'] || {}).reduce((sum, count) => sum + count, 0);
        const multipleCount = questions.multiple?.total_count || 0;
        const singleCount = questions.single?.total_count || 0;

        return {
            labels: ['Text', 'Satisfaction', 'Rating', 'Number Scale', 'Multiple Choice', 'Single Choice'],
            datasets: [
                {
                    label: 'Response Count',
                    data: [textCount, satisfactionCount, ratingCount, numberScaleCount, multipleCount, singleCount],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [selectedSurveyData]);

    // Chart data for satisfaction responses from selected survey
    const satisfactionChartData = useMemo(() => {
        if (!selectedSurveyData?.questions?.satisfaction) return null;

        const { not_satisfied, dissatisfied, neutral, satisfied, very_satisfied } = selectedSurveyData.questions.satisfaction;

        return {
            labels: ['Not Satisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
            datasets: [
                {
                    label: 'Number of Responses',
                    data: [not_satisfied, dissatisfied, neutral, satisfied, very_satisfied],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [selectedSurveyData]);

    // Chart data for number-scale responses from selected survey
    const numberScaleChartData = useMemo(() => {
        if (!selectedSurveyData?.questions?.['number-scale']) return null;

        const { poor, fair, good, very_good, excellent } = selectedSurveyData.questions['number-scale'];

        return {
            labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
            datasets: [
                {
                    label: 'Number of Responses',
                    data: [poor, fair, good, very_good, excellent],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [selectedSurveyData]);

    // Chart data for page types
    const pageTypesChartData = useMemo(() => {
        if (!analyticsData?.overall?.page_type_counts) return null;

        const pageTypes = analyticsData.overall.page_type_counts;

        return {
            labels: Object.keys(pageTypes).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
            datasets: [
                {
                    label: 'Page Views',
                    data: Object.values(pageTypes),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    }, [analyticsData]);

    // Get chart data based on selected question
    const getQuestionChartData = useMemo(() => {
        if (!selectedSurveyData?.questions || !selectedQuestion) return null;

        const questionData = selectedSurveyData.questions[selectedQuestion];
        if (!questionData) return null;

        switch (selectedQuestion) {
            case 'rating':
                return ratingsChartData;
            case 'satisfaction':
                return satisfactionChartData;
            case 'number-scale':
                return numberScaleChartData;
            case 'short_answer':
            case 'single':
            case 'multiple':
                return {
                    labels: ['Responses'],
                    datasets: [{
                        label: 'Number of Responses',
                        data: [questionData.total_count || 0],
                        backgroundColor: ['rgba(75, 192, 192, 0.6)'],
                        borderColor: ['rgba(75, 192, 192, 1)'],
                        borderWidth: 1,
                    }],
                };
            default:
                return null;
        }
    }, [selectedSurveyData, selectedQuestion, ratingsChartData, satisfactionChartData, numberScaleChartData]);

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

    // Handle chart type toggle
    const handleChartTypeToggle = useCallback((type) => {
        setChartType(type);
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

    // Show loading state while data is being fetched
    if (isAnalyticsLoading) {
        return (
            <Page title="Analytics">
                <Layout>
                    <Layout.Section>
                        <Card>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '200px'
                            }}>
                                <Text as="p" variant="bodyLg">Loading analytics data...</Text>
                            </div>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    return (
        <Page title="Analytics">
            <Layout>
                <Layout.Section>
                    <BlockStack gap="400">
                        {/* Summary Statistics */}
                        {analyticsData && (
                            <InlineGrid columns={{ xs: 1, sm: 4 }} gap="300">
                                <Card>
                                    <BlockStack gap="200">
                                        <Text as="h3" variant="headingSm">Total Responses</Text>
                                        <Text as="p" variant="heading2xl">
                                            {selectedSurveyData?.total_responses || 0}
                                        </Text>
                                    </BlockStack>
                                </Card>
                                <Card>
                                    <BlockStack gap="200">
                                        <Text as="h3" variant="headingSm">Survey Type</Text>
                                        <Text as="p" variant="heading2xl">
                                            {selectedSurveyData?.type?.replace('_', ' ') || 'N/A'}
                                        </Text>
                                    </BlockStack>
                                </Card>
                                <Card>
                                    <BlockStack gap="200">
                                        <Text as="h3" variant="headingSm">Rating Responses</Text>
                                        <Text as="p" variant="heading2xl">
                                            {selectedSurveyData?.questions?.rating ?
                                                Object.values(selectedSurveyData.questions.rating).reduce((sum, count) => sum + count, 0) : 0}
                                        </Text>
                                    </BlockStack>
                                </Card>
                                <Card>
                                    <BlockStack gap="200">
                                        <Text as="h3" variant="headingSm">Satisfaction Responses</Text>
                                        <Text as="p" variant="heading2xl">
                                            {selectedSurveyData?.questions?.satisfaction ?
                                                Object.values(selectedSurveyData.questions.satisfaction).reduce((sum, count) => sum + count, 0) : 0}
                                        </Text>
                                    </BlockStack>
                                </Card>
                            </InlineGrid>
                        )}

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
                                        backgroundColor: "#F6F6F7",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        height: "120px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        {ratingsChartData ? (
                                            <div style={{ width: "100%", height: "100%" }}>
                                                <Bar
                                                    data={ratingsChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                display: false
                                                            }
                                                        },
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                                ticks: {
                                                                    stepSize: 1
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <Text as="p" variant="bodySm" color="subdued">
                                                No rating data available
                                            </Text>
                                        )}
                                    </div>
                                </BlockStack>
                            </Card>

                            {/* Answer rate per question */}
                            <Card>
                                <BlockStack gap="300">
                                    <Text as="h3" variant="headingSm">Answer rate per question</Text>
                                    <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {questionTypesChartData ? (
                                            <div style={{ width: "100%", height: "100%" }}>
                                                <Pie
                                                    data={questionTypesChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'bottom',
                                                                labels: {
                                                                    boxWidth: 12,
                                                                    padding: 8
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <Text as="p" variant="bodyMd" color="subdued">
                                                No question data available
                                            </Text>
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
                                            <div style={{ textAlign: "center" }}>
                                                <Text as="p" variant="bodyMd" color="subdued">
                                                    Enable "Post-purchase email" channel to start collecting email sent data
                                                </Text>
                                                {selectedSurveyData && (
                                                    <Box padding="200">
                                                        <Tag>
                                                            Current: {selectedSurveyData.type === 'post_purchase' ? 'Post-purchase' : selectedSurveyData.type}
                                                        </Tag>
                                                    </Box>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ width: "100%", height: "100%" }}>
                                                <Text as="p" variant="headingLg">
                                                    {selectedSurveyData?.total_responses || 0}
                                                </Text>
                                                <Text as="p" variant="bodySm" color="subdued">
                                                    emails sent
                                                </Text>
                                            </div>
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
                                    <Text as="h3" variant="headingSm">
                                        {questionOptions.find(q => q.value === selectedQuestion)?.label || 'Question'} Responses
                                    </Text>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <ButtonGroup variant="segmented">
                                            <Button
                                                size="slim"
                                                icon={ChartVerticalFilledIcon}
                                                pressed={chartType === 'bar'}
                                                onClick={() => handleChartTypeToggle('bar')}
                                            />
                                            <Button
                                                size="slim"
                                                icon={ChartDonutIcon}
                                                pressed={chartType === 'pie'}
                                                onClick={() => handleChartTypeToggle('pie')}
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
                                    {getQuestionChartData ? (
                                        <div style={{ width: "100%", height: "100%" }}>
                                            {chartType === 'bar' ? (
                                                <Bar
                                                    data={getQuestionChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                display: false
                                                            }
                                                        },
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                                ticks: {
                                                                    stepSize: 1
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <Pie
                                                    data={getQuestionChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'bottom',
                                                                labels: {
                                                                    boxWidth: 12,
                                                                    padding: 8
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <Text as="p" variant="bodyMd" color="subdued">
                                            There was no data found for this question.
                                        </Text>
                                    )}
                                </div>
                            </Card>

                            {/* Trends */}
                            <Card>
                                <BlockStack gap="300">
                                    <Text as="h3" variant="headingSm">Page Type Distribution</Text>
                                    <div style={{
                                        height: '180px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {pageTypesChartData ? (
                                            <div style={{ width: "100%", height: "100%" }}>
                                                <Bar
                                                    data={pageTypesChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                display: false
                                                            }
                                                        },
                                                        scales: {
                                                            y: {
                                                                beginAtZero: true,
                                                                ticks: {
                                                                    stepSize: 1
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <Text as="p" variant="bodyMd" color="subdued">
                                                There was no data found for this date range.
                                            </Text>
                                        )}
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