import React from 'react'
import { apiClient } from '../../../api';

export default function useAnalyticsApi() {
    const getAnalytics = async () => {
        const response = await apiClient("GET", "/analytics");
        return response;
    }
    return {
        getAnalytics
    }
}
