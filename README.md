Dynamic Rest
============

A simple fetch wrapper made for TypeScript which allows you fully define
an API and give users of it type hinting when working with TypeScript.

## How to Use

There are two ways to use Dynamic Rest. First, you can use it in "Untyped"
mode which allows a developer to make calls to any end-point. Second, in 
"Typed" mode where an api can be fully defined.

All data transfers are to be assumed to be JSON. 

All calls are made with `fetch`. This means you need to have either target
a browser with fetch or include a polyfill for fetch.

All calls are validated, and any non-2xx response will "throw" and cause
the promise to error. This is to ensure that the "returned" result will 
be of the type defined.

Any errored called will return the raw `Response` from fetch. It is up to
the individual developer to check the Response for the type of error. 
e.g. http 500, network down, dns failure, etc.

Put is a special case. Instead of taking an object, it expects to be given
`FormData` object in order to upload files. See the docs for Fetch. 


### End Points

Assume for all the following examples that the api was created as follows:

`const api = dynamicRest("https://domain.tld/api")`

| Method              | API                                                      | Real Call                                                             |
|---------------------|----------------------------------------------------------|-----------------------------------------------------------------------|
| Get                 | `api.customers[0].Get()`                                 | GET `https://domain.tld/api/customers/0/`                             |
| Get (With Query)    | `api.customers[0].Get({a: "foo"})`                       | GET `https://domain.tld/api/customers/0/?a=foo`                       |
| Post                | `api.customers.Post({firstName: "Joe"})`                 | POST `https://domain.tld/api/customers/` `{"firstName":"Joe"}`        |
| Post (With Query)   | `api.customers.Post({a: "foo"}, {firstName: "Joe"})`     | POST `https://domain.tld/api/customers/?a=foo` `{"firstName":"Joe"}`  |
| Patch               | `api.customers[0].Patch({firstName: "Joe"})`             | PATCH `https://domain.tld/api/customers/0/` `{"firstName": "Joe"}`    |
| Patch (With Query)  | `api.customers[0].Patch({a: "foo"}, {firstName: "Joe"})` | PATCH `https://domain.tld/api/customers/?a=foo` `{"firstName":"Joe"}` |
| Delete              | `api.customers[0].Delete()`                              | DELETE `https://domain.tld/api/customers/0/`                          |
| Delete (With Query) | `api.customers[0].Delete({a: "foo"})`                    | DELETE `https://domain.tld/api/customers/0/?a=foo`                    |
 


### UnTyped Usage

To use Dynamic Rest without typing out an API is very simple:

```javascript
const api = require("dynamic-rest").dynamicRest("https://domain.tld/api");


const customers = await api.customers.Get(); // HTTP GET "https://domain.tld/api/customers/"
await api.customers[123].Delete(); // HTTP DELETE "https://domain.tld/api/customers/0/"
```

### Typed Usage

The use Dynamic Rest with types applied, there are a few steps needed.
A more "complete" sample can be see in the "samples" folder in this
project. Below is a very simple example.

api-definition.d.ts

```typescript
import {WithNone, WithBody, WithQuery} from "dynamic-rest";

export interface Api {
    Get: WithNone<IDashboardResponse>;
    todos: ITodosRoute;
}

interface ITodosRoute {
    Get: WithQuery<TodoListQuery, TodoListResponse>;
    Post: WithBody<TodoListCreateBody, ITodo>;
    [todoId: number]: ITodoRoute;
}

interface ITodoRoute {
    Get: WithNone<ITodo>;
    Delete: WithNone<void>;
}

interface ITodo {
    id: number;
    date: string,
    title: string,
    description: string;
}

interface IDashboardResponse {
    openTodos: number;
    closedTodos: number;
}

interface TodoListQuery {
    sortItem: keyof ITodo;
    sortDirection: "ASC" | "DESC";
}

type TodoListResponse = ITodo[];
type TodoListCreateBody = Pick<ITodo, "date" | "title" | "description">

```

Then, once you have your "Api", you can create an instance of, and use, it.

```typescript
import {Api} from "./api-definition"
import {dynamicRest} from "dynamic-rest";

const api = dynamicRest<Api>("https://domain.tld/api");

const dashboard = await api.dashboard.Get();
const allTodos = await api.todos.Get({sortItem: "date", sortDirection: "DESC"});
const singleTodo = await api.todos[0].Get();
singleTodo.title = "New Title";
await api.todos[0].Patch(singleTodo);

await api.todos[0].Delete();
```