import mergeOptions = require("merge-options");
import {IHookDefinition, Index, ITypeRestOptions, ValidPathStyles} from "./";
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
        return `${current._parent._uri}${formatPath(current._path, current._fullOptions.pathStyle)}/`;

    case "_fullPath":
        if (!current._parent) {
            return "/";
        }
        return `${current._parent._fullPath}${formatPath(current._path, current._fullOptions.pathStyle)}/`;

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

function formatPath(path: string, pathStyle: ValidPathStyles) {
    if (typeof pathStyle === "function")
        return pathStyle(path);

    switch (pathStyle) {
    case "lowerCased":
        return path.toLowerCase();
    case "upperCased":
        return path.toUpperCase();
    case "dashed":
        return path.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    case "snakeCase":
        return path.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
    case "none":
        return path;
    default:
        throw new Error(`Unknown Path Style ${pathStyle}`);
    }
}
