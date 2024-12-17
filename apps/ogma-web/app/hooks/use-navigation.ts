import { useNavigation as useRemixNavigation } from '@remix-run/react';
import { useEffect, useState } from 'react';

export function useNavigation() {
  const navigation = useRemixNavigation();

  const [previousState, setPreviousState] = useState(navigation.state);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setPreviousState(navigation.state);
  }, [navigation.state]);

  useEffect(() => {
    if (previousState === 'idle' && navigation.state === 'loading') {
      setLoading(true);
    }
    if (previousState === 'idle' && navigation.state === 'submitting') {
      setSubmitting(true);
    }
    if (previousState === 'loading' && navigation.state === 'idle') {
      setCompleted(true);
      setLoading(false);
      setSubmitting(false);
    }
  }, [previousState, navigation.state]);

  return { loading, submitting, completed };
}
