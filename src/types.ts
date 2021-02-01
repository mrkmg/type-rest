export type WithNone<TResponse> = (() => Promise<TResponse>) & { raw: WithNoneRaw };
export type WithBody<TBody, TResponse> = ((body: TBody) => Promise<TResponse>) & { raw: WithBodyRaw<TBody> } ;
export type WithQuery<TQuery, TResponse> = ((query: TQuery) => Promise<TResponse>) & { raw: WithQueryRaw<TQuery> };
export type WithBodyAndQuery<TBody, TQuery, TResponse> =
    ((body: TBody, query: TQuery) => Promise<TResponse>) & { raw: WithBodyAndQueryRaw<TBody, TQuery> };

export type WithNoneRaw = () => Promise<Response>;
export type WithBodyRaw<TBody> = (body: TBody) => Promise<Response>;
export type WithQueryRaw<TQuery> = (query: TQuery) => Promise<Response>;
export type WithBodyAndQueryRaw<TBody, TQuery> = (body: TBody, query: TQuery) => Promise<Response>;

export type DeleteRoute = WithNone<unknown> & WithQuery<unknown, unknown>;
export type GetRoute = WithNone<unknown> & WithQuery<unknown, unknown>;
export type PostRoute = WithBody<unknown, unknown> & WithBodyAndQuery<unknown, unknown, unknown>;
export type PatchRoute = WithBody<unknown, unknown> & WithBodyAndQuery<unknown, unknown, unknown>;
export type PutRoute =  WithBody<unknown, unknown> & WithBodyAndQuery<unknown, unknown, unknown>;
