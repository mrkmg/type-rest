Type Rest
=========

A simple fetch wrapper made with for TypeScript to pragmatically build
endpoints, requests, and responses a for a Rest API. API Developers can
use, and/or distribute a typed interface to allow for IDE code
completion on their APIs inside of TypeScript projects.

- [Quick Start](#quick-start)
- [Examples](#examples)
- [Description](#description)
- [How to Use](docs/GUIDE.md)
- [Options](docs/OPTIONS.md)
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

```typescript
import {typeRest, WithNone, WithBody, WithQuery, IHook, Merge} from "type-rest";

interface ApiRoute {
    authentication: AuthenticationRoute;
    todos: Merge<TodosRoute, {[todo: string]: TodoRoute}>;
}

interface AuthenticationRoute {
    Get: WithNone<{authenticated: boolean}>;
    Post: WithBody<{username: string, password: string}, {result: boolean, token?: string, error?: string}>;
    Delete: WithNone<void>;
}

interface TodosRoute {
    Get: WithQuery<{page: number, limit?: number}, Todo[]>;
    Post: WithBody<Omit<Todo, "id" | "completed">>;
}

interface TodoRoute {
    Get: WithNone<Todo>;
    Patch: WithBody<Partial<Omit<Todo, "id">>>;
    Delete: WithNone<void>;
}

interface Todo {
    id: string;
    date: string;
    title: string;
    completed: boolean;
}

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

const Api = typeRest<ApiRoute>("https://some-url/api", {
    hooks: [loginHook, logoutHook],
    params: {
        mode: "cors",
    }
});

// Login
await Api.authentication.Post({username: "testuser", password: "testpassword"});

// Get list of todos
const todos = await Api.todos.Get({limit: 5});

// Set first in list to completed
await Api.todos[todos[0].id].Patch({completed: true});

// Logout
await Api.authentication.Delete();
```

Full featured examples can be found in the samples directory of the
source tree. To run the samples, clone this project, install the
dependencies, and run:

```shell script
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

Type Rest is by default opinionated to JSON based Rest centric APIs. All
request bodies and responses are expected to be in json. The use of HTTP
Verbs like GET, POST, etc are central to making sure the usage makes
sense. Paths by default are *converted-to-dash-case*. All the encoding
can be altered through configuration changes.

Type Rest also provides a hook system to trigger actions before or after
a request. These hooks can modify the requests, the responses, or
trigger side effects.

Under the hood, Type Rest uses fetch with one major difference. **All
non-successful calls are rejected.** This includes 4xx and 5xx server
errors. This is a change from normal fetch usage, and was a design
decision made by me. In my opinion, a 4xx or 5xx should never occur in a
well-designed API *except* in rare exceptional cases.

See the [Guide](docs/GUIDE.md) for how to setup Type Rest.


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
