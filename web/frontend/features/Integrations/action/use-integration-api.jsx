import { apiClient } from "../../../api";

export function useIntegrationApi() {
    const getIntegrations = async () => {
        const response = await apiClient("GET", "/integrations");
        return response;
    }
    const saveIntegration = async (integration) => {
        const response = await apiClient("POST", "/integrations", integration);
        return response;
    }
    return {
        getIntegrations,
        saveIntegration
    }
}
