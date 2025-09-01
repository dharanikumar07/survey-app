import { useState, useCallback, useRef } from 'react';
import { apiClient } from '../../../api';

export const useExtensionStatus = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const checkStatus = useCallback(async (forceRefresh = false) => {
        // Cancel any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);
        
        try {
            const endpoint = forceRefresh ? '/extension/refresh' : '/extension/status';
            const method = forceRefresh ? 'POST' : 'GET';

            const response = await apiClient(method, endpoint);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            setStatus(response.data.data);
            return response.data.data;
        } catch (err) {
            if (err.name === 'AbortError') {
                // Request was cancelled, don't set error
                return;
            }
            
            setError(err.message || 'Failed to check extension status');
            throw err;
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    }, []);

    const activateExtension = useCallback(() => {
        if (status?.extension?.deep_link) {
            window.open(status.extension.deep_link, '_blank');
        }
    }, [status]);

    const refreshStatus = useCallback(() => {
        return checkStatus(true);
    }, [checkStatus]);

    return {
        status,
        loading,
        error,
        checkStatus,
        refreshStatus,
        activateExtension,
        isExtensionEnabled: status?.extension?.enabled || false,
        deepLink: status?.extension?.deep_link || null,
    };
};
