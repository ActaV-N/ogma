declare global {
  type RouterHandler<T extends RouteGenericInterface = RouteGenericInterface> =
    (request: FastifyRequest<T>, reply: FastifyReply) => Promise<any> | any;

  interface RouterSpec<
    T extends RouteGenericInterface = RouteGenericInterface,
  > {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options'
    path: string;
    opts: RouteShorthandOptions;
    handler: RouterHandler<T>;
  }
}

export {};
