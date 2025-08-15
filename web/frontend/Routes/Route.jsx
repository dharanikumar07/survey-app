import { createBrowserRouter } from "react-router-dom";
import ExitIframe from "../pages/ExitIframe.jsx";
import Dashboard from "../features/Dashboard/Index.jsx";
import Survey from "../features/Survey/Index.jsx";
import Settings from "../features/Settings/Index.jsx";

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
        element: <Settings />,
    },
    {
        path: "/analytics",
        element: <Settings />,
    },
    {
        path: "/ExitIframe",
        element: <ExitIframe />,
    },
]);

export default router;
