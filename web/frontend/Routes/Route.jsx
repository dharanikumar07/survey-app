import { createBrowserRouter } from "react-router-dom";
import ExitIframe from "../pages/ExitIframe.jsx";
import Dashboard from "../features/Dashboard/Index.jsx";
import Survey from "../features/Survey/Index.jsx";
import Response from "../features/Response/Index.jsx";
import TemplateSelection from "../features/Survey/TemplateSelection.jsx";
import SurveyForm from "../features/Survey/SurveyForm.jsx";
import AISurveyCreation from "../features/Survey/components/AI/Index.jsx";
import Analytics from "../features/Analytics/Index.jsx";
import Integrations from "../features/Integrations/Index.jsx";
import KlaviyoIntegration from "../features/Integrations/Klaviyo/Klaviyo.jsx";
import RetainfulIntegration from "../features/Integrations/Retainful/Retainful.jsx";
import GoogleAnalyticsIntegration from "../features/Integrations/GoogleAnalytics/GoogleAnalytics.jsx";
import PostPurchaseEmail from "../features/PostPurchaseEmail/Index.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/survey",
        element: <Survey />,
    },
    {
        path: "/post-purchase-email",
        element: <PostPurchaseEmail />,
    },
    {
        path: "/survey/templates",
        element: <TemplateSelection />,
    },
    {
        path: "/survey/create",
        element: <SurveyForm />,
    },
    {
        path: "/survey/ai-create",
        element: <AISurveyCreation />,
    },
    {
        path: "/survey/edit/:uuid",
        element: <SurveyForm />,
    },
    {
        path: "/response",
        element: <Response />,
    },
    {
        path: "/analytics",
        element: <Analytics />,
    },
    {
        path: "/integrations",
        element: <Integrations />,
    },
    {
        path: "/integrations/klaviyo",
        element: <KlaviyoIntegration />,
    },
    {
        path: "/integrations/retainful",
        element: <RetainfulIntegration />,
    },
    {
        path: "/integrations/google-analytics",
        element: <GoogleAnalyticsIntegration />,
    },
    {
        path: "/ExitIframe",
        element: <ExitIframe />,
    },
]);

export default router;