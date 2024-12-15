import { useNavigation } from '@remix-run/react';
import { useEffect, useState } from 'react';

export function useSubmitting() {
  const navigation = useNavigation();

  const [previousState, setPreviousState] = useState(navigation.state);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setPreviousState(navigation.state);
  }, [navigation.state]);

  useEffect(() => {
    if (previousState === 'idle' && navigation.state === 'submitting') {
      setLoading(true);
    }
    if (previousState === 'loading' && navigation.state === 'idle') {
      setCompleted(true);
      setLoading(false);
    }
  }, [previousState, navigation.state]);

  return { loading, completed };
}
