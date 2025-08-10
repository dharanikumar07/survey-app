import { RouterProvider } from "react-router-dom";
import routes from "./Routes/Route.jsx";
import "@shopify/polaris/build/esm/styles.css";
import "./assets/App.css";
import { NavMenu } from "@shopify/app-bridge-react";
import {
    PolarisProvider,
} from "./components";
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
