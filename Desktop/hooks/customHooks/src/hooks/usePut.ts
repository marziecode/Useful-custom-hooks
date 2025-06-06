
import { useCallback, useState } from "react";
import API from "../services";

interface UsePutOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UsePutResult<T, P> {
  loading: boolean;
  execute: (payload: P, id?: string) => void;
  responseData?: T;
}

const usePut = <T, P>(
  url: string,
  options: UsePutOptions<T> = {}
): UsePutResult<T, P> => {
  const { onSuccess, onError } = options;

  const [loading, setLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<T | undefined>(undefined);

  const execute = useCallback(
    (payload: P, id?: string) => {
      setLoading(true);
      API.put<T>(id ? url + id : url, payload)
        .then((response) => {
          setResponseData(response.data);
          onSuccess?.(response.data);
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.message || err.message || "An error occurred";
          onError?.(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [url, onSuccess, onError]
  );

  return { loading, execute, responseData };
};

export default usePut;
