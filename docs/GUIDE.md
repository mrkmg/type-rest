## How to Use

To provide a typed interface to for an api, first build an API
definition, then create an instance of Type Rest using those types.

## Building the API Definition

- [Defining your API](#defining-your-api)
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
models, second is the routes and end points, third is the requests and
responses, and finally creating the instance. Routes are paths of your
api, end points are the HTTP verbs, data is the request and response
data, and the instance is what brings all those together into a usable
api.

### Defining your API

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
    Get: WithQuery<{page?: number, limit: number}, ITodo[]>;
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
```

#### Bringing the Routes Together

Put all the routes together and define the root of your API.

routes.ts

```typescript
import {Merge} from "type-rest";
import {IAuthenticationRoute} from "./authentication-route";
import {ITodosRoute} from "./todos-route";
import {ITodoRoute} from "./todo-route"

export interface IAwesomeApiRoutes {
    authentication: IAuthenticationRoute;
    todos: Merge<ITodosRoute, { [id: string]: ITodoRoute; }>;
}
```

### Creating the Instance

Pass in the API definition as the type parameter to the typeRest
initializer. This tells TypeScript that the instance of Type Rest
follows that definition, and return a proxy object which allows for the
calls to made out to fetch using your hooks and options.

awesome-api.ts

```typescript
import {typeRest} from "type-rest";
import {IAwesomeApiRoutes} from "./routes";

export const AwesomeApi = typeRest<IAwesomeApiRoutes>("https://awesome-app/api/v1/");
```

Now you can import `AwesomeApi` and have a pragmatic, code-completion
friendly way to interact with the Rest API.

```typescript
import {AwesomeApi} from "./awesome-api.ts"

const todos = await AwesomeApi.todos.Get({limit: 10});
```

See [Options](OPTIONS.md) for all options. See [Hooks](HOOKS.md) for how
to define and use hooks.

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

