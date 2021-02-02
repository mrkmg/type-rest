export type WithNone<TResponse> = (() => Promise<TResponse>) & { raw: WithNoneRaw };
export type WithBody<TBody, TResponse> = ((body: TBody) => Promise<TResponse>) & { raw: WithBodyRaw<TBody> } ;
export type WithQuery<TQuery, TResponse> = ((query: TQuery) => Promise<TResponse>) & { raw: WithQueryRaw<TQuery> };
export type WithBodyAndQuery<TBody, TQuery, TResponse> =
    ((body: TBody, query: TQuery) => Promise<TResponse>) & { raw: WithBodyAndQueryRaw<TBody, TQuery> };

export type WithOptionalQuery<TQuery, TResponse> = WithNone<TResponse> & WithQuery<TQuery, TResponse>;
export type WithBodyAndOptionalQuery<TBody, TQuery, TResponse> = WithBody<TBody, TResponse> & WithBodyAndQuery<TBody, TQuery, TResponse>;
export type WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse> = WithNone<TResponse> & WithBody<TBody, TResponse> & WithBodyAndQuery<TBody, TQuery, TResponse>;

export type WithNoneRaw = () => Promise<Response>;
export type WithBodyRaw<TBody> = (body: TBody) => Promise<Response>;
export type WithQueryRaw<TQuery> = (query: TQuery) => Promise<Response>;
export type WithBodyAndQueryRaw<TBody, TQuery> = (body: TBody, query: TQuery) => Promise<Response>;

export type DeleteRoute<TQuery = unknown, TResponse = unknown> = WithOptionalQuery<TQuery, TResponse>;
export type GetRoute<TQuery = unknown, TResponse = unknown> = WithOptionalQuery<TQuery, TResponse>;
export type PostRoute<TBody = unknown, TQuery = unknown, TResponse = unknown> = WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse>;
export type PatchRoute<TBody = unknown, TQuery = unknown, TResponse = unknown> = WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse>;
export type PutRoute<TBody = unknown, TQuery = unknown, TResponse = unknown> = WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse>;
