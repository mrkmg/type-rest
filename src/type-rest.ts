import {IHookDefinition} from "./hooks";
import {makeProxy} from "./make-proxy";
import {ITypeRestEndpoints, UntypedTypeRestApi} from "./untyped";

type KeyTypes<T> = Exclude<T, IIndexPrivates<T> & ITypeRestEndpoints>;

type Indexed<T> = {
    [P in keyof T]: T[P] & IIndexPrivates<T[P]>;
};

interface IIndexPrivates<T> {
    readonly _root: Index<T>;
    readonly _parent: Index<T>;
    readonly _options: ITypeRestOptions<T>;
    readonly _path: string;
    readonly _fullPath: string;
    readonly _uri: string;
    readonly _fullOptions: ITypeRestOptions<T>;
    readonly _addHook: (hook: IHookDefinition<T>) => void;
}

export type Index<T> = Indexed<KeyTypes<T>> & IIndexPrivates<T>;

/**
 * All valid path styles
 *
 * (examples for the input of testPath)
 * * lowerCase -> convert path to all lower case letters (TESTPATH)
 * * upperCase -> covert path to all upper case letters (testpath)
 * * dashed -> convert path to dashed (test-path)
 * * snakeCase -> convert path to snake case (test_path)
 * * none -> do not modify path (testPath)
 *
 * or a function which takes in a path part and returns it transformed.
 */
export type ValidPathStyles = "lowerCased" | "upperCased" | "dashed" | "snakeCase" | "none" | ((pathPath: string) => string);
export type AllowedInitKeys = "mode" | "cache" | "credentials" | "headers" | "redirect" | "referrer";
// This is a work-around for headers being a stupid type in RequestInit.
export type ITypeRestParams =  Pick<RequestInit, AllowedInitKeys> & {headers?: Record<string, string>};
interface IRequestEncoder<TRequest = unknown, TResponse = unknown> {
    requestContentType: string;
    requestAcceptType: string;
    requestEncoder: (data: TRequest) => Promise<string>;
    responseDecoder: (response: Response) => Promise<TResponse>;
}

/**
 * Options for initializing Type Rest
 *
 * @property hooks A list of hooks IHookDefinition
 */
export interface ITypeRestOptions<T> {
    hooks: Array<IHookDefinition<T>>;
    params: ITypeRestParams;
    pathStyle: ValidPathStyles;
    encoder: IRequestEncoder;
}

export type ITypeRestOptionsInit<T> = Partial<ITypeRestOptions<T>>;

export type FetchSignature = (input: Request | string, init?: RequestInit) => Promise<Response>;
function getDefaultFetch(): FetchSignature {
    if (typeof window !== "undefined" && "fetch" in window)
        return window.fetch.bind(window);
    if (typeof global !== "undefined" && "fetch" in global)
        return global.fetch.bind(global);
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require("node-fetch") as FetchSignature;
    } catch (e) {
        throw new Error("No version of Fetch was found");
    }
}

export const TypeRestDefaults: {
    fetchImplementation: FetchSignature
} = {
    fetchImplementation: getDefaultFetch()
};

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

    if (typeof options.pathStyle === "undefined") {
        options.pathStyle = "snakeCase";
    }

    if (typeof options.encoder === "undefined") {
        options.encoder = {
            requestAcceptType: "application/json",
            requestContentType: "application/json",
            requestEncoder: async input => JSON.stringify(input),
            responseDecoder: response => response.json(),
        };
    }

    options.params = Object.assign({
        cache: "default",
        credentials: "same-origin",
        headers: {},
        hooks: [],
        mode: "same-origin",
        redirect: "follow",
        referrer: "client",
    }, options.params);

    if (path[path.length - 1] !== "/") {
        path = path + "/";
    }

    return makeProxy<T>(null, path, options as ITypeRestOptions<T>);
}