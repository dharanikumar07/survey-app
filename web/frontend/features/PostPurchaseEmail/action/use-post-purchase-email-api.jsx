import { apiClient } from "../../../api";

export function usePostPurchaseEmailApi() {
    /**
     * Fetch post purchase email data for all surveys
     * @returns {Promise} Promise with the post purchase email data
     */
    const getPostPurchaseEmailData = async () => {
        const response = await apiClient("GET", "/post-purchase-email");
        return response;
    };

    /**
     * Send test email using the current template
     * @param {Object} emailData - The email data to send as test
     * @returns {Promise} Promise with the send test result
     */
    const savePostPurchaseEmailData = async (emailData) => {
        const response = await apiClient("POST", "/post-purchase-email", emailData);
        return response;
    };

    return {
        getPostPurchaseEmailData,
        savePostPurchaseEmailData,
    };
}
