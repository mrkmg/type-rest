import {buildParams} from "../src/build-params";

describe("Params", () => {
    it("obj-number", () => {
        const obj = {a: 1};
        expect(buildParams(obj)).toBe("a=1");
    });

    it("obj-string", () => {
        const obj = {a: "b"};
        expect(buildParams(obj)).toBe("a=b");
    });

    it("obj-function", () => {
        const obj = {a: () => 1};
        expect(buildParams(obj)).toBe("a=1");
    });

    it("obj-array", () => {
        const obj = {a: [1,2,3]};
        expect(buildParams(obj)).toBe("a[0]=1&a[1]=2&a[2]=3");
    });

    it("obj-multi-level", () => {
        const obj = {a: {b: "c"}};
        expect(buildParams(obj)).toBe("a[b]=c");
    });

    it("obj-complex", () => {
        const obj = {a: {b: "c" }, b: [{a:1, b: () => "d"}]};
        expect(buildParams(obj)).toBe("a[b]=c&b[0][a]=1&b[0][b]=d");
    });

    it("string", () => {
        const obj = "abc";
        expect(buildParams(obj)).toBe("abc");
    });

    it("number", () => {
        const obj = 123;
        expect(buildParams(obj)).toBe("123");
    });

    it("array-string", () => {
        const obj = ["a", "b", "c"];
        expect(buildParams(obj)).toBe("0=a&1=b&2=c");
    });

    it("array-obj", () => {
        const obj = [{a: 1}, {b: 2}];
        expect(buildParams(obj)).toBe("0[a]=1&1[b]=2");
    });
});