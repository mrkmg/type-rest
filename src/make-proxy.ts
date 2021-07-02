import mergeOptions = require("merge-options");
import {IHookDefinition, Index, ITypeRestOptions, ITypeRestOptionsInit} from "./";
import {IEndPointParams, makeEndpoint, ValidEndpoint} from "./make-endpoint";

function getHandler<T>(target: Index<T>, name: string, current: Index<T>) {
    let endPointParams: IEndPointParams<T>;
    let proxy: Index<T>;
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
        return (hook: IHookDefinition<T>) => {
            current._options.hooks.push(hook);
        };

    case "Get":
    case "Post":
    case "Patch":
    case "Delete":
    case "Put":
        endPointParams = {
            current,
            type: name.toUpperCase() as ValidEndpoint,
        };
        return makeEndpoint(endPointParams);

    default:
        if (name in target) {
            return target[name];
        }

        proxy = makeProxy(current, name, {hooks: [], params: {headers: {}}});
        target[name] = proxy;
        return proxy;

    }
}

const proxyHandler = {get: getHandler};

export function makeProxy<T>(parent: Index<T>, path: string, options: ITypeRestOptionsInit<T>): Index<T> {
    // Need to do some overrides with types as the proxy handles many of the fields
    return new Proxy({
        _options: {
            hooks: options.hooks ?? [],
            params: options.params ?? {},
        } as ITypeRestOptions<T>,
        _parent: parent,
        _path: path,
    } as Partial<Index<T>>, proxyHandler) as Index<T>;
}

function formatPath(path: string) {
    return path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
