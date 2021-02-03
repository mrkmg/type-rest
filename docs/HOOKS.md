# Type Rest Hooks

Built into type rest is the ability to hook into requests to modify the
request data, response object, or trigger side effects. The primary
purpose of the hooks is to handle authentication tokens, headers,
caching, etc. Many APIs require a token to be sent with every request.
This token can either be given to the developer, or returned as part of
an authentication request.

Using the example in the [Readme](../README.md), we can see that the
authentication result returns a token. If we were required to pass this
token in all future requests, the user of the API would need to modify
the api params.

```typescript
import {AwesomeApi} from "./awesome-api.ts"

const result = AwesomeApi.authentication.Post({username: "user", password: "pass"});

if (result.valid) {
    AwesomeApi._options.params.headers["auth-token"] = result.token;
}
```

If you as the API developer wanted to automate this for the consumers of
your API, you can use the hooks system.

hooks.ts

```typescript
import {IHook} from "type-rest";

export const loginHook: IHook = {
    hook: (ev) => {
        if (!ev.response.result) { return Promise.reject(ev.response.error); }
        ev.instance._options.params.headers["auth-token"] = ev.response.token;
    },
    method: "POST",
    route: "/authentication/",
    type: "post",
};

export const logoutHook: IHook = {
    hook: (ev) => {
        delete ev.instance._options.params.headers["auth-token"];
    },
    method: "DELETE",
    route: "/authentication/",
    type: "post",

};
```

awesome-api-with-hooks.ts

```typescript
import {typeRest} from "type-rest";
import {loginHook, logoutHook} from "./hooks";
import {IAwesomeApiRoutes} from "./routes";

export const AwesomeApi = typeRest<IAwesomeApiRoutes>("https://awesome-app/api/v1/", {
    hooks: [loginHook, logoutHook],
});
```

There are two separate hooks, a login and logout hook. The login hook
will be executed after a "POST" call to the /authentication/ route. The
logout hook will only be executed after a "DELETE" call the
/authentication/ route.

#### Adding hooks at runtime

If you have an instance of Type Rest, and want to add a hook, you can
use the `_addHook` method. From the examples above:

```typescript
import {typeRest} from "type-rest";
import {loginHook, logoutHook} from "./hooks";
import {IAwesomeApiRoutes} from "./routes";

export const AwesomeApi = typeRest<IAwesomeApiRoutes>("https://awesome-app/api/v1/");

AwesomeApi._addHook(loginHook);
AwesomeApi._addHook(logoutHook);
```

Important: If `_addHook` is called from a sub-path, the hook will only
apply to the route and its child-routes, regardless of the "path"
property.
