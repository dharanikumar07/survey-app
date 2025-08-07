import { RouterProvider } from "react-router-dom";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import routes from "./Routes/Route.jsx";
import "@shopify/polaris/build/esm/styles.css";
import { getPolarisTranslations } from "./utils/i18nUtils";
import "./assets/App.css";
import { NavMenu } from "@shopify/app-bridge-react";

/**
 * Main App Component
 */
export default function App() {
    const translations = getPolarisTranslations();

    return (
        <PolarisProvider i18n={translations}>
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
