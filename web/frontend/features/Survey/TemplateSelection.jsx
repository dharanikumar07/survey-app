import { useNavigate } from "react-router-dom";
import {
    Page,
    Card,
    BlockStack,
    Text,
    Button,
    Badge,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import surveyData from "./data/surveyData.json";

// Import template images
import blankTemplateImg from "../../assets/images/blank_template.png";
import marketingSurveyImg from "../../assets/images/marketing_survey.png";
import customerExpSurveyImg from "../../assets/images/customer_exp_survey.png";
import notPurchasingReasonImg from "../../assets/images/not_purchasing_reason.png";
import exitSurveyImg from "../../assets/images/exit_survey.png";

export default function TemplateSelection() {
    const navigate = useNavigate();
    const { templates } = surveyData;

    // Template data array
    const templateList = [
        {
            key: "blank",
            title: "Blank survey",
            description: templates.blank.description,
            image: blankTemplateImg,
            buttonText: "Create",
            badge: null,
        },
        {
            key: "marketing_attribution",
            title: "Marketing attribution",
            description: templates.marketing_attribution.description,
            image: marketingSurveyImg,
            buttonText: "Create",
            badge: { status: "magic", content: "Most popular" },
        },
        {
            key: "customer_experience",
            title: "Customer experience survey",
            description: templates.customer_experience.description,
            image: customerExpSurveyImg,
            buttonText: "Create",
            badge: null,
        },
        {
            key: "not_purchasing",
            title: "Reason for not purchasing",
            description: templates.not_purchasing.description,
            image: notPurchasingReasonImg,
            buttonText: "Create",
            badge: null,
        },
        {
            key: "exit_intent",
            title: "Exit intent",
            description: templates.exit_intent.description,
            image: exitSurveyImg,
            buttonText: "Create",
            badge: { status: "success", content: "New" },
        },
        {
            key: "ai_creation",
            title: "AI-assisted creation",
            description: "Tell us what you're looking for and our AI will create a custom survey for you.",
            image: null,
            buttonText: "Create with AI",
            badge: null,
            customContent: (
                <div className="text-center">
                    <div className="text-5xl mb-4">✨</div>
                    <div className="text-white text-xl font-bold">AI Generated</div>
                    <div className="text-white opacity-80 text-sm mt-1">Powered by Gemini ✨</div>
                </div>
            ),
            customBackground: "bg-gradient-to-r from-blue-500 to-purple-600"
        }
    ];

    const handleTemplateSelect = (templateKey) => {
        // Navigate to the AI creation page for AI template, otherwise to regular create route
        if (templateKey === "ai_creation") {
            navigate("/survey/ai-create");
        } else {
            // Navigate to the create route with template parameter
            navigate(`/survey/create?template=${templateKey}`);
        }
    };

    const handleBack = () => {
        navigate("/survey");
    };

    return (
        <Page
            title="Select template"
            subtitle="Choose a template for your survey or begin with a blank one."
            backAction={{
                content: "Back to surveys",
                onAction: handleBack,
                icon: ArrowLeftIcon
            }}
        >
            <BlockStack gap="600">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templateList.map((template) => (
                        <div
                            key={template.key}
                            onClick={() => handleTemplateSelect(template.key)}
                            className="cursor-pointer"
                        >
                            <Card padding="500">
                                <BlockStack gap="400">
                                    <div className={`flex justify-center items-center h-48 rounded-md ${template.customBackground || 'bg-gray-50'}`}>
                                        {template.image ? (
                                            <img
                                                src={template.image}
                                                alt={template.title}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            template.customContent
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Text variant="headingMd" as="h3">{template.title}</Text>
                                        {template.badge && (
                                            <Badge tone={template.badge.status}>{template.badge.content}</Badge>
                                        )}
                                    </div>
                                    <Text variant="bodyMd" as="p" color="subdued">{template.description}</Text>
                                    <Button variant="primary">{template.buttonText}</Button>
                                </BlockStack>
                            </Card>
                        </div>
                    ))}
                </div>
            </BlockStack>
        </Page>
    );
}