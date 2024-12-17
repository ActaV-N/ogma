import { Outlet, useLocation, useNavigate, useParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useAnimatedNavigation } from '~hooks';
import { cn } from '~libs/utils';

export default function ChatsLayout() {
  // state, refs
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // lib hooks
  const { animatedNavigate, helperText } = useAnimatedNavigation({
    loadingDuration: 1000,
    stateDuration: 500,
    loadingStartText: '불러오는 중입니다...🤖',
    successText: '잠시 후 이동합니다!',
  });
  const params = useParams();
  const navigate = useNavigate();
  const currentLocation = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        if (event.key === 'Home') {
          if (location.pathname.endsWith('/ask')) {
            setShouldNavigate(true);
            setNextRoute(`/chats/${params.id}`);
          } else {
            setShouldNavigate(false);
          }
        } else if (event.key === 'End') {
          if (params.id && !location.pathname.endsWith('/ask')) {
            setShouldNavigate(true);
            setNextRoute(`/chats/${params.id}/ask`);
          } else {
            setShouldNavigate(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, params.id]);

  useEffect(() => {
    setShouldNavigate(false);
  }, [currentLocation.pathname]);

  const handleNavigate = () => {
    if (shouldNavigate && nextRoute) {
      animatedNavigate(nextRoute);
    }
  };

  return (
    <div className="h-screen py-4 pr-2 flex flex-col">
      <div className="h-full flex flex-col gap-2">
        <div className="flex justify-center gap-2 pb-2">
          <span
            onClick={() => {
              setShouldNavigate(true);
              setNextRoute(`/chats/${params.id}`);
            }}
            className={cn(
              'transition-all duration-300 ease-in-out',
              'w-2 h-2 rounded-full cursor-pointer',
              currentLocation.pathname.endsWith('/ask') ? 'bg-white/30' : 'bg-white',
              currentLocation.pathname.endsWith('/ask') ? 'shadow-md' : 'shadow-sm'
            )}
          ></span>
          <span
            onClick={() => {
              setShouldNavigate(true);
              setNextRoute(`/chats/${params.id}/ask`);
            }}
            className={cn(
              'transition-all duration-300 ease-in-out',
              'w-2 h-2 rounded-full cursor-pointer',
              currentLocation.pathname.endsWith('/ask') ? 'bg-white' : 'bg-white/30',
              currentLocation.pathname.endsWith('/ask') ? 'shadow-md' : 'shadow-sm'
            )}
          ></span>
        </div>
        {helperText ? (
          <div className="opacity-0 animate-fade-in flex flex-col gap-2 justify-center items-center h-full">
            <l-dot-stream size="60" speed="2.5" color="black"></l-dot-stream>
            <p className="text-sm text-gray-500">{helperText}</p>
          </div>
        ) : (
          <Outlet context={{ shouldNavigate, handleNavigate }} />
        )}
      </div>
    </div>
  );
}
