import { apiClient } from "../../../api";

export function useShopInfo() {
    const getShopInfo = async () => {
        const response = await apiClient("GET", "/shop/info");
        return response;
    }
    return { getShopInfo };
}