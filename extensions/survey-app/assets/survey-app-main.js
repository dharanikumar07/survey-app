(function(){
    const store_uuid = window.PostPurchaseSurveyData.data.store_uuid;
    const url = window.PostPurchaseSurveyData.data.url;
    const iframeUrl = `${url}api/get-survey/${store_uuid}`;

    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.width = "600";
    iframe.height = "600";
    iframe.style.border = "none";
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.left = "20px";
    iframe.style.zIndex = "9999";
    iframe.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    iframe.style.borderRadius = "8px";
    iframe.allow = "fullscreen";

    document.body.appendChild(iframe);

    const surveyData = {
        questions: [
            {
                id: "1",
                content: "How likely are you to recommend us to a friend?",
                type: "rating",
                description: "",
                questionType: "Star rating",
                isDraggable: true,
                answerOptions: [
                    { id: "opt1", text: "1 - Not likely" },
                    { id: "opt2", text: "2 - Somewhat likely" },
                    { id: "opt3", text: "3 - Likely" },
                    { id: "opt4", text: "4 - Very likely" },
                    { id: "opt5", text: "5 - Extremely likely" }
                ]
            },
            {
                id: "2",
                content: "How easy was it to purchase from our online store?",
                type: "number-scale",
                description: "",
                questionType: "Number scale",
                isDraggable: true,
                answerOptions: [
                    { id: "opt7", text: "1 - Very difficult" },
                    { id: "opt8", text: "2 - Somewhat difficult" },
                    { id: "opt9", text: "3 - Neutral" },
                    { id: "opt10", text: "4 - Somewhat easy" },
                    { id: "opt11", text: "5 - Very easy" }
                ]
            },
            {
                id: "3",
                content: "How could we improve?",
                type: "text",
                description: "Please provide your feedback in detail.",
                questionType: "Short answer",
                isDraggable: true,
                answerOptions: []
            },
            {
                id: "4",
                content: "How did you hear about us?",
                type: "single-choice",
                description: "Select the option that best describes your answer.",
                questionType: "Single choice",
                isDraggable: true,
                answerOptions: [
                    { id: "opt12", text: "Word of mouth" },
                    { id: "opt13", text: "Social media" },
                    { id: "opt14", text: "Search engine" },
                    { id: "opt15", text: "Advertisement" },
                    { id: "opt16", text: "Other" }
                ]
            },
            {
                id: "5",
                content: "Which of our products have you used?",
                type: "multiple-choice",
                description: "Select all options that apply to you.",
                questionType: "Multiple choice",
                isDraggable: true,
                answerOptions: [
                    { id: "opt17", text: "Product A" },
                    { id: "opt18", text: "Product B" },
                    { id: "opt19", text: "Product C" },
                    { id: "opt20", text: "Service X" },
                    { id: "opt21", text: "Service Y" }
                ]
            },
            {
                id: "thankyou",
                content: "Thank You Card",
                type: "card",
                description: "",
                questionType: "Card",
                isDraggable: false,
                answerOptions: []
            }
        ],
        thankYou: {
            type: "thank_you",
            heading: "Thank You Card",
            description: null
        },
        channels: {
            dedicatedPageSurvey: {
                type: "dedicatedPageSurvey",
                enabled: false
            }
        },
        discount: {
            enabled: false,
            code: null,
            displayOn: "email",
            limitOnePerEmail: false
        },
        channelTypes: ["thankyou"],
        htmlContent: null,
        cleanHTML: null,
        completeHTML: "<!DOCTYPE html><html lang='en'>...</html>",
        createdAt: "2025-08-26T13:08:15.685Z",
        updatedAt: "2025-08-26T13:08:15.685Z"
    };

    iframe.onload = () => {
        iframe.contentWindow.postMessage({
            type: "INIT_SURVEY",
            data: {
                surveyData,
                selectedView: "desktop",
                initialQuestionIndex: 0
            }
        }, "*");

        // Simulate completed survey data after 3 seconds for testing
        setTimeout(() => {
            iframe.contentWindow.postMessage({
                type: "SURVEY_COMPLETE",
                data: {
                    answers: [
                        {
                            position: 4,
                            id: "5",
                            answers: [
                                { content: "Product A", id: "opt17" },
                                { content: "Product B", id: "opt18" },
                                { content: "Product C", id: "opt19" },
                                { content: "Service X", id: "opt20" },
                                { content: "Service Y", id: "opt21" }
                            ]
                        }
                    ],
                    thankYou: surveyData.thankYou
                }
            }, "*");
        }, 3000);
    };

    // Listen for real survey completion
    window.addEventListener("message", (event) => {
        if (event.data.type === "SURVEY_COMPLETE") {
            console.log("Survey answers:", event.data.data.answers);
        }
    });
})();
