import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import ExitIframe from "../pages/ExitIframe.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/ExitIframe",
        element: <ExitIframe />,
    },
]);

export default router;
