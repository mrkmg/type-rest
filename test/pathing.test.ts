import fetch from "jest-fetch-mock";
import {typeRest} from "../src";

describe("Pathing", () => {

    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{}");
    });

    it("simple", async () => {
        const api = typeRest("https://localhost/", {fetch});
        await api.one.two.three.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/one/two/three/");
    });

    it("none", async () => {
        const api = typeRest("https://localhost/", {fetch, pathStyle: "none"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/testTest01Test02test/");
    });

    it("dashed", async () => {
        const api = typeRest("https://localhost/", {fetch, pathStyle: "dashed"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/test-test01-test02test/");
    });

    it("snakeCase", async () => {
        const api = typeRest("https://localhost/", {fetch, pathStyle: "snakeCase"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/test_test01_test02test/");
    });

    it("lowerCased", async () => {
        const api = typeRest("https://localhost/", {fetch, pathStyle: "lowerCased"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/testtest01test02test/");
    });

    it("upperCased", async () => {
        const api = typeRest("https://localhost/", {fetch, pathStyle: "upperCased"});
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/TESTTEST01TEST02TEST/");
    });

    it("custom", async () => {
        const api = typeRest("https://localhost/", {
            fetch,
            pathStyle: (s) => s.map( p => p.toLowerCase().replace(/test/g, "other")).join("/")
        });
        await api.testTest01Test02test.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/otherother01other02other/");
    });

    it("handle numeric keys", async () => {
        const api = typeRest("https://localhost/", {fetch});
        await api.path[0].Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/path/0/");
    });

    it("noTrailingSlash", async () => {
        const api = typeRest("https://localhost/", {fetch, trailingSlash: false});
        await api.path[0].Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/path/0");
    });

    it("combination", async () => {
        const api = typeRest("https://localhost/", {fetch});

        api.aA.bB.cC._options.pathStyle = "snakeCase";
        api.aA.bB.cC.dD.eE.fF._options.pathStyle = "lowerCased";

        await api.aA.Get();
        await api.aA.bB.Get();
        await api.aA.bB.cC.Get();
        await api.aA.bB.cC.dD.Get();
        await api.aA.bB.cC.dD.eE.Get();
        await api.aA.bB.cC.dD.eE.fF.Get();
        await api.aA.bB.cC.dD.eE.fF.gG.Get();


        expect(fetch.mock.calls[0][0]).toBe("https://localhost/a-a/");
        expect(fetch.mock.calls[1][0]).toBe("https://localhost/a-a/b-b/");
        expect(fetch.mock.calls[2][0]).toBe("https://localhost/a-a/b-b/c_c/");
        expect(fetch.mock.calls[3][0]).toBe("https://localhost/a-a/b-b/c_c/d_d/");
        expect(fetch.mock.calls[4][0]).toBe("https://localhost/a-a/b-b/c_c/d_d/e_e/");
        expect(fetch.mock.calls[5][0]).toBe("https://localhost/a-a/b-b/c_c/d_d/e_e/ff/");
        expect(fetch.mock.calls[6][0]).toBe("https://localhost/a-a/b-b/c_c/d_d/e_e/ff/gg/");
    });

    it("invalid path style", async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const api = typeRest("http://localhost/", {fetch, pathStyle: "invalid"});
        await expect(() => api.a.b.c.Get()).rejects.toThrowError("Unknown Path Style: invalid");
    });
});
