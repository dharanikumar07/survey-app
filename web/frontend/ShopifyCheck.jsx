import React, { useEffect, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAppContext } from "@/api/app-provider";
import {useShopify} from "./shopify-page-auth.jsx";
import {axiosClient} from "./api.js";
const ShopifyCheck= ({ children }) => {
    const navigate = useNavigate();
    // const { dispatch } = useAppContext();
    const { isShopifyInstallRequest, isShopifyRequest } = useShopify();

    const [isLoading, setIsLoading] = useState(
        isShopifyRequest || isShopifyInstallRequest,
    );

    const storeTokens = (data) => {
        const { access_token, refresh_token, organization_id } = data;
        if (access_token) {
            localStorage.setItem(
                import.meta.env.VITE_ACCESS_TOKEN_NAME,
                access_token,
            );
            localStorage.setItem(
                import.meta.env.VITE_REFRESH_TOKEN_NAME,
                refresh_token,
            );
            localStorage.setItem(
                import.meta.env.VITE_ORGANIZATION_KEY,
                `"${organization_id}"`,
            );
        }
    };

    const getAuthUrl = async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.has("hmac")) return;

            // Get stored tokens
            const accessToken = localStorage.getItem(
                import.meta.env.VITE_ACCESS_TOKEN_NAME,
            );
            const refreshToken = localStorage.getItem(
                import.meta.env.VITE_REFRESH_TOKEN_NAME,
            );
            const requiresNavigation = !(accessToken && refreshToken);

            // Append tokens if available
            if (accessToken) urlParams.set("access_token", accessToken);
            if (refreshToken) urlParams.set("refresh_token", refreshToken);

            const requestData = Object.fromEntries(urlParams.entries());
            // const { data } = await axiosClient.post("/api/auth/callback", requestData);
            const { data } = await axiosClient.post("/api/shopify/access", requestData);
            console.log(data);
            if (!data) return;

            //storeTokens(data);

            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            } else if (requiresNavigation && data.user) {
                // dispatch({
                //     type: "SET_USER",
                //     payload: {
                //         id: data.user.id,
                //         name: data.user.name,
                //         email_verified_at: data.user.email_verified_at,
                //         email: data.user.email,
                //         integration_configured:
                //         data.user.integration_configured,
                //         integration: data.user.integration,
                //         organizations: data.user.organizations,
                //     },
                // });
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Authentication error:", error);
        }
    };

    useEffect(() => {
        if (isShopifyInstallRequest || isShopifyRequest) {
            getAuthUrl();
        }
    }, [isShopifyInstallRequest, isShopifyRequest]);

    if (isLoading) {
        return <div className="loader"></div>;
    } else {
        return <>{children}</>;
    }
};

export default ShopifyCheck;
