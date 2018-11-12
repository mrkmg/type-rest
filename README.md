Type Rest
============

A simple fetch wrapper made for TypeScript which allows developers to
create and distribute a typed interface to their APIs.

## Quick Start

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

## Intended Use

Type Rest is intended to be used by "api owners" who wish to provide
a fully typed interface to their restful json based api. Body data 
and return data are both assumed to be json.

In order to provide a typed interface to your api, you must first build
your API definition. This is done by using the included helper 
definitions.

Under the hood, Type Rest uses fetch with one major difference. All
non-successful calls are rejected. This includes 4xx and 5xx server 
errors.

## How to Use

Once you have a defined API and exported an instance of Type Rest with
your API definition, you or other developers, will be able to call 
endpoints to your api.

From the example above:

```typescript
import {Api} from "./api";

async function testApi() {
    const authStatus = await Api.authentication.Get();
    
    if (!authStatus.authenticated) {
        await Api.authentication.Post({username: "test", password: "test"});
        // Due to the hook define, this will add the appropiate token header to all future API calls
    }
    
    const todos = await Api.todos.Get({page: 2}); // List page two
    const todo = await Api.todos[1].Get(); // Get to-do with ID 1
    await Api.todos[1].Delete(); // Delete to-do with ID 1
}

```

## Building the API Definition

One of the core concepts of Type Rest is fully defining all the input
and output types of the restful calls. Using the powerful type system
built into TypeScript combined with the flexibility of Type Rest, 
almost any situation can be accounted for. 

There 4 concepts to creating your Typed API. First is the routes,
second are the end points, third are the input and output data, and finally 
the instance. Routes are paths of your api, end points 
are the HTTP verbs, data is the request and response data, and the
instance is what brings all those together into a usable api.

### Defining your api

Lets take the following API as an example:

```text
ROOT    https://awesome-app/api/v1/

Authentication

GET /authentication
Get authentication status

POST /authentication
Authenticate with the api

DELETE /authentication
Remove authentication

GET /todos
Get a list of todos

GET /todos/{id}
Get a single todo

POST /todos
Create a todo

PATCH /todos/{id}
Update a todo

DELETE /todos/{id}
Delete a todo
```

Using the list of end points above, we can create all the definitions we need.

Looking at the api, we have two first-level routes: "authentication" and 
"todos". Lets start with the authentication route.

Within authentication, we have 3 end-points, "GET, POST, and DELETE". We can
directly type those.

```typescript
import {WithNone, WithBody} from "type-rest";

export interface AuthenticationRoute {
    Get: WithNone<{authenticated: boolean}>;
    Post: WithBody<{username: string, password: string}, {result: boolean, token?: string, error?: string}>;
    Delete: WithNone<void>;
}
```

Next, we can start typing out the "todos" route. First thing to do is to type out a Todo.

```typescript
export interface Todo {
    id: number;
    date: string;
    title: string;
    completed: boolean;
}
```

After we have the Todo interface, we will need to type out the route.

```typescript
import {WithQuery, WithBody} from "type-rest";
import {Todo} from "./todo";

export interface TodosRoute {
    Get: WithQuery<{page: number, limit?: number}, Todo[]>;
    Post: WithBody<Pick<Todo, Exclude<keyof Todo, "id" | "completed">>, Todo>;
}
```

Here we see an advanced type. Basically what the `Pick<Todo, Exclude<keyof Todo, "id" | "completed">>`
means is the all the keys of `Todo` except "id" and "completed".

But we are missing the routes which work on a single todo.
Lets type that route out separately first.

```typescript
import {WithNone, WithBody} from "type-rest";
import {Todo} from "./todo";
export interface TodoRoute {
    Get: WithNone<Todo>;
    Patch: WithBody<Partial<Todo>, Todo>;
    Delete: WithNone<void>;
}
```

Now that we have that route, we can modify our "TodosRoute" to include 
it. Seeing as the route is variable to the id of the Todo, we can use
the "index" property in typescript.

```typescript
import {WithQuery, WithBody} from "type-rest";
import {Todo} from "./todo";
import {TodoRoute} from "./todo-route";

export interface TodosRoute {
    Get: WithQuery<{page: number, limit?: number}, Todo[]>;
    Post: WithBody<Pick<Todo, Exclude<keyof Todo, "id" | "completed">>, Todo>;
    [todoId: number]: TodoRoute;
}
```

Now, all of our routes are defined. We just need to bring it all 
together into a single "root" route which defines the entire API.

```typescript
import {TodosRoute} from "./todos-route";
import {AuthenticationRoute} from "./authentication-route";

export interface AwesomeApiRoutes {
    authentication: AuthenticationRoute;
    todos: TodosRoute;
};
```

### Creating the instance

We have the entire API typed out, and want to be actually use it in
our application. This is very easy:

```typescript
import {AwesomeApiRoutes} from "./routes";
import {typeRest} from "type-rest";

export const AwesomeApi = typeRest<AwesomeApiRoutes>("https://awesome-app/api/v1/");
```

Now, anywhere else in your app, you can use the "AwesomeApi" to make 
requests to your api!

## Hooks

Built into type rest is the ability to hook into requests to modify
the api instance, or trigger side effects. The primary purpose of the
hooks is to handle authentication tokens and headers. Many API's require
a token to be sent with every request. This token can either be given
to the developer, or returned as part of an authentication request.

MORE TO COME ON HOOKS