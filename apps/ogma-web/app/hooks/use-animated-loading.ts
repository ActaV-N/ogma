import { useEffect, useRef, useState } from 'react';
import { useNavigation } from './use-navigation';
import { useNavigate } from '@remix-run/react';

export function useAnimatedLoading(
  type: 'submitting' | 'loading' = 'loading',
  options: {
    minimumLoadingDuration?: number;
    stateDuration?: number;
    success?: boolean;
    loadingStartText?: string;
    successText?: string;
    errorText?: string;
    onLoadingStart?: () => void;
    onComplete?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
  } = {}
) {
  const { loading, submitting } = useNavigation();

  const isSubmitting = type === 'submitting' ? submitting : loading;

  const {
    minimumLoadingDuration = 300,
    stateDuration = 1000,
    success: isSuccess,
    loadingStartText,
    successText,
    errorText,
    onLoadingStart,
    onComplete,
    onSuccess,
    onError,
  } = options;

  const [helperText, setHelperText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const loadStartTimestamp = useRef<number | null>(null);
  const prevIsSubmitting = useRef(isSubmitting);

  useEffect(() => {
    if (isSubmitting && !prevIsSubmitting.current) {
      loadStartTimestamp.current = Date.now();
      loadingStartText && setHelperText(loadingStartText);
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
          successText && setHelperText(successText);
        } else {
          setIsSuccessVisible(false);
          setIsErrorVisible(true);
          onError?.();
          errorText && setHelperText(errorText);
        }
      }, remainingLoadTime);
    }
    prevIsSubmitting.current = isSubmitting;
  }, [
    isSubmitting,
    isSuccess,
    minimumLoadingDuration,
    stateDuration,
    onSuccess,
    onError,
    loadingStartText,
    successText,
    errorText,
  ]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsCompleted(true);
        onComplete?.();
        setHelperText(null);
      }, stateDuration);
    }
  }, [isSuccess, stateDuration, onComplete]);

  return {
    loading: isLoading,
    success: isSuccessVisible,
    error: isErrorVisible,
    completed: isCompleted,
    helperText,
  };
}

export function useAnimatedNavigation(
  options: {
    loadingDuration?: number;
    stateDuration?: number;
    loadingStartText?: string;
    successText?: string;
    onLoadingStart?: () => void;
    onComplete?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
  } = {}
) {
  const {
    loadingDuration = 300,
    stateDuration = 1000,
    loadingStartText,
    successText,
    onLoadingStart,
    onComplete,
    onSuccess,
  } = options;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [helperText, setHelperText] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleNavigate = (nextRoute: string) => {
    setLoading(true);
    loadingStartText && setHelperText(loadingStartText);
    onLoadingStart?.();
    setTimeout(() => {
      setLoading(false);
      onSuccess?.();
      successText && setHelperText(successText);
      setSuccess(true);
      setTimeout(() => {
        setCompleted(true);
        onComplete?.();
        setHelperText(null);
        navigate(nextRoute);
      }, stateDuration);
    }, loadingDuration);
  };

  return { success, loading, completed, animatedNavigate: handleNavigate, helperText };
}
