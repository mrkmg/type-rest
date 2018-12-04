import { IHookDefinition } from "./hooks";
import { UntypedTypeRestApi } from "./untyped";
declare type KeyTypes<T> = Exclude<T, IndexPrivates<T> & {
    Get: any;
    Post: any;
    Patch: any;
    Delete: any;
    Put: any;
}>;
declare type Indexed<T> = {
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
export declare type Index<T> = Indexed<KeyTypes<T>> & IndexPrivates<T>;
export declare type AllowedInitKeys = "mode" | "cache" | "credentials" | "headers" | "redirect" | "referrer";
export declare type ITypeRestParams = Pick<RequestInit, AllowedInitKeys> & {
    headers?: Record<string, string>;
};
export interface ITypeRestOptions<T> {
    hooks: Array<IHookDefinition<T>>;
    params: ITypeRestParams;
}
export declare type ITypeRestOptionsInit<T> = Partial<ITypeRestOptions<T>>;
export declare function typeRest<T = UntypedTypeRestApi>(path: string, options?: ITypeRestOptionsInit<T>): Index<T>;
export {};
