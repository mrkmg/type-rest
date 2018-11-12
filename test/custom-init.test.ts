import {typeRest} from "../src";
import fetch = require("jest-fetch-mock");

describe("Custom Initialization", () => {
    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse('{}');
    });

    it("headers", async () => {
        const api = typeRest("https://localhost/", {params: {headers: {one: "two"}}});
        await api.a.b.c.Get();

        expect(fetch.mock.calls[0][0]).toBe("https://localhost/a/b/c/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("headers", {one: "two"});
    });

    it("set header after init", async () => {
        const api = typeRest("https://localhost/");
        await api.Get();
        expect(fetch.mock.calls[0][1]).toHaveProperty("headers", {});
        api._options.params.headers["a"] = "b";
        await api.Get();
        expect(fetch.mock.calls[0][1]).toHaveProperty("headers", {a: "b"});
    });
});