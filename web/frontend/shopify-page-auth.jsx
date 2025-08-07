import { createContext, useContext, useEffect, useState } from "react";

const ShopifyContext = createContext(undefined);

export const ShopifyProvider = ({
         children,
     }) => {
    const [loading, setLoading] = useState(true);
    const [isShopifyInstallRequest, setIsShopifyInstallRequest] =
        useState(false);
    const [isShopifyRequest, setIsShopifyRequest] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        const hasShopifyParams =
            urlParams.has("shop") &&
            urlParams.has("hmac") &&
            urlParams.has("timestamp") &&
            urlParams.has("host");

        const isInstallRequest =
            hasShopifyParams &&
            !urlParams.has("embedded") &&
            !urlParams.has("id_token") &&
            !urlParams.has("session");

        setIsShopifyInstallRequest(isInstallRequest);
        setIsShopifyRequest(hasShopifyParams);
        setLoading(false);
    }, []);

    return (
        <ShopifyContext.Provider
            value={{ isShopifyInstallRequest, isShopifyRequest, loading }}
        >
            {children}
        </ShopifyContext.Provider>
    );
};

export const useShopify = () => {
    const context = useContext(ShopifyContext);
    if (!context) {
        throw new Error("useShopify must be used within a ShopifyProvider");
    }
    return context;
};
