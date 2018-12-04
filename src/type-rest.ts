import {IHookDefinition} from "./hooks";
import {makeProxy} from "./make-proxy";
import {UntypedTypeRestApi} from "./untyped";

type KeyTypes<T> = Exclude<T, IndexPrivates<T> & {Get: any, Post: any, Patch: any, Delete: any, Put: any}>;

type Indexed<T> = {
    // @ts-ignore
    [P in keyof T]: T[P] & IndexPrivates<T[P]>;
};

interface IndexPrivates<T> {
    readonly _root: Index<T>;
    readonly _parent: Index<T>;
    readonly _options: ITypeRestOptions<T>;
    readonly _path: string;
    readonly _fullPath: string;
    readonly _uri: string;
    readonly _fullOptions: ITypeRestOptions<T>;
}

export type Index<T> = Indexed<KeyTypes<T>> & IndexPrivates<T>;

export type AllowedInitKeys = "mode" | "cache" | "credentials" | "headers" | "redirect" | "referrer";
// This is a work-around for headers being a stupid type in RequestInit.
export type ITypeRestParams =  Pick<RequestInit, AllowedInitKeys> & {headers?: Record<string, string>};

export interface ITypeRestOptions<T> {
    hooks: Array<IHookDefinition<T>>;
    params: ITypeRestParams;
}

export type ITypeRestOptionsInit<T> = Partial<ITypeRestOptions<T>>;

export function typeRest<T = UntypedTypeRestApi>(path: string, options?: ITypeRestOptionsInit<T>): Index<T> {
    if (typeof options === "undefined") {
        options = {};
    }

    if (typeof options.params === "undefined") {
        options.params = {};
    }

    if (typeof options.hooks === "undefined") {
        options.hooks = [];
    }

    options.params = Object.assign({
        cache: "default",
        credentials: "same-origin",
        headers: {},
        mode: "same-origin",
        redirect: "follow",
        referrer: "client",
    }, options.params);

    if (path[path.length - 1] !== "/") {
        path = path + "/";
    }

    return makeProxy<T>(null, path, options as ITypeRestOptions<T>);
}
