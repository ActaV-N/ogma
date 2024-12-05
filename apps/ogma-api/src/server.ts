import 'reflect-metadata';
import fastify from 'fastify';
import { fastifyMultipart } from '@fastify/multipart';
import { getConfig } from '~configs';
import { appRoutes } from '~routes';
import { routeEnroller } from '~plugins';

(async () => {
  const port = getConfig('/port');
  const isProduction = getConfig('/isProduction');
  const server = fastify({
    logger: {
      level: isProduction ? 'info' : 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  server.get('/ping', async () => {
    return 'pong\n';
  });

  // Plugins from fastify ecosystem
  await server.register(fastifyMultipart);
  // Custom plugins
  await server.register(routeEnroller);

  await server.register(appRoutes, { prefix: '/api' });

  server.listen({ port }, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }

    server.log.info(`Server listening at ${address}`);
  });
})();
