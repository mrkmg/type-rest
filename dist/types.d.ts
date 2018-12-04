export declare type WithNone<TResponse> = (() => Promise<TResponse>) & {
    raw: WithNoneRaw;
};
export declare type WithBody<TBody, TResponse> = ((body: TBody) => Promise<TResponse>) & {
    raw: WithBodyRaw<TBody>;
};
export declare type WithQuery<TQuery, TResponse> = ((query: TQuery) => Promise<TResponse>) & {
    raw: WithQueryRaw<TQuery>;
};
export declare type WithBodyAndQuery<TBody, TQuery, TResponse> = ((body: TBody, query: TQuery) => Promise<TResponse>) & {
    raw: WithBodyAndQueryRaw<TBody, TQuery>;
};
export declare type WithNoneRaw = () => Promise<Response>;
export declare type WithBodyRaw<TBody> = (body: TBody) => Promise<Response>;
export declare type WithQueryRaw<TQuery> = (query: TQuery) => Promise<Response>;
export declare type WithBodyAndQueryRaw<TBody, TQuery> = (body: TBody, query: TQuery) => Promise<Response>;
export declare type DeleteRoute = WithNone<any> & WithQuery<any, any>;
export declare type GetRoute = WithNone<any> & WithQuery<any, any>;
export declare type PostRoute = WithBody<any, any> & WithBodyAndQuery<any, any, any>;
export declare type PatchRoute = WithBody<any, any> & WithBodyAndQuery<any, any, any>;
export declare type PutRoute = WithBody<any, any> & WithBodyAndQuery<any, any, any>;
