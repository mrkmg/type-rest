import {
    HookType,
    IHookDefinition,
    Index,
    IPostHookDefinition,
    IPostHookEvent,
    IPreHookDefinition,
    IPreHookEvent,
} from "./index";
import {IEndPointParams} from "./make-endpoint";

function checkPath(value: Index<unknown>, check: undefined | RegExp | string | (string|number)[]): boolean {
    if (check === undefined) {
        return true;
    } else if (check instanceof RegExp) {
        return check.test(value._fullPath);
    } else if (Array.isArray(check)) {
        const parts = [];
        let current = value;
        while (current._parent) {
            parts.unshift(current._path);
            current = current._parent;
        }
        return parts.length === check.length && parts.reduce((c, v, i) => c && (check[i] === null || v === check[i]), true);
    } else return typeof check === "string" && check === value._fullPath;
}

function getHooks<T>(type: HookType.Pre, params: IEndPointParams<T>, event: IPreHookEvent<T>): IPreHookDefinition<T>[];
function getHooks<T>(type: HookType.Post, params: IEndPointParams<T>, event: IPostHookEvent<T>): IPostHookDefinition<T>[];
function getHooks<T>(type: HookType,
    params: IEndPointParams<T>,
    event: IPreHookEvent<T> | IPostHookEvent<T>) {
    return params.current._fullOptions.hooks.filter((hookDefinition: IHookDefinition<T>) => {
        if (hookDefinition.type !== type) {
            return false;
        }
        const isInvalidPath = !checkPath(params.current, hookDefinition.path);
        const isValidMethod = !hookDefinition.method || (
            (typeof hookDefinition.method === "string" && hookDefinition.method == event.method)
            || (Array.isArray(hookDefinition.method) && hookDefinition.method.includes(event.method))
        );
        return !(isInvalidPath || !isValidMethod);
    });
}

export async function runPreHooks<T>(params: IEndPointParams<T>, preEvent: IPreHookEvent<T>): Promise<void> {
    const matchingHooks = getHooks(HookType.Pre, params, preEvent);

    if (matchingHooks.length === 0) {
        return;
    }

    for (const hook of matchingHooks) {
        await hook.hook(preEvent);
    }
}

export async function runPostHooks<T>(params: IEndPointParams<T>, postEvent: IPostHookEvent<T>): Promise<void> {
    const matchingHooks = getHooks(HookType.Post, params, postEvent);

    if (matchingHooks.length === 0) {
        return;
    }

    for (const hook of matchingHooks) {
        await hook.hook(postEvent);
    }
}
