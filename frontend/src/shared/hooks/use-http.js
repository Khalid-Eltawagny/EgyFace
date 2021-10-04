import { useState, useCallback, useRef, useEffect } from "react";
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbort = new AbortController();
      activeHttpRequests.current.push(httpAbort);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbort.signal,
        });
        const responseData = await response.json();
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (ctrl) => ctrl !== httpAbort
       );
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (error) {
        setError(error.message || "Something went wrong.");
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abt) => {
        abt.abort();
      });
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};