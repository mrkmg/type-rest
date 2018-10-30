import {ApiGet} from "./calls/get";
import {IDynamicRestInit, UntypedDynamicRestApi} from "./types";
import {ApiPost} from "./calls/post";
import {ApiPatch} from "./calls/patch";
import {ApiDelete} from "./calls/delete";
import {ApiPut} from "./calls/put";

/**
 * Formats path from camelCase to dash-case e.g. testPath -> test-path
 * @param path
 */
function formatPath(path: string) {
    return path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export type DynamicRest<T> = T & {
    readonly _initParams: IDynamicRestInit
};

export function dynamicRest<T = UntypedDynamicRestApi>(path: string, init?: IDynamicRestInit): DynamicRest<T> {
    if (typeof init === "undefined") init = {};

    return new Proxy({}, {
        get: (target, name: string) => {
            switch (name) {
                case "_initParams":
                    return init;
                case "Get":
                    return ApiGet(path, init);
                case "Post":
                    return ApiPost(path, init);
                case "Patch":
                    return ApiPatch(path, init);
                case "Delete":
                    return ApiDelete(path, init);
                case "Put":
                    return ApiPut(path, init);
                default:
                    const formattedName = formatPath(name);
                    return dynamicRest(`${path}/${formattedName}`, init);
            }
        },
    }) as DynamicRest<T>;
}
