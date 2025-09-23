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
     * Save post purchase email data
     * @param {Object} emailData - The email data to save
     * @returns {Promise} Promise with the save result
     */
    const savePostPurchaseEmailData = async (emailData) => {
        const response = await apiClient("POST", "/post-purchase-email", emailData);
        return response;
    };

    /**
     * Send test email using the current template
     * @param {Object} testEmailData - The test email data containing survey_uuid, email, and email_data
     * @returns {Promise} Promise with the send test result
     */
    const sendTestEmail = async (testEmailData) => {
        const response = await apiClient("POST", "/send-test-email", testEmailData);
        return response;
    };

    return {
        getPostPurchaseEmailData,
        savePostPurchaseEmailData,
        sendTestEmail,
    };
}