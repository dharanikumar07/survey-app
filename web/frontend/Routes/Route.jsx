import { createBrowserRouter } from "react-router-dom";
import ExitIframe from "../pages/ExitIframe.jsx";
import Dashboard from "../features/Dashboard/Index.jsx";
import Survey from "../features/Survey/Index.jsx";
import Response from "../features/Response/Index.jsx";

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
