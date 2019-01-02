import fetch = require("jest-fetch-mock");
import {typeRest} from "../src";

describe("Custom Initialization", () => {
    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{}");
    });

    it("headers", async () => {
        const api = typeRest("https://localhost/", {params: {headers: {one: "two"}}});
        await api.a.b.c.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/a/b/c/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("headers", {one: "two", Accept: "application/json"});
    });

    it("set header after init", async () => {
        const api = typeRest("https://localhost/");
        await api.Get();
        api._options.params.headers.a = "b";
        await api.Get();
        expect(fetch.mock.calls[0][1]).toHaveProperty("headers", {Accept: "application/json"});
        expect(fetch.mock.calls[1][1]).toHaveProperty("headers", {a: "b", Accept: "application/json"});
    });

    it("set header for only specific routes", async () => {
        const api = typeRest("https://localhost/", {params: {headers: {base: "b"}}});
        api.one._options.params.headers.one = "1";
        api.two._options.params.headers.two = "2";
        await api.Get();
        await api.one.Get();
        await api.two.Get();
        expect(fetch.mock.calls[0][1]).toHaveProperty("headers", {base: "b", Accept: "application/json"});
        expect(fetch.mock.calls[1][1]).toHaveProperty("headers", {base: "b", one: "1", Accept: "application/json"});
        expect(fetch.mock.calls[2][1]).toHaveProperty("headers", {base: "b", two: "2", Accept: "application/json"});
    });
});
