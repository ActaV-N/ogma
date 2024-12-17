import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { quantum, bouncy, grid, helix, dotStream } from 'ldrs';

quantum.register();
bouncy.register();
grid.register();
helix.register();
dotStream.register();
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
