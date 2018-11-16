import {Index, ITypeRestOptions} from "./";
import {makeEndpoint} from "./make-endpoint";

export type ValidEndpoint = "DELETE" | "GET" | "POST" | "PATCH" | "PUT";

export function makeProxy<T>(initialPath: string, path: string, options: ITypeRestOptions<T>): Index<T> {
    return new Proxy({}, {
        get: (target, name: string) => {
            switch (name) {
                case "_options":
                    return options;
                case "Get":
                    return makeEndpoint(initialPath, "GET", path, options);
                case "Post":
                    return makeEndpoint(initialPath, "POST", path, options);
                case "Patch":
                    return makeEndpoint(initialPath, "PATCH", path, options);
                case "Delete":
                    return makeEndpoint(initialPath, "DELETE", path, options);
                case "Put":
                    return makeEndpoint(initialPath, "PUT", path, options);
                default:
                    const formattedName = formatPath(name);
                    return makeProxy(initialPath, `${path}${formattedName}/`, options);
            }
        },
    }) as Index<T>;
}

function formatPath(path: string) {
    return path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
