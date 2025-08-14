import { useEffect } from "react";
import { UseMutationResult } from "@tanstack/react-query";

export function useMutationEvents(
    mutation,
    callbacks,
) {
    const { onSuccess, onError } = callbacks;

    useEffect(() => {
        if (mutation.isSuccess && mutation.data && onSuccess) {
            onSuccess(mutation.data);
        }
    }, [mutation.isSuccess, mutation.data]);

    useEffect(() => {
        if (mutation.isError && mutation.error && onError) {
            onError(mutation.error);
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
}
