import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import API from '../services';

interface UsePostOptions<T> {
	onSuccess?: (data: T) => void;
	onError?: (error: string) => void;
}

interface UsePostResult<T, P> {
	loading: boolean;
	execute: (payload: P) => Promise<T | void>;
}

const usePost = <T, P>(
	url: string,
	options: UsePostOptions<T> = {}
): UsePostResult<T, P> => {
	const { onSuccess, onError } = options;

	const [loading, setLoading] = useState<boolean>(false);

	const execute = useCallback(
		async (payload: P): Promise<T | void> => {
			setLoading(true);
			try {
				const response = await API.post<T>(url, payload);
				onSuccess?.(response.data);
				return response.data;
			} catch (err: unknown) {
				if (err instanceof AxiosError) {
					const errorMessage =
						err.response?.data?.message || err.message || 'An error occurred';
					onError?.(errorMessage);
				} else if (err instanceof Error) {
					const errorMessage = err.message || 'An unexpected error occurred';
					onError?.(errorMessage);
				} else {
					const errorMessage = 'An unknown error occurred';
					onError?.(errorMessage);
				}
			} finally {
				setLoading(false);
			}
		},
		[url, onSuccess, onError]
	);

	return { loading, execute };
};

export default usePost;
