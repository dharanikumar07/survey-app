// Mock data for survey responses
export const mockResponses = [
    {
        id: "9NXV6",
        surveyId: "1",
        surveyName: "Survey #1",
        date: "Aug 12, 2025 at 18:09 PM",
        status: "Active",
        questions: [
            {
                id: "q1",
                question: "How likely are you to recommend us to a friend?",
                answerType: "Number scale",
                answer: "8/10",
                questionType: "rating"
            },
            {
                id: "q2",
                question: "How easy was it to purchase from our online store?",
                answerType: "Number scale",
                answer: "8/10",
                questionType: "rating"
            },
            {
                id: "q3",
                question: "How could we improve?",
                answerType: "Short answer",
                answer: "nothing",
                questionType: "text"
            }
        ]
    },
    {
        id: "8MXV5",
        surveyId: "1",
        surveyName: "Survey #1",
        date: "Aug 11, 2025 at 15:30 PM",
        status: "Active",
        questions: [
            {
                id: "q1",
                question: "How likely are you to recommend us to a friend?",
                answerType: "Number scale",
                answer: "9/10",
                questionType: "rating"
            },
            {
                id: "q2",
                question: "How easy was it to purchase from our online store?",
                answerType: "Number scale",
                answer: "7/10",
                questionType: "rating"
            },
            {
                id: "q3",
                question: "How could we improve?",
                answerType: "Short answer",
                answer: "Faster shipping options",
                questionType: "text"
            }
        ]
    },
    {
        id: "7LXV4",
        surveyId: "2",
        surveyName: "Post-purchase Satisfaction",
        date: "Aug 10, 2025 at 12:45 PM",
        status: "Active",
        questions: [
            {
                id: "q1",
                question: "How satisfied are you with your purchase?",
                answerType: "Number scale",
                answer: "10/10",
                questionType: "rating"
            },
            {
                id: "q2",
                question: "Would you shop with us again?",
                answerType: "Yes/No",
                answer: "Yes",
                questionType: "boolean"
            }
        ]
    },
    {
        id: "6KXV3",
        surveyId: "1",
        surveyName: "Survey #1",
        date: "Aug 09, 2025 at 10:15 AM",
        status: "Active",
        questions: [
            {
                id: "q1",
                question: "How likely are you to recommend us to a friend?",
                answerType: "Number scale",
                answer: "6/10",
                questionType: "rating"
            },
            {
                id: "q2",
                question: "How easy was it to purchase from our online store?",
                answerType: "Number scale",
                answer: "5/10",
                questionType: "rating"
            },
            {
                id: "q3",
                question: "How could we improve?",
                answerType: "Short answer",
                answer: "Better mobile experience",
                questionType: "text"
            }
        ]
    },
            {
            id: "5JXV2",
            surveyId: "2",
            surveyName: "Post-purchase Satisfaction",
            date: "Aug 08, 2025 at 16:45 PM",
            status: "Active",
            questions: [
                {
                    id: "q1",
                    question: "How satisfied are you with your purchase?",
                    answerType: "Number scale",
                    answer: "8/10",
                    questionType: "rating"
                },
                {
                    id: "q2",
                    question: "Would you shop with us again?",
                    answerType: "Yes/No",
                    answer: "Yes",
                    questionType: "boolean"
                }
            ]
        },
        {
            id: "4IXV1",
            surveyId: "1",
            surveyName: "Survey #1",
            date: "Aug 07, 2025 at 14:20 PM",
            status: "Archived",
            questions: [
                {
                    id: "q1",
                    question: "How likely are you to recommend us to a friend?",
                    answerType: "Number scale",
                    answer: "7/10",
                    questionType: "rating"
                },
                {
                    id: "q2",
                    question: "How easy was it to purchase from our online store?",
                    answerType: "Number scale",
                    answer: "6/10",
                    questionType: "rating"
                },
                {
                    id: "q3",
                    question: "How could we improve?",
                    answerType: "Short answer",
                    answer: "Better customer service",
                    questionType: "text"
                }
            ]
        }
];

// Mock data for surveys
export const mockSurveys = [
    {
        id: "1",
        name: "Survey #1",
        status: "Active",
        questionCount: 3,
        responseCount: 125
    },
    {
        id: "2",
        name: "Post-purchase Satisfaction",
        status: "Active",
        questionCount: 2,
        responseCount: 83
    }
];

// Mock data for answer types
export const answerTypes = [
    "Number scale",
    "Short answer",
    "Yes/No",
    "Multiple choice",
    "Long answer",
    "Rating"
];

// Mock data for filters
export const filterOptions = [
    { label: "All responses", value: "all" },
    { label: "Survey #1", value: "survey1" },
    { label: "Post-purchase Satisfaction", value: "survey2" },
    { label: "Number scale", value: "number_scale" },
    { label: "Short answer", value: "short_answer" },
    { label: "Yes/No", value: "yes_no" }
];

// Mock data for sorting
export const sortOptions = [
    { label: "Date (Newest)", value: "date_desc" },
    { label: "Date (Oldest)", value: "date_asc" },
    { label: "Response ID", value: "id" },
    { label: "Survey Name", value: "survey" }
];
