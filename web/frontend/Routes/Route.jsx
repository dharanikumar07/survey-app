import { createBrowserRouter } from "react-router-dom";
import ExitIframe from "../pages/ExitIframe.jsx";
import Dashboard from "../features/Dashboard/Index.jsx";
import Survey from "../features/Survey/Index.jsx";
import Response from "../features/Response/Index.jsx";
import TemplateSelection from "../features/Survey/TemplateSelection.jsx";
import SurveyForm from "../features/Survey/SurveyForm.jsx";
import AISurveyCreation from "../features/Survey/components/AI/Index.jsx";

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
        element: <Response />,
    },
    {
        path: "/ExitIframe",
        element: <ExitIframe />,
    },
]);

export default router;
