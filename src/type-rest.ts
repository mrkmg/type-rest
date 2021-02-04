import {makeProxy} from "./make-proxy";
import {UntypedTypeRestApi, ITypeRestOptions, ITypeRestOptionsInit, ValidPathStyles, Index} from "./types";
import mergeOptions = require("merge-options");
import {CommonEncodings} from "./encoding";
import {FetchSignature, TypeRestDefaults} from "./defaults";

function getDefaultFetch(): FetchSignature {
    if (TypeRestDefaults.fetchImplementation)
        return TypeRestDefaults.fetchImplementation;

    if (typeof window !== "undefined" && "fetch" in window && typeof window.fetch !== "undefined")
        return window.fetch.bind(window);

    if (typeof global !== "undefined" && "fetch" in global && typeof global.fetch !== "undefined")
        return global.fetch.bind(global);

    throw new Error("Neither window.fetch nor global.fetch exists. Pass an implementation of fetch into the typeRest options, or set the TypeRestDefault.fetchImplementation");
}

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
    options = mergeOptions.call({mergeArrays: true}, {
        params: {headers: {}},
        hooks: [],
        pathStyle: "snakeCase",
        encoder: CommonEncodings.jsonToJson,
        trailingSlash: true,
        fetchImplementation: getDefaultFetch(),
    }, options || {});

    if (path[path.length - 1] !== "/") {
        path = path + "/";
    }

    return makeProxy<T>(null, path, options as ITypeRestOptions<T>);
}