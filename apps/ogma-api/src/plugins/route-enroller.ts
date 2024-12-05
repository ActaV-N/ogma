import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    enroll: (routes: RouterSpec[]) => void;
  }
}

export const routeEnroller: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    fastify.decorate('enroll', function (routes: RouterSpec[]) {
      routes.forEach((route) => {
        const method = route.method;
        if (method in this) {
          this[method](route.path, route.opts, route.handler);
        }
      });
    });
  },
);
