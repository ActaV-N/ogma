import "reflect-metadata";
import fastify from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import fastifyWebsocket from "@fastify/websocket";
import { getConfig } from "~configs";
import { appRoutes } from "~routes";
import { routeEnroller } from "~plugins";
import { contextSetter } from "~hooks";
import { DataSource } from "typeorm";
import { ormConfig } from "~configs/ormconfig";
import entities from "~services/entities";
import Container from "typedi";
import { dataSourceToken } from "~libs/ddd/typeorm";

(async () => {
  const port = getConfig("/port");
  const isProduction = getConfig("/isProduction");

  try {
    const dataSource = new DataSource({ ...ormConfig, entities });
    await dataSource.initialize();

    Container.set({
      id: dataSourceToken,
      value: dataSource,
      global: true,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const server = fastify({
    logger: {
      level: isProduction ? "info" : "debug",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  });

  server.get("/ping", async () => {
    return "pong\n";
  });

  // hooks
  server.addHook("onRequest", contextSetter);

  // Plugins from fastify ecosystem
  await server.register(fastifyMultipart);
  await server.register(fastifyWebsocket);
  // Custom plugins
  await server.register(routeEnroller);

  await server.register(appRoutes, { prefix: "/api" });

  server.listen({ host: "0.0.0.0", port }, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }

    server.log.info(`Server listening at ${address}`);
  });
})();
