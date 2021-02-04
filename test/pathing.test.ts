import fetch from "jest-fetch-mock";
import {typeRest, TypeRestDefaults} from "../src";

describe("Pathing", () => {
    beforeAll(() => {
        TypeRestDefaults.fetchImplementation = fetch;
    });

    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{}");
    });

    it("simple", async () => {
        const api = typeRest("https://localhost/");
        await api.one.two.three.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/one/two/three/");
    });

    it("none", async () => {
        const api = typeRest("https://localhost/", {pathStyle: "none"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/testTest01Test02test/");
    });

    it("dashed", async () => {
        const api = typeRest("https://localhost/", {pathStyle: "dashed"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/test-test01-test02test/");
    });

    it("snakeCase", async () => {
        const api = typeRest("https://localhost/", {pathStyle: "snakeCase"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/test_test01_test02test/");
    });

    it("lowerCased", async () => {
        const api = typeRest("https://localhost/", {pathStyle: "lowerCased"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/testtest01test02test/");
    });

    it("upperCased", async () => {
        const api = typeRest("https://localhost/", {pathStyle: "upperCased"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/TESTTEST01TEST02TEST/");
    });

    it("custom", async () => {
        const api = typeRest("https://localhost/", {
            pathStyle: (s) => s.map( p => p.toLowerCase().replace(/test/g, "other")).join("/")
        });
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/otherother01other02other/");
    });

    it("handle numeric keys", async () => {
        const api = typeRest("https://localhost/");
        await api.path[0].Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/path/0/");
    });
});
