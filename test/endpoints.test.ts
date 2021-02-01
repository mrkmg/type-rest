import fetch = require("jest-fetch-mock");
import {typeRest, TypeRestDefaults} from "../src";

describe("End Point Calls", () => {
    const api = typeRest("https://localhost/");

    beforeAll(() => {
        TypeRestDefaults.fetchImplementation = fetch;
    });

    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{}");
    });

    it("Get", async () => {
        await api.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "GET");
    });

    it("Get with Query", async () => {
        await api.Get({queryParam: "queryValue"});
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/?queryParam=queryValue");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "GET");
    });

    it("Delete", async () => {
        await api.Delete();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "DELETE");
    });

    it("Delete with Query", async () => {
        await api.Delete({queryParam: "queryValue"});
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/?queryParam=queryValue");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "DELETE");
    });

    it("Post", async () => {
        await api.Post({bodyParam: "bodyValue"});
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "POST");
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"bodyParam\":\"bodyValue\"}");
    });

    it("Post with Query", async () => {
        await api.Post({bodyParam: "bodyValue"}, {queryParam: "queryValue"});
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/?queryParam=queryValue");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "POST");
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"bodyParam\":\"bodyValue\"}");
    });

    it("Patch", async () => {
        await api.Patch({bodyParam: "bodyValue"});
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "PATCH");
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"bodyParam\":\"bodyValue\"}");
    });

    it("Patch with Query", async () => {
        await api.Patch({bodyParam: "bodyValue"}, {queryParam: "queryValue"});
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/?queryParam=queryValue");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "PATCH");
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"bodyParam\":\"bodyValue\"}");
    });

    it("Put", async () => {
        await api.Put({bodyParam: "bodyValue"});
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "PUT");
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"bodyParam\":\"bodyValue\"}");
    });

    it("Put with Query", async () => {
        await api.Put({bodyParam: "bodyValue"}, {queryParam: "queryValue"});
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/?queryParam=queryValue");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "PUT");
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"bodyParam\":\"bodyValue\"}");
    });
});
