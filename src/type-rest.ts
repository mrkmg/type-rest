import {makeProxy} from "./make-proxy";
import {ITypeRestEndpoints, UntypedTypeRestApi} from "./untyped";
import {IHookDefinition} from "./types";
import {Encoders} from "./encoding/encoders";
import {Decoders} from "./encoding/decoders";

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
    readonly _fullOptions: Readonly<ITypeRestOptions<T>>;
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
 * or a function which takes in an array of path parts and returns the string representation of those parts.
 */
export type ValidPathStyles = "lowerCased" | "upperCased" | "dashed" | "snakeCase" | "none" | ((pathParts: string[]) => string);
type DisallowedRequestInitKeys = "body" | "query" | "method";
// This is a work-around for headers being a stupid type in RequestInit.
export type ITypeRestParams = Omit<RequestInit, DisallowedRequestInitKeys> & {headers?: Record<string, string>};
interface IRequestEncoder<TRequest = unknown, TResponse = unknown> {
    requestContentType: string;
    requestAcceptType: string;
    requestEncoder: (data: TRequest) => Promise<BodyInit>;
    responseDecoder: (response: Response) => Promise<TResponse>;
}

export interface ITypeRestOptions<T> {
    hooks: Array<IHookDefinition<T>>;
    params: ITypeRestParams;
    pathStyle: ValidPathStyles;
    encoder: Readonly<IRequestEncoder>;
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

export function pathEncoder(pathParts: string[], pathStyle: ValidPathStyles): string {
    if (typeof pathStyle === "function")
        return pathStyle(pathParts);

    return pathParts.map(part => {
        switch (pathStyle) {
        case "lowerCased":
            return part.toLowerCase();
        case "upperCased":
            return part.toUpperCase();
        case "dashed":
            return part.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        case "snakeCase":
            return part.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
        case "none":
            return part;
        default:
            throw new Error(`Unknown Path Style ${pathStyle}`);
        }
    }).map(part => {
        if (part.endsWith("/")) return part.substr(0, part.length - 1);
        return part;
    }).join("/");
}

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
        options.encoder = CommonEncodings.jsonToJson;
    }

    options.params = Object.assign({
        headers: {},
    }, options.params);

    if (path[path.length - 1] !== "/") {
        path = path + "/";
    }

    return makeProxy<T>(null, path, options as ITypeRestOptions<T>);
}

export const CommonEncodings = Object.freeze({
    "jsonToJson": {
        requestAcceptType: "application/json",
        requestContentType: "application/json",
        requestEncoder: Encoders.json,
        responseDecoder: Decoders.json,
    },
    "formDataToJson": {
        requestAcceptType: "application/json",
        requestContentType: "multipart/form-data",
        requestEncoder: Encoders.formData,
        responseDecoder: Decoders.json,
    },
    "jsonToCsv": {
        requestAcceptType: "text/csv",
        requestContentType: "application/json",
        requestEncoder: Encoders.json,
        responseDecoder: Decoders.csv,
    }
});