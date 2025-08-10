import { RouterProvider } from "react-router-dom";
import { PolarisProvider } from "./components/providers/PolarisProvider.jsx";
import routes from "./Routes/Route.jsx";
import "@shopify/polaris/build/esm/styles.css";
import "./assets/App.css";
import { NavMenu } from "@shopify/app-bridge-react";

/**
 * Main App Component
 */
export default function App() {
    return (
        <PolarisProvider>
            <RouterProvider router={routes} />
            <NavMenu>
                <a href="/" rel="home">
                    Home
                </a>
                <a href="/settings">Settings</a>
            </NavMenu>
        </PolarisProvider>
    );
}
