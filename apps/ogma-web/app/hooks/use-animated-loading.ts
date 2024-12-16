import { useEffect, useRef, useState } from 'react';
import { useSubmitting } from './use-navigation';

export function useAnimatedLoading(
  options: {
    minimumLoadingDuration?: number;
    stateDuration?: number;
    success?: boolean;
    onLoadingStart?: () => void;
    onComplete?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
  } = {}
) {
  const { loading: isSubmitting } = useSubmitting();
  const {
    minimumLoadingDuration = 300,
    stateDuration = 1000,
    success: isSuccess,
    onLoadingStart,
    onComplete,
    onSuccess,
    onError,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const loadStartTimestamp = useRef<number | null>(null);
  const prevIsSubmitting = useRef(isSubmitting);

  useEffect(() => {
    if (isSubmitting && !prevIsSubmitting.current) {
      loadStartTimestamp.current = Date.now();
      setIsLoading(true);
      setIsSuccessVisible(false);
      setIsErrorVisible(false);
      setIsCompleted(false);
      onLoadingStart?.();
    } else if (!isSubmitting && prevIsSubmitting.current && isSuccess !== undefined) {
      const elapsedTime = loadStartTimestamp.current ? Date.now() - loadStartTimestamp.current : 0;
      const remainingLoadTime = Math.max(minimumLoadingDuration - elapsedTime, 0);

      setTimeout(() => {
        setIsLoading(false);
        if (isSuccess) {
          setIsSuccessVisible(true);
          setIsErrorVisible(false);
          onSuccess?.();
        } else {
          setIsSuccessVisible(false);
          setIsErrorVisible(true);
          onError?.();
        }
      }, remainingLoadTime);
    }
    prevIsSubmitting.current = isSubmitting;
  }, [isSubmitting, isSuccess, minimumLoadingDuration, stateDuration, onSuccess, onError]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsCompleted(true);
        onComplete?.();
      }, stateDuration);
    }
  }, [isSuccess, stateDuration, onComplete]);

  return {
    loading: isLoading,
    success: isSuccessVisible,
    error: isErrorVisible,
    completed: isCompleted,
  };
}
