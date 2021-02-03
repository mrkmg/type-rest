# Type Rest Options

There are two different sets of options, global defaults, and instance
specific options.

### Global Options

There is only one "global" option, which allows you to override or set
the fetch implementation for all type-rest instances.

```typescript
import {TypeRestDefaults} from "type-rest";

TypeRestDefaults.fetchImplementation = fetch;
```

TypeRest will attempt to use `window.fetch`, `global.fetch`, and then to
import `node-fetch`. If none of those are available, and a custom
implementation is not set, an error will throw on every request.

### Instance Options

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
    }
}
```

`hooks`: see [Hooks](HOOKS.md)

`params`: are any of *"mode", "cache", "credentials", "headers",
"redirect", or "referrer"* and are passed directly into fetch.

`pathStyle` can be one of *"lowerCased", "upperCased", "dashed",
"snakeCase"*, "none" or a function which takes a path part and returns a
formatted path part. The default style is *"dashed"*. Look at
`test/pathing.test.ts` to see examples.

`encoding` is an object which defines

The options are inherited to all paths "below" it unless defined itself
and can be adjusted at any point in the path.

```typescript
const api = typeRest("http://api.local/", {
    pathStyle: "none"
});
api.subPath1._options.pathStyle = "snakeCase";
api.subPath2._options.pathStyle = "dashed";

await api.Get(); // will use none
await api.subPath1.Get(); // will use snakeCase
await api.subPath2.Get(); // will use dashed
await api.subPath2.secondLevel.Get(); // will use dashed
await api.subPath3.Get(); // will use none
```