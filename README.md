Type Rest
=========

A simple fetch wrapper made with for TypeScript to pragmatically build
paths, requests, and responses a JSON Rest API. Developers can use,
and/or distribute a typed interface to allow for IDE code completion on
their APIs with only a definition.

- [Quick Start](#quick-start)
- [Examples](#examples)
- [Description](#description)
- [How to Use](#how-to-use)
- [Options](#options)
- [License](#license)


## Quick Start

```shell
npm install --save type-rest
# or
npm i -s type-rest
```

## Examples

Quick untyped example.

```typescript
import {typeRest} from "/type-rest";

const api = typeRest("http://api-server.local/v1/");

const allTodos = await api.todos.Get();
const singleTodo = await api.todos[1].Get();
const todo = await api.todos.Post({title: "Some Task", completed: false});
await api.todos[todo.id].Patch({completed: true});
```

Quick typed example:

api.ts

```typescript
import {typeRest, WithNone, WithBody, WithQuery, IHook, Merge} from "type-rest";

const loginHook: IHook = {
     hook: (ev) => {
         if (!ev.response.result) return Promise.reject(ev.response.error);
         ev.instance._options.params.headers.token = ev.response.token; 
     },
     method: "POST",
     route: "/authentication/",
     type: "post",
 };

const logoutHook: IHook = {
    hook: (ev) => {
        delete ev.instance._options.params.headers.token;
    },
    method: "DELETE",
    route: "/authentication/",
    type: "post",
};

export const Api = typeRest<ApiRoute>("https://some-url/api", {
    hooks: [loginHook, logoutHook],
    params: {
        mode: "cors",
    }
});

export interface ApiRoute {
    authentication: AuthenticationRoute;
    todos: Merge<TodosRoute, IndexedTodosRoute>;
}

export interface AuthenticationRoute {
    Get: WithNone<{authenticated: boolean}>;
    Post: WithBody<{username: string, password: string}, {result: boolean, token?: string, error?: string}>;
    Delete: WithNone<void>;
}

export interface TodosRoute {
    Get: WithQuery<{page: number, limit?: number}, Todo[]>;
    Post: WithBody<Omit<Todo, "id" | "completed">>;
}

export interface IndexedTodosRoute {
    [todo: string]: TodoRoute;
}

export interface TodoRoute {
    Get: WithNone<Todo>;
    Patch: WithBody<Partial<Omit<Todo, "id">>>;
    Delete: WithNone<void>;
}

export interface Todo {
    id: string;
    date: string;
    title: string;
    completed: boolean;
}
```

Now you can use that API. Typescript will check the types of all request
and response objects.

```typescript
import {Api} from "./api";

async function testApi() {
    const authStatus = await Api.authentication.Get();
    
    if (!authStatus.authenticated) {
        await Api.authentication.Post({username: "test", password: "test"});
        // Due to the hook define, this will add the appropriate token header to all future API calls
    }
    
    const todos = await Api.todos.Get({page: 2}); // List page two
    const todo = await Api.todos[1].Get(); // Get to-do with ID 1
    await Api.todos[todo.id].Delete(); // Delete that to-do
}

```

Full featured examples can be found in the samples directory of the
source tree. To run the samples, clone this project, install the
dependencies, and run:

```text
# Clone project
git clone https://github.com/mrkmg/type-rest.git && cd type-rest

# Install Dependencies
npm install

# Run the untyped sample
npx ts-node samples/untyped/untypedApi.ts

# Run the typed sample
npx ts-node samples/types/typedApi.ts
```

## Description

Type Rest is provides a simple-to-use interface to a well-defined
JSON-based API. All endpoints, query params, and body objects can be
defined through the use TypeScript and the provided types. That
definition is passed to an instance of Type Rest which translates those
defined routes to callable functions.

Type Rest is opinionated to JSON based Rest centric APIs. All request
bodies and responses are expected to be in json. The use of HTTP Verbs
like GET, POST, etc are central to making sure the usage makes sense.
Paths by default are *converted-to-dash-case*.

Type Rest also provides a hook system to trigger actions before or after
a request. These hooks can modify the requests, the responses, or
trigger side effects.

Under the hood, Type Rest uses fetch with one major difference. **All
non-successful calls are rejected.** This includes 4xx and 5xx server
errors. This is a change from normal fetch usage, and was a design
decision made by me. In my opinion, a 4xx or 5xx should never occur in a
well-designed API *except* in rare exceptional cases.

## How to Use

To provide a typed interface to for an api, first build an API
definition, then create an instance of Type Rest using those types.

## Building the API Definition

- [Declaring your api](#declaring-your-api)
  - [Create a Model](#create-a-model)
  - [Create a Route](#create-a-route)
  - [Create Advanced Route](#create-advanced-route)
  - [Bringing the Routes Together](#bringing-the-routes-together)
- [Creating the Instance](#creating-the-instance)

One of the core concepts of Type Rest is fully defining all the input
and output types of the restful calls. Using the powerful type system
built into TypeScript combined with the flexibility of Type Rest, almost
any situation can be accounted for.

There are 4 concepts to creating your Typed API. First is the data
models, second is the routes and end points, third is the input and
output data, and finally creating the instance. Routes are paths of your
api, end points are the HTTP verbs, data is the request and response
data, and the instance is what brings all those together into a usable
api.

### Declaring your api

Take the following API as an example.

```text
ROOT https://awesome-app/api/v1/

GET /authentication
POST /authentication
DELETE /authentication
GET /todos
GET /todos/{id}
POST /todos
PATCH /todos/{id}
DELETE /todos/{id}
```


#### Create a Model

Assuming the following is a correct representation of a Todo object.

todo.ts

```typescript
export interface ITodo {
    id: string;
    date: string;
    title: string;
    completed: boolean;
}
```

#### Create a Route

Within authentication, we have 3 end-points, "GET, POST, and DELETE". We
can directly type those as they are simple, single use data definitions.

authentication-route.ts

```typescript
import {WithBody, WithNone} from "type-rest";

export interface IAuthenticationRoute {
    Get: WithNone<{authenticated: boolean}>;
    Post: WithBody<{username: string, password: string}, {result: boolean, token?: string, error?: string}>;
    Delete: WithNone<void>;
}
```

#### Create Advanced Route

The todo routes are a bit more complicated. There is a "GET" and a
"POST" on /todo, but also any number of possible /todo/{id} routes. For
this, TypeScript's indexer syntax can be useful.

Define the simple "GET" and "POST" as it's own route.

todos-route.ts

```typescript
import {WithBody, WithQuery} from "type-rest";
import {ITodo} from "./todo";

export interface ITodosRoute {
    Get: WithQuery<{page: number, limit?: number}, ITodo[]>;
    Post: WithBody<Omit<ITodo, "id" | "completed">>;
}
```

Define the "GET","PATCH", and "DELETE" in its own type. Use an indexing
type to define the variability of the path. Only `string` or `number`
can be used as an indexing type *(this is a limitation of Type
Script/Javascript)*.

todo-route.ts

```typescript
import {WithBody, WithNone} from "type-rest";
import {ITodo} from "./todo";

export interface ITodoRoute {
    Get: WithNone<ITodo>;
    Patch: WithBody<Partial<ITodo>, ITodo>;
    Delete: WithNone<void>;
}

export interface IIndexedTodoRoute {
    [id: string]: ITodoRoute;
}
```

#### Bringing the Routes Together

Put all the routes together and define the root of your API.

routes.ts

```typescript
import {Merge} from "type-rest";
import {IAuthenticationRoute} from "./authentication-route";
import {ITodosRoute} from "./todos-route";
import {IIndexedTodoRoute} from "./todo-route"

export interface IAwesomeApiRoutes {
    authentication: IAuthenticationRoute;
    todos: Merge<ITodosRoute, IIndexedTodoRoute>;
}
```

### Creating the instance

The entire API is defined and next is to actually use i. Pass in the API
definition as the type parameter to the type-rest initializer. This
tells TypeScript that the instance of Type Rest follows that definition.

awesome-api.ts

```typescript
import {typeRest} from "type-rest";
import {IAwesomeApiRoutes} from "./routes";

export const AwesomeApi = typeRest<IAwesomeApiRoutes>("https://awesome-app/api/v1/");
```

Now you can import `AwesomeApi` and have a pragmatic, code-completion
friendly way to interact with the Rest API.

## Options

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
}
```

`hooks`: see [Hooks](#hooks)

`params`: are any of *"mode", "cache", "credentials", "headers",
"redirect", or "referrer"* and are passed directly into fetch.

`pathStyle` can be one of *"lowerCased", "upperCased", "dashed",
"snakeCase"*, "none" or a function which takes a path part and returns a
formatted path part. The default style is *"dashed"*. Look at
`test/pathing.test.ts` to see examples.

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

### Hooks

Built into type rest is the ability to hook into requests to modify the
request data, response object, or trigger side effects. The primary
purpose of the hooks is to handle authentication tokens, headers,
caching, etc. Many APIs require a token to be sent with every request.
This token can either be given to the developer, or returned as part of
an authentication request.

In the above example, we can see that the authentication result returns
a token. If we were required to pass this token in all future requests,
the user of the API would need to modify the api params.

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

## Possible End Points

A complete list of all valid endpoint definitions recognized by Type
Rest. Invalid definitions may be used, but the result it not always
determinate.

```typescript
import {
    WithNone, WithQuery, WithBody, WithBodyAndQuery, WithOptionalQuery,
    WithBodyAndOptionalQuery, WithOptionalBodyAndOptionalQuery} from "type-rest";
 
interface AllValidEnpoints {
    Delete: WithNone<ReturnDefinition>;
    Delete: WithQuery<QueryDefinition, ReturnDefinition>;
    Delete: WithOptionalQuery<QueryDefinition, ReturnDefinition>;
    Get: WithNone<ReturnDefinition>;
    Get: WithQuery<QueryDefinition, ReturnDefinition>;
    Get: WithOptionalQuery<QueryDefinition, ReturnDefinition>;
    Patch: WithNone<ReturnDefinition>;
    Patch: WithBody<BodyDefinition, ReturnDefinition>;
    Patch: WithBodyAndQuery<BodyDefinition, QueryDefinition, ReturnDefinition>;
    Patch: WithBodyAndOptionalQuery<BodyDefinition, QueryDefinition, ReturnDefinition>;
    Patch: WithOptionalBodyAndOptionalQuery<BodyDefinition, QueryDefinition, ReturnDefinition>;
    Post: WithNone<ReturnDefinition>;
    Post: WithBody<BodyDefinition, ReturnDefinition>;
    Post: WithBodyAndQuery<BodyDefinition, QueryDefinition, ReturnDefinition>;
    Post: WithBodyAndOptionalQuery<BodyDefinition, QueryDefinition, ReturnDefinition>;
    Post: WithOptionalBodyAndOptionalQuery<BodyDefinition, QueryDefinition, ReturnDefinition>;
    Put: WithNone<ReturnDefinition>;
    Put: WithBody<BodyDefinition, ReturnDefinition>;
    Put: WithBodyAndQuery<BodyDefinition, QueryDefinition, ReturnDefinition>;
    Put: WithBodyAndOptionalQuery<BodyDefinition, QueryDefinition, ReturnDefinition>;
    Put: WithOptionalBodyAndOptionalQuery<BodyDefinition, QueryDefinition, ReturnDefinition>;
    
}
```

## License

Copyright 2019-2021 Kevin Gravier

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
