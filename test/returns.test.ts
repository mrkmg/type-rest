import fetch from "jest-fetch-mock";
import {typeRest} from "../src";

describe("Returns", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("json response, successful", async () => {
        fetch.mockResponse("{\"responseParam1\": \"responseValue1\"}");
        const api = typeRest("https://localhost/", {fetch});
        const result = await api.Get();
        expect(result).toEqual({responseParam1: "responseValue1"});
    });

    it("json response, 500", async () => {
        fetch.mockResponse("{\"responseParam1\": \"responseValue1\"}", {status: 500});
        const api = typeRest("https://localhost/", {fetch});
        await expect(() => api.Get()).rejects.toHaveProperty("status", 500);
    });

    it("raw response, successful", async () => {
        fetch.mockResponse("abc-123");
        const api = typeRest("https://localhost/", {fetch});
        const result1 = await api.Get.raw();
        const result2 = await api.Post.raw({bodyParam: "bodyValue"});
        await expect(result1.text()).resolves.toEqual("abc-123");
        await expect(result2.text()).resolves.toEqual("abc-123");
    });

    it("raw response, 500", async () => {
        fetch.mockResponse("{\"responseParam1\": \"responseValue1\"}", {status: 500});
        const api = typeRest("https://localhost/", {fetch});
        await expect(() => api.Get()).rejects.toHaveProperty("status", 500);
    });

    it("network error", async () => {
        fetch.mockReject({message: "Network Failure", name: "NetworkError"});
        const api = typeRest("https://localhost/", {fetch});
        await expect(() => api.Get()).rejects.toHaveProperty("message", "Network Failure");
    });
});
