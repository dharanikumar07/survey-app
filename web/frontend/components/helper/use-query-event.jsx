import { useEffect } from "react";

export function useQueryEvents(
    query,
    callbacks,
) {
    const { onSuccess, onError } = callbacks;
    useEffect(() => {
        if (query.data && onSuccess) {
            onSuccess(query.data);
        }
    }, [query.data]);
    useEffect(() => {
        if (query.error && onError) {
            onError(query.error);
        }
    }, [query.error]);
    return query;
}
