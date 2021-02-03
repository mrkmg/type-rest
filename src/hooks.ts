import {
    IHookDefinition,
    IPostHookDefinition, IPostHookEvent,
    IPreHookDefinition, IPreHookEvent,
} from "./index";
import {IEndPointParams} from "./make-endpoint";

export async function runPreHooks<T>(params: IEndPointParams<T>, preEvent: IPreHookEvent<T>): Promise<void> {
    const matchingHooks = params.current._fullOptions.hooks.filter((hookDefinition: IHookDefinition<T>) => {
        if (hookDefinition.type !== "pre") {
            return false;
        }
        const isInvalidPath = hookDefinition.path && hookDefinition.path !== preEvent.path;
        const isInvalidMethod = hookDefinition.method && hookDefinition.method !== preEvent.method;
        return !(isInvalidPath || isInvalidMethod);
    }) as IPreHookDefinition<T>[];

    if (matchingHooks.length === 0) {
        return Promise.resolve();
    }

    for (const hook of matchingHooks) {
        await hook.hook(preEvent);
    }
}

export async function runPostHooks<T>(params: IEndPointParams<T>, postEvent: IPostHookEvent<T>): Promise<void> {
    const matchingHooks = params.current._fullOptions.hooks.filter((hookDefinition: IHookDefinition<T>) => {
        if (hookDefinition.type !== "post") {
            return false;
        }
        const isInvalidPath = hookDefinition.path && hookDefinition.path !== postEvent.path;
        const isInvalidMethod = hookDefinition.method && hookDefinition.method !== postEvent.method;
        return !(isInvalidPath || isInvalidMethod);
    }) as IPostHookDefinition<T>[];

    if (matchingHooks.length === 0) {
        return Promise.resolve();
    }

    for (const hook of matchingHooks) {
        await hook.hook(postEvent);
    }
}
