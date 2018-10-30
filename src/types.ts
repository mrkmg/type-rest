export type WithBody<Body, Response> = (body: Body) => Promise<Response>;
export type WithQuery<Query, Response> = (query: Query) => Promise<Response>;
export type WithQueryBody<Query, Body, Response> = (query: Query, body: Body) => Promise<Response>;
export type WithNone<Response> = () => Promise<Response>;
export type WithFile<Response> = (data: any) => Promise<Response>;

export type DeleteRoute = WithNone<any> & WithQuery<any, any>;
export type GetRoute = WithNone<any> & WithQuery<any, any>;
export type PostRoute = WithBody<any, any> & WithQueryBody<any, any, any>;
export type PatchRoute = WithBody<any, any> & WithQueryBody<any, any, any>;
export type PutRoute = WithFile<any>;

export type IDynamicRestInit = Pick<RequestInit, "mode" | "cache" | "credentials" | "headers" | "redirect" | "referrer">;

export type UntypedDynamicRestApi = IDynamicRestIntermediary & IDynamicRestEndpoints;

export interface IDynamicRestIntermediary {
    [part: number]: UntypedDynamicRestApi;
    [part: string]: UntypedDynamicRestApi;
}

export interface IDynamicRestEndpoints {
    Delete: DeleteRoute;
    Get: GetRoute;
    Post: PostRoute;
    Patch: PatchRoute;
    Put: PutRoute;
}