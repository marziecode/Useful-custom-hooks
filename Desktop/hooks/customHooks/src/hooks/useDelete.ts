import { useCallback, useState } from "react";
import API from "../services";

// Define the structure of options for the hook
interface UseDeleteOptions<T> {
  onSuccess?: (data: T) => void; // Callback for successful response
  onError?: (error: string) => void; // Callback for errors
}

// Define the result type for the hook
interface UseDeleteResult<P> {
  loading: boolean; // Loading state
  execute: (payload?: P) => void; // Function to manually execute the DELETE request
}

const useDelete = <T, P>(
  url: string,
  options: UseDeleteOptions<T> = {}
): UseDeleteResult<P> => {
  const { onSuccess, onError } = options;

  // Track the loading state of the request
  const [loading, setLoading] = useState<boolean>(false);

  // The execute function that performs the DELETE request
  const execute = useCallback(
    (p?: P) => {
      setLoading(true);
      // Check if payload has an id, and append it to the URL as query params

      // Make the DELETE request with query parameters
      API.delete<T>(p ? url + "/" + p : url)
        .then((response) => {
          if (onSuccess) {
            onSuccess(response.data); // Trigger the success callback
          }
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.message || err.message || "An error occurred";
          if (onError) {
            onError(errorMessage); // Trigger the error callback
          }
        })
        .finally(() => {
          setLoading(false); // Set loading state to false once request is done
        });
    },
    [url, onSuccess, onError] // Re-run the callback if these dependencies change
  );

  return { loading, execute };
};

export default useDelete;