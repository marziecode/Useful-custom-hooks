import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import API from "../services";


interface UseFetchOptions<T> {
  autoFetch?: boolean;
  dependencies?: React.DependencyList;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  autoFetch?: boolean;
  dependencies?: React.DependencyList;
}

const useFetch = <T>(
  url: string,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> => {
  const { autoFetch = true, dependencies = [], onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    API.get<T>(url)
      .then((response) => {
        setData(response.data);
        onSuccess?.(response.data);
      })
      .catch((err: unknown) => {
        if (err instanceof AxiosError) {
          const errorMessage =
            err.response?.data?.message || err.message || "An error occurred";
          setError(errorMessage);
          onError?.(errorMessage);
        } else if (err instanceof Error) {
          const errorMessage = err.message || "An unexpected error occurred";
          setError(errorMessage);
          onError?.(errorMessage);
        } else {
          const errorMessage = "An unknown error occurred";
          setError(errorMessage);
          onError?.(errorMessage);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, autoFetch, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
