import {makeProxy} from "./make-proxy";
import {UntypedTypeRestApi, ITypeRestOptions, ITypeRestOptionsInit, ValidPathStyles, Index} from "./types";
import mergeOptions = require("merge-options");
import {CommonEncodings} from "./encoding";
import {fetch} from "cross-fetch";


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
            throw new Error(`Unknown Path Style: ${pathStyle}`);
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
        pathStyle: "dashed",
        encoder: CommonEncodings.jsonToJson,
        trailingSlash: true,
        fetch: fetch,
    } as ITypeRestOptions<T>, options || {});

    if (path[path.length - 1] === "/") {
        path = path.substr(0, path.length - 1);
    }

    return makeProxy<T>(null, path, options as ITypeRestOptions<T>);
}