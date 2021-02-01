import fetch = require("jest-fetch-mock");
import {typeRest, TypeRestDefaults} from "../src";

describe("Pathing", () => {
    const api = typeRest("https://localhost/");

    beforeAll(() => {
        TypeRestDefaults.fetchImplementation = fetch;
    });

    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{}");
    });

    it("simple", async () => {
        await api.one.two.three.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/one/two/three/");
    });

    it("replace camel with dashes", async () => {
        await api.camelCase.Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/camel-case/");
    });

    it("handle numeric keys", async () => {
        await api.path[0].Get();
        expect(fetch.mock.calls[0][0]).toBe("https://localhost/path/0/");
    });
});
