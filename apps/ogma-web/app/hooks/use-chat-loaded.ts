import { useOutletContext } from '@remix-run/react';
import { useEffect, useState } from 'react';

export function useChatLoaded() {
  const { shouldNavigate, handleNavigate } = useOutletContext<{
    shouldNavigate: boolean;
    handleNavigate: () => void;
  }>();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return { show: !shouldNavigate && isLoaded, handleNavigate };
}
