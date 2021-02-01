import fetch = require("jest-fetch-mock");
import {IHookDefinition, IPostHookEvent, IPreHookEvent, typeRest, TypeRestDefaults, UntypedTypeRestApi} from "../src";

describe("Hooks - _addHook func", () => {
    beforeAll(() => {
        TypeRestDefaults.fetchImplementation = fetch;
    });

    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{\"test\": \"test\"}");
    });

    it("calls hook after adding", async () => {
        let hookRunCount = 0;
        const hook: IHookDefinition = {
            hook: () => { hookRunCount++; },
            type: "post",
        };
        const api = typeRest("https://localhost/");

        await api.test.Get();
        api._addHook(hook);
        await api.test.Get();

        expect(hookRunCount).toEqual(1);
    });

    it("only calls hooks on added route", async () => {
        let hookRunCount = 0;
        const hook: IHookDefinition = {
            hook: () => { hookRunCount++; },
            type: "post",
        };
        const api = typeRest("https://localhost/");

        api.test1._addHook(hook);
        await api.test1.Get();
        await api.test2.Get();
        expect(hookRunCount).toEqual(1);
    });
});

describe("Hooks - POST with Error", () => {
    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{\"test\"}", {status: 403});
    });

    it("Still calls post hook", async () => {
        let didRunHook = false;
        let didReject = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get().catch(() => { didReject = true; });
        expect(didRunHook).toEqual(true);
        expect(didReject).toEqual(true);
    });
});

describe("Hooks - POST", () => {
    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{\"responseParam1\": \"responseValue1\"}");
    });

    it("All Calls", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(true);
    });

    it("Route Filter - Match", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            path: "/test/",
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(true);
    });

    it("Route Filter - Non-Match", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            path: "/other/",
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(false);
    });

    it("Method Filter - Match", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            method: "GET",
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(true);
    });

    it("Method Filter - Non-Match", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            method: "POST",
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(false);
    });

    it("Event Params", async () => {
        let r: IPostHookEvent<unknown>;
        const hook: IHookDefinition = {
            hook: (ev) => { r = ev; },
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Post({b: 2}, {a: 1});

        expect(r.uri).toEqual("https://localhost/test/");
        expect(r.path).toEqual("/test/");
        expect(r.requestQuery).toEqual({a: 1});
        expect(r.requestBody).toEqual({b: 2});
        expect(r.response).toEqual({responseParam1: "responseValue1"});
    });

    it("Fake Auth Response", async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hook: IHookDefinition<UntypedTypeRestApi, unknown, unknown, any> = {
            hook: (ev) => {
                ev.instance._options.params.headers.auth = ev.response.responseParam1;
            },
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();

        expect(api._options.params.headers.auth).toEqual("responseValue1");
    });

    it("Multiple", async () => {
        let didRunHook1 = false;
        let didRunHook2 = false;
        let didRunHook3 = false;
        let didRunHook4 = false;
        const hook1: IHookDefinition = {
            hook: () => { didRunHook1 = true; },
            path: "/test/",
            type: "post",
        };
        const hook2: IHookDefinition = {
            hook: () => { didRunHook2 = true; },
            method: "GET",
            type: "post",
        };
        const hook3: IHookDefinition = {
            hook: () => { didRunHook3 = true; },
            method: "GET",
            path: "/test/",
            type: "post",
        };
        const hook4: IHookDefinition = {
            hook: () => { didRunHook4 = true; },
            method: "POST",
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook1, hook2, hook3, hook4]});

        await api.test.Get();
        expect(didRunHook1).toEqual(true);
        expect(didRunHook2).toEqual(true);
        expect(didRunHook3).toEqual(true);
        expect(didRunHook4).toEqual(false);
    });

    it("Only apply to nested", async () => {
        let hookOneCount = 0;
        let hookTwoCount = 0;

        const hookOneDefinition: IHookDefinition = {
            hook: () => { hookOneCount++; },
            type: "post",
        };

        const hookTwoDefinition: IHookDefinition = {
            hook: () => { hookTwoCount++; },
            type: "post",
        };

        const api = typeRest("https://localhost/");

        api.hookOne._options.hooks.push(hookOneDefinition);
        api.hookTwo._options.hooks.push(hookTwoDefinition);

        await api.Get();
        await api.hookOne.Get();
        await api.hookTwo.Get();

        expect(hookOneCount).toBe(1);
        expect(hookTwoCount).toBe(1);
    });

    it("Throw Error Hook", async () => {
        const hook: IHookDefinition = {
            hook: () => Promise.reject("Failed"),
            type: "post",
        };
        const api = typeRest("https://localhost/", {hooks: [hook]});

        await expect(api.test.Get()).rejects.toEqual("Failed");
    });
});

describe("Hooks - Pre", () => {
    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{\"responseParam1\": \"responseValue1\"}");
    });

    it("All Calls", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            type: "pre",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(true);
    });

    it("Route Filter - Match", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            path: "/test/",
            type: "pre",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(true);
    });

    it("Route Filter - Non-Match", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            path: "/other/",
            type: "pre",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(false);
    });

    it("Method Filter - Match", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            method: "GET",
            type: "pre",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(true);
    });

    it("Method Filter - Non-Match", async () => {
        let didRunHook = false;
        const hook: IHookDefinition = {
            hook: () => { didRunHook = true; },
            method: "POST",
            type: "pre",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(false);
    });

    it("Event Params", async () => {
        let r: IPreHookEvent<unknown>;
        const hook: IHookDefinition = {
            hook: (ev) => { r = ev; },
            type: "pre",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Post({b: 2}, {a: 1});

        expect(r.uri).toEqual("https://localhost/test/");
        expect(r.path).toEqual("/test/");
        expect(r.requestQuery).toEqual({a: 1});
        expect(r.requestBody).toEqual({b: 2});
    });

    it("Fake Auth Request", async () => {
        const hook: IHookDefinition = {
            hook: (ev) => {
                ev.requestBody = {test: "test"};
            },
            type: "pre",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();

        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"test\":\"test\"}");
    });

    it("Multiple", async () => {
        let didRunHook1 = false;
        let didRunHook2 = false;
        let didRunHook3 = false;
        let didRunHook4 = false;
        const hook1: IHookDefinition = {
            hook: () => { didRunHook1 = true; },
            path: "/test/",
            type: "post",
        };
        const hook2: IHookDefinition = {
            hook: () => { didRunHook2 = true; },
            method: "GET",
            type: "post",
        };
        const hook3: IHookDefinition = {
            hook: () => { didRunHook3 = true; },
            method: "GET",
            path: "/test/",
            type: "post",
        };
        const hook4: IHookDefinition = {
            hook: () => { didRunHook4 = true; },
            method: "POST",
            type: "post",
        };

        const api = typeRest("https://localhost/", {hooks: [hook1, hook2, hook3, hook4]});

        await api.test.Get();
        expect(didRunHook1).toEqual(true);
        expect(didRunHook2).toEqual(true);
        expect(didRunHook3).toEqual(true);
        expect(didRunHook4).toEqual(false);
    });

    it("Only apply to nested", async () => {
        let hookOneCount = 0;
        let hookTwoCount = 0;

        const hookOneDefinition: IHookDefinition = {
            hook: () => { hookOneCount++; },
            type: "post",
        };

        const hookTwoDefinition: IHookDefinition = {
            hook: () => { hookTwoCount++; },
            type: "post",
        };

        const api = typeRest("https://localhost/");

        api.hookOne._options.hooks.push(hookOneDefinition);
        api.hookTwo._options.hooks.push(hookTwoDefinition);

        await api.Get();
        await api.hookOne.Get();
        await api.hookTwo.Get();

        expect(hookOneCount).toBe(1);
        expect(hookTwoCount).toBe(1);
    });

    it("Throw Error Hook", async () => {
        const hook: IHookDefinition = {
            hook: () => Promise.reject("Failed"),
            type: "post",
        };
        const api = typeRest("https://localhost/", {hooks: [hook]});

        await expect(api.test.Get()).rejects.toEqual("Failed");
    });
});
