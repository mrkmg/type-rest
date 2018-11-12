import {IHook, typeRest} from "../src";
import fetch = require("jest-fetch-mock");

describe("Hooks", () => {

    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse('{"responseParam1": "responseValue1"}');
    });

    it("All Calls", async () => {
        let didRunHook = false;
        const hook: IHook = {
            hook: (ev) => { didRunHook = true; }
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(true);
    });

    it("Route Filter - Match", async () => {
        let didRunHook = false;
        const hook: IHook = {
            hook: (ev) => { didRunHook = true; },
            path: "/test/",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(true);
    });

    it("Route Filter - Non-Match", async () => {
        let didRunHook = false;
        const hook: IHook = {
            hook: (ev) => { didRunHook = true; },
            path: "/other/",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(false);
    });

    it("Method Filter - Match", async () => {
        let didRunHook = false;
        const hook: IHook = {
            hook: (ev) => { didRunHook = true; },
            method: "GET",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(true);
    });

    it("Method Filter - Non-Match", async () => {
        let didRunHook = false;
        const hook: IHook = {
            hook: (ev) => { didRunHook = true; },
            method: "POST",
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Get();
        expect(didRunHook).toEqual(false);
    });

    it("Event Params", async () => {
        let r: any = {};
        const hook: IHook = {
            hook: (ev) => { r = ev; },
        };

        const api = typeRest("https://localhost/", {hooks: [hook]});

        await api.test.Post({b: 2}, {a: 1});

        expect(r.fullPath).toEqual("https://localhost/test/?a=1");
        expect(r.rootPath).toEqual("https://localhost/");
        expect(r.path).toEqual("/test/");
        expect(r.requestQuery).toEqual({a: 1});
        expect(r.requestBody).toEqual({b: 2});
        expect(r.response).toEqual({responseParam1: "responseValue1"});
    });

    it("Fake Auth Response", async () => {
        const hook: IHook = {
            hook: (ev) => {
                ev.instance._options.params.headers["auth"] = ev.response.responseParam1;
            }
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
        const hook1: IHook = {
            hook: (ev) => { didRunHook1 = true; },
            path: "/test/",
        };
        const hook2: IHook = {
            hook: (ev) => { didRunHook2 = true; },
            method: "GET",
        };
        const hook3: IHook = {
            hook: (ev) => { didRunHook3 = true; },
            method: "GET",
            path: "/test/",
        };
        const hook4: IHook = {
            hook: (ev) => { didRunHook4 = true; },
            method: "POST",
        };


        const api = typeRest("https://localhost/", {hooks: [hook1, hook2, hook3, hook4]});

        await api.test.Get();
        expect(didRunHook1).toEqual(true);
        expect(didRunHook2).toEqual(true);
        expect(didRunHook3).toEqual(true);
        expect(didRunHook4).toEqual(false);
    });

    it("Throw Error Hook", async () => {
        const hook: IHook = {
            hook: () => Promise.reject("Failed")
        };
        const api = typeRest("https://localhost/", {hooks: [hook]});

        await expect(api.test.Get()).rejects.toEqual("Failed");
    });
});