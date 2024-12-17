import * as React from 'react';

import { cn } from '~libs/utils';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  home?: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, home, ...props }, ref) => {
    const Comp = 'div';

    return (
      <Comp
        className={cn(
          className,
          'transition-[width] duration-200 ease-in-out w-4/12 p-4 w-4/12 min-w-[300px] max-w-[400px] z-10'
        )}
        ref={ref}
        {...props}
      >
        <nav className="flex flex-col bg-background rounded-md shadow-md h-full overflow-y-auto">
          {children}
        </nav>
      </Comp>
    );
  }
);
Sidebar.displayName = 'Sidebar';

export { Sidebar };
