import { useOutletContext } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { cn } from '~libs/utils';

export default function AskPage() {
  const { shouldNavigate, handleNavigate } = useOutletContext<{
    shouldNavigate: boolean;
    handleNavigate: () => void;
  }>();

  // states, refs
  const [loaded, setLoaded] = useState(false);

  // calculated values
  const shouldShow = !shouldNavigate && loaded;

  // effects
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className={cn(
        'will-change-[opacity,transform] transition-[opacity,transform] duration-300 ease-in-out flex flex-col justify-between h-full',
        shouldShow ? 'opacity-100' : 'opacity-0',
        shouldShow ? 'translate-x-0' : 'translate-x-[100px]'
      )}
      onTransitionEnd={handleNavigate}
    >
      TODO: search
    </div>
  );
}
