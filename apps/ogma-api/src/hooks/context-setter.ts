import {
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
  onRequestAsyncHookHandler,
  onRequestHookHandler,
} from "fastify";
import { Context } from "~libs";

declare module "fastify" {
  interface FastifyRequest {
    context: Context;
  }
}

export const contextSetter: onRequestHookHandler = (request, reply, done) => {
  const context = Context.of();
  request.context = context;
  done();
};
