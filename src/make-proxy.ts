import mergeOptions = require("merge-options");
import {IHookDefinition, Index, ITypeRestOptionsInit} from "./";
import {IEndPointParams, makeEndpoint, ValidEndpoint} from "./make-endpoint";

// Todo: Type target
function getHandler<T>(target: any, name: string, current: Index<T>) {
    switch (name) {
        case "_root":
            if (current._parent) {
                return current._parent;
            }
            return current;

        case "_uri":
            if (!current._parent) {
                return current._path;
            }
            return `${current._parent._uri}${formatPath(current._path)}/`;

        case "_fullPath":
            if (!current._parent) {
                return "/";
            }
            return `${current._parent._fullPath}${formatPath(current._path)}/`;

        case "_fullOptions":
            if (!current._parent) {
                return mergeOptions.call({concatArrays: true}, {}, current._options);
            }
            return mergeOptions.call({concatArrays: true}, current._parent._fullOptions, current._options);

        case "_addHook":
            return (hook: IHookDefinition) => {
                current._options.hooks.push(hook);
            };

        case "Get":
        case "Post":
        case "Patch":
        case "Delete":
        case "Put":
            const endPointParams: IEndPointParams<T> = {
                current,
                type: name.toUpperCase() as ValidEndpoint,
            };
            return makeEndpoint(endPointParams);

        default:
            if (target.hasOwnProperty(name)) {
                return target[name];
            }

            const proxy = makeProxy(current, name, {hooks: [], params: {headers: {}}});
            target[name] = proxy;
            return proxy;

    }
}

const proxyHandler = {get: getHandler};

export function makeProxy<T>(parent: Index<T>, path: string, options: ITypeRestOptionsInit<T>): Index<T> {
    return new Proxy({
        _options: options,
        _parent: parent,
        _path: path,
    }, proxyHandler) as Index<T>;
}

function formatPath(path: string) {
    return path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
