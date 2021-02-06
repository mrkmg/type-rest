import mergeOptions = require("merge-options");
import {IHookDefinition, Index, ITypeRestOptions, pathEncoder, ValidPathStyles} from "./";
import {makeEndpoint, ValidEndpoint} from "./make-endpoint";

function getIndexArray<T>(start: Index<T>, includeRoot = true) {
    const arr = [start];
    while (start._parent) {
        start = start._parent;
        arr.unshift(start);
    }
    if (!includeRoot) arr.shift();
    return arr;
}

function encodePath<T>(start: Index<T>, includeRoot = true): string {
    if (!start._parent) {
        return includeRoot ? start._path + "/" : "";
    }

    const indexes = getIndexArray(start, false);

    const path = [];
    let currentPath = [];
    let currentPathStyle: ValidPathStyles = null;
    for (const index of indexes) {
        if (index._resolvedOptions.pathStyle !== currentPathStyle) {
            if (currentPath.length > 0) {
                path.push(pathEncoder(currentPath, currentPathStyle));
            }
            currentPath = [];
            currentPathStyle = index._resolvedOptions.pathStyle;
        }
        currentPath.push(index._path);
    }
    if (currentPath.length > 0) {
        path.push(pathEncoder(currentPath, currentPathStyle));
    }

    return (includeRoot ? start._root._path : "") + "/" +
        path.join("/") +
        (start._resolvedOptions.trailingSlash ? "/" : "");
}

function getHandler<T>(target: Index<T>, name: string, current: Index<T>) {
    switch (name) {
    case "_root":
        if (current._parent) {
            return current._parent._root;
        }
        return current;

    case "_uri":
        return encodePath(current, true);

    case "_encodedPath":
        return encodePath(current, false);

    case "_fullPath":
        return getIndexArray(current).map(i => i._path);

    case "_resolvedOptions":
        return mergeOptions.apply({
            concatArrays: true,
        }, getIndexArray(current).map(i => i._options));

    case "_addHook":
        return (hook: IHookDefinition<T>) => {
            current._options.hooks.push(hook);
        };

    case "Get":
    case "Post":
    case "Patch":
    case "Delete":
    case "Put":
        return makeEndpoint({
            current,
            type: name.toUpperCase() as ValidEndpoint,
        });

    default:
        if (name in target) {
            return target[name];
        }

        return target[name] = makeProxy(current, name, {
            hooks: [],
            params: {headers: {}},
        });

    }
}

const proxyHandler = {get: getHandler};

export function makeProxy<T>(parent: Index<T>, path: string, options: Partial<ITypeRestOptions<T>>): Index<T> {
    return new Proxy({
        _options: options,
        _parent: parent,
        _path: path,
    } as unknown as Index<T>, proxyHandler) as Index<T>;
}

