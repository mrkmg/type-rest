# Type Rest Options

There are two different sets of options, global defaults, and instance
specific options.

- [Instance Options](#instance-options)
- [Option Inheritance](#option-inheritance)

## Instance Options

The TypeRest initializer takes in an options argument with the following
signature.

```typescript
interface ITypeRestOptions {
    hooks: IHookDefinition[];
    params: ITypeRestParams;
    pathStyle: ValidPathStyles;
    encoding: {
        requestContentType: string;
        requestAcceptType: string;
        requestEncoder: (data: TRequest) => Promise<string>;
        responseDecoder: (response: Response) => Promise<TResponse>;
    },
    trailingSlash: boolean
    fetch: FetchImplementation;
}
```

### hooks

See [Hooks](HOOKS.md)

### params

`params` is a set of
[Fetch Parameters](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#parameters)
to be included in every request. By default, params are not set and will
use fetch's defaults.

### pathStyle

Path style defines how the url path will be built.

It can be on of the following:

`"none"` - do not transform, separated by "/"

*pathOne.pathTwo.pathThree => pathOne/pathTwo/pathThree*

`"dashed"` - converted to dashed, separated by "/"

*pathOne.pathTwo.pathThree => path-one/path-two/path-three*

`"snakeCase"` - converted to snake case, separated by "/"

*pathOne.pathTwo.pathThree => path_one/path_two/path_three*

`"lowerCased"` - converted to all lower case, separated by "/"

*pathOne.pathTwo.pathThree => pathone/pathtwo/paththree*

`"upperCased"` - converted to all lower case, separated by "/"

*pathOne.pathTwo.pathThree => PATHONE/PATHTWO/PATHTHREE*

Or you can define your own function. Your function should take in
`string[]` (path parts), and return a `Promise<string>`

```typescript
/**
* Converts path to custom format
* (part_one.part_two => part-one,part-two)
* @param pathParts parts of the path to be encoded
*/
async function customPathEncoder(pathParts: string[]): Promise<string> {
    return pathParts.map(part => part.replace(/_/g, "-")).join(",");
}
```

Encoding of the path can be defined/changed at any point in the path. If
a new encoder is defined in the sub-tree of an api spec, that encoder
will only be used for that and its child parts.

```typescript
import {typeRest} from "type-rest";

// use dashed style by default 
const api = typeRest("http://api/", {pathStyle: "dashed"});

// used snakeCase for aB.cD,eF and everything after it
api.aB.cD.eF._options.pathStyle = "snakeCase";

// use a custom path encoder for the path style
api.aA._options.pathStyle = async (p) => 
    p.map(s => s.toLowerCase()).join(",");

// This is how the uris will be generated
api.aB.cD.eF.gH._uri === "http://api/a-b/c-d/e_f/g_h/";
api.aA.bB.cC._uri === "http://api/aa,bb,cc/";
```

### encoding

`encoding` defines the content type and accepts headers, as well as
encoder and decoder functions for the request and response bodies.

Type Rest by default assumes everything is JSON based, and uses
`CommonEncodings.jsonToJson` spec.

There are a variety of common encoding specifications included in the
[`CommonEncodings`](../src/encoding/common.ts) object, which can be
used, or you can create your own.

### trailingSlash

A simple boolean to turn trailing slashes on URL's on or off. This
option applies to the route it's set on, and every child route as well.

### fetch

`fetch` can be set to change to a different implementation of fetch.
Type Rest by default uses "cross-fetch", which uses window.fetch, a polyfill, or
node-fetch and should work in most JS environments.

## Option Inheritance

All options are inherited from the route above unless overridden.

```typescript
import {typeRest} from "type-rest"; 

const api = typeRest("http://api.local/", {
    trailingSlashes: true
});
api.subPath2._options.trailingSlashes = false;

// will have trailing slash
await api.subPath1._uri === "http://api.local/sub-path1/";
await api.subPath1.secondLevel._uri === "http://api.local/sub-path1/second-level/";

// will not have trailing slash
await api.subPath2._uri === "http://api.local/sub-path2/second-level";
await api.subPath2.secondLevel._uri === "http://api.local/sub-path2/second-level";
```

