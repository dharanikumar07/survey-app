import { apiClient } from "../../../api";

export function useIntegrationApi() {
    const getIntegrationData = async () => {
        const response = await apiClient("GET", "/integrations/data");
        return response;
    };

    return {
        getIntegrationData
    };
}