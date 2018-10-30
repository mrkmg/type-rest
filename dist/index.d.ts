declare module "types" {
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
    export type UntypedRoute = IRouteIntermediary & ICallables;
    export interface IRouteIntermediary {
        [part: number]: UntypedRoute;
        [part: string]: UntypedRoute;
    }
    export interface ICallables {
        Delete: DeleteRoute;
        Get: GetRoute;
        Post: PostRoute;
        Patch: PatchRoute;
        Put: PutRoute;
    }
}
declare module "make-request" {
    import { IDynamicRestInit } from "types";
    export function makeRequest(url: string, method: string, init: IDynamicRestInit, body?: any): Promise<any>;
}
declare module "build-params" {
    export function buildParams(a: any): string;
}
declare module "calls/get" {
    import { IDynamicRestInit } from "types";
    export function ApiGet(path: string, init: IDynamicRestInit): (...args: any[]) => Promise<any>;
}
declare module "calls/post" {
    import { IDynamicRestInit } from "types";
    export function ApiPost(path: string, init: IDynamicRestInit): (...args: any[]) => Promise<any>;
}
declare module "calls/patch" {
    import { IDynamicRestInit } from "types";
    export function ApiPatch(path: string, init: IDynamicRestInit): (...args: any[]) => Promise<any>;
}
declare module "calls/delete" {
    import { IDynamicRestInit } from "types";
    export function ApiDelete(path: string, init: IDynamicRestInit): (...args: any[]) => Promise<any>;
}
declare module "calls/put" {
    import { IDynamicRestInit } from "types";
    export function ApiPut(path: string, init: IDynamicRestInit): (...args: any[]) => Promise<any>;
}
declare module "dynamic-rest" {
    import { IDynamicRestInit, UntypedRoute } from "types";
    export type DynamicRest<T> = T & {
        readonly _initParams: IDynamicRestInit;
    };
    export function dynamicRest<T = UntypedRoute>(path: string, init?: IDynamicRestInit): DynamicRest<T>;
}
declare module "index" {
    export * from "types";
    export * from "dynamic-rest";
}
