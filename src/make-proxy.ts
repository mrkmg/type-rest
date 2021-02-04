import mergeOptions = require("merge-options");
import {IHookDefinition, Index, ITypeRestOptions, pathEncoder} from "./";
import {IEndPointParams, makeEndpoint, ValidEndpoint} from "./make-endpoint";

function getFullOptions<T>(start: Index<T>) {
    const options = [start._options];
    let current = start;
    while (current._parent) {
        current = current._parent;
        options.unshift(current._options);
    }
    return mergeOptions.apply({
        concatArrays: true,
    }, options);
}

function getFullPathParts<T>(start: Index<T>): string[] {
    if (!start._parent) return [];
    let current = start;
    const pathParts = [];
    do {
        pathParts.unshift(current._path);
        current = current._parent;
    } while (current._parent);
    return pathParts;
}

function getHandler<T>(target: Index<T>, name: string, current: Index<T>) {
    let endPointParams: IEndPointParams<T>;
    let proxy: Index<T>;
    switch (name) {
    case "_root":
        if (current._parent) {
            return current._parent._root;
        }
        return current;

    case "_uri":
        if (!current._parent) {
            return current._path;
        }
        return `${current._root._path}${pathEncoder(getFullPathParts(current), current._fullOptions.pathStyle)}/`;

    case "_fullPath":
        if (!current._parent) {
            return "/";
        }
        return `/${pathEncoder(getFullPathParts(current), current._fullOptions.pathStyle)}/`;

    case "_fullOptions":
        return getFullOptions(current);

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

        proxy = makeProxy(current, name, {
            hooks: [],
            params: {headers: {}},
        });
        target[name] = proxy;
        return proxy;

    }
}

const proxyHandler = {get: getHandler};

export function makeProxy<T>(parent: Index<T>, path: string, options: Partial<ITypeRestOptions<T>>): Index<T> {
    // Need to do some overrides with types as the proxy handles many of the fields
    return new Proxy({
        _options: options,
        _parent: parent,
        _path: path,
    } as unknown as Index<T>, proxyHandler) as Index<T>;
}

