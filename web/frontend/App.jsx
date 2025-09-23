import { RouterProvider } from "react-router-dom";
import routes from "./Routes/Route.jsx";
import "@shopify/polaris/build/esm/styles.css";
import "./assets/App.css";
import { NavMenu } from "@shopify/app-bridge-react";
import { PolarisProvider } from "./components/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./components/helper/toast-helper.jsx";
import { Frame } from "@shopify/polaris";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});
/**
 * Main App Component
 */
export default function App() {
    return (
        <PolarisProvider>
            <Frame>
                <ToastProvider>
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={routes} />
                    </QueryClientProvider>
                </ToastProvider>
            </Frame>
            <NavMenu>
                <a href="/" rel="home">
                    Home
                </a>
                <a href="/survey">Survey</a>
                <a href="/post-purchase-email">Post Purchase Email</a>
                <a href="/response">Response</a>
                <a href="/analytics">Analytics</a>
                <a href="/integrations">Integrations</a>
            </NavMenu>
        </PolarisProvider>
    );
}