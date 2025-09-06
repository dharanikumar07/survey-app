import { apiClient } from "../../../api";

export function useResponseApi() {
    const getResponses = async () => {
        const response = await apiClient('GET', '/response');
        return response;
    }
    return {
        getResponses
    }
}