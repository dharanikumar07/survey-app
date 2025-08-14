import React, { createContext, useContext, useState } from "react";
import { Toast } from "@shopify/polaris";

// Create context with default values
export const ToastContext = createContext(
    undefined
);

export const ToastProvider = ({ children }) => {
    // State to manage the current toast configuration
    const [toastConfig, setToastConfig] = useState(null);

    // Function to show a toast
    const showToast = ({
        message,
        duration = 3000, // Default duration: 3 seconds
        type = "success", // Default type: 'success'
    }) => {
        setToastConfig({ message, duration, type });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Render the Toast component if toastConfig is not null */}
            {toastConfig && (
                <Toast
                    content={toastConfig.message}
                    onDismiss={() => setToastConfig(null)} // Clear the toast on dismiss
                    duration={toastConfig.duration}
                    error={toastConfig.type === "error"} // Apply error styling if type is 'error'
                />
            )}
        </ToastContext.Provider>
    );
};

// Custom hook to use the Toast context
export const useToast = () => {
    const context = useContext(ToastContext);

    // Throw an error if the hook is used outside of a ToastProvider
    if (!context) {
        throw new Error(
            "useToast must be used within a ToastProvider. Ensure your app is wrapped with ToastProvider."
        );
    }

    return context;
};
