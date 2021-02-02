Type Rest
=========

A simple fetch wrapper made for TypeScript to pragmatically build paths,
requests, and responses a JSON Rest API. Developers can use, and/or
distribute a typed interface to allow for IDE code completion on their
APIs with only a definition.

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
import {typeRest, WithNone, WithBody, WithQuery, IHook} from "type-rest";

const loginHook: IHook = {
     hook: (ev) => {
         if (!ev.response.result) return Promise.reject(ev.response.error);
         ev.instance._options.params.headers.token = ev.response.token; 
     },
     method: "POST",
     route: "/authentication/",
 };

const logoutHook: IHook = {
    hook: (ev) => {
        delete ev.instance._options.params.headers.token;
    },
    method: "DELETE",
    route: "/authentication/",
};

export const Api = typeRest<ApiRoute>("https://some-url/api", {
    hooks: [loginHook, logoutHook],
    params: {
        mode: "cors",
    }
});

export interface ApiRoute {
    authentication: AuthenticationRoute;
    todos: TodosRoute;
}

export interface AuthenticationRoute {
    Get: WithNone<{authenticated: boolean}>;
    Post: WithBody<{username: string, password: string}, {result: boolean, token?: string, error?: string}>;
    Delete: WithNone<void>;
}

export interface TodosRoute {
    Get: WithQuery<{page: number, limit?: number}, Todo[]>;
    Post: WithBody<Pick<Todo, Exclude<keyof Todo, "id" | "completed">>, Todo>;
    [todoId: number]: TodoRoute;
}

export interface TodoRoute {
    Get: WithNone<Todo>;
    Patch: WithBody<Partial<Todo>, Todo>;
    Delete: WithNone<void>;
}

export interface Todo {
    id: number;
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

Type Rest is intended to be used to provide a simple to use interface to
a well defined JSON-based API. All endpoints, query params, and body
params can be typed out via TypeScript and the provided types, and then
passed to an instance of type-rest which will then convert those typed
routes into callable functions.

Type Rest also provides a hook system to trigger actions before and
after a request. The hooks can modify requests as well as trigger
side-effects with the response.

In order to provide a typed interface to your api, you must first build
your API definition. This is done by using the included helper
definitions.

Under the hood, Type Rest uses fetch with one major difference. All
non-successful calls are rejected. This includes 4xx and 5xx server
errors.

## How to Use

Once you have a defined API and exported an instance of Type Rest with
your API definition, you or other developers, will be able to call
endpoints to your api. Enjoy code-completion and typescript warnings and
errors about the request objects and usage of the response objects.


## Building the API Definition

- (Declaring your api)[#declaring-your-api]
  - (Create a Route)[#create-a-route]
  - (Create a Model)[#create-a-model]
  - (Create Advanced Route)[#create-advanced-route]
  - (Bringing the Routes Together)[#bringing-the-routes-together]
- (Creating the Instance)[#creating-the-instance]

One of the core concepts of Type Rest is fully defining all the input
and output types of the restful calls. Using the powerful type system
built into TypeScript combined with the flexibility of Type Rest, almost
any situation can be accounted for.

There 4 concepts to creating your Typed API. First is the routes, second
are the end points, third are the input and output data, and finally the
instance. Routes are paths of your api, end points are the HTTP verbs,
data is the request and response data, and the instance is what brings
all those together into a usable api.

### Declaring your api

Lets take the following API as an example.

```text
ROOT https://awesome-app/api/v1/

Get authentication status
GET /authentication

Authenticate with the api
POST /authentication

Remove authentication
DELETE /authentication

Get a list of todos
GET /todos

Get a single todo
GET /todos/{id}

Create a todo
POST /todos

Update a todo
PATCH /todos/{id}

Delete a todo
DELETE /todos/{id}
```

#### Create a Route

Using the list of end points above, we can create all the definitions we
need. Looking at the api, we have two first-level routes:
"authentication" and "todos". Lets start with the authentication route.
Within authentication, we have 3 end-points, "GET, POST, and DELETE". We
can directly type those.


authentication-route.ts

```typescript
import {WithBody, WithNone} from "type-rest";

export interface IAuthenticationRoute {
    Get: WithNone<{authenticated: boolean}>;
    Post: WithBody<{username: string, password: string}, {result: boolean, token?: string, error?: string}>;
    Delete: WithNone<void>;
}
```

#### Create a Model

Next, we can start typing out the "todos" route. First thing to do is to
declare a Todo.

todo.ts

```typescript
export interface ITodo {
    id: number;
    date: string;
    title: string;
    completed: boolean;
}
```

#### Create Advanced Route

After we have the Todo interface, we will need to declare the route.

todos-route.ts

```typescript
import {WithBody, WithQuery} from "type-rest";
import {ITodo} from "./todo";

export interface ITodosRoute {
    Get: WithQuery<{page: number, limit?: number}, ITodo[]>;
    Post: WithBody<Omit<ITodo, "id" | "completed">>;
}
```

Here we see the TypeScript Utility Type `Omit`. One of the most powerful
features of type-rest is the use of TypeScript types and its Utility
Types.

We are still missing the routes which work on a single todo. Let's
declare that route separately first.

todo-route.ts

```typescript
import {WithBody, WithNone} from "type-rest";
import {ITodo} from "./todo";

export interface IIndexedTodoRoute {
    [id: string]: ITodoRoute;
}

export interface ITodoRoute {
    Get: WithNone<ITodo>;
    Patch: WithBody<Partial<ITodo>, ITodo>;
    Delete: WithNone<void>;
}
```

#### Bringing the Routes Together

Now that we have that route, we can modify our "TodosRoute" to include
it. Seeing as the route is variable to the id of the Todo, we can use
the "index" property in typescript.

Now, all of our routes are defined. We just need to bring it all
together into a single "root" route which defines the entire API.


routes.ts

```typescript
import {IAuthenticationRoute} from "./authentication-route";
import {ITodosRoute} from "./todos-route";
import {IIndexedTodoRoute} from "./todo-route"

export interface IAwesomeApiRoutes {
    authentication: IAuthenticationRoute;
    todos: ITodosRoute & IIndexedTodoRoute;
}
```

### Creating the instance

We have the entire API declared and want to be actually use it in our
application. Pass in your API declaration as the type parameter to the
type-rest initializer.

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

TypeRest will attempt to use `window.fetch`, `global.fetch`, then to
import `node-fetch`. If none of those are available and a custom
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

`hooks`: see (Hooks)[#hooks]

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
request or response or trigger side effects. The primary purpose of the
hooks is to handle authentication tokens, headers, caching, etc. Many
APIs require a token to be sent with every request. This token can
either be given to the developer, or returned as part of an
authentication request.

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

There are two separate hooks, a login and logout hook. The login
hook will be executed after a "POST" call to the /authentication/ route.
The logout hook will only be executed after a "DELETE" call the
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
