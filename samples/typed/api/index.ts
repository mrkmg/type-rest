import {HookType, typeRest, TypeRestDefaults} from "../../../dist";
import {PostsRoute} from "./routes/posts.route";
import {AlbumsRoute} from "./routes/albums.route";
import {PhotosRoute} from "./routes/photos.route";
import {CommentsRoute} from "./routes/comments.route";
import {UsersRoute} from "./routes/users.route";
import fetch from "node-fetch";

export interface IApi {
    posts: PostsRoute;
    comments: CommentsRoute;
    albums: AlbumsRoute;
    photos: PhotosRoute;
    users: UsersRoute;
}

TypeRestDefaults.fetchImplementation = fetch;
// Initialize api with IApi, and a couple hooks, and a custom header
export const api = typeRest<IApi>("https://jsonplaceholder.typicode.com", {
    params: {
        headers: {"x-app-name": "TypeRest-Sample-Typed"}
    },
    hooks: [
        {type: HookType.Post, hook: async event => {
            const text = event.rawResponse.bodyUsed ? JSON.stringify(event.response) : await event.rawResponse.text();
            console.debug(`Ran a ${event.method} request on ${event.path}\n` +
                        `Query: ${event.requestQuery ? JSON.stringify(event.requestQuery) : "No Query"}\n` +
                        `Body: ${event.requestBody ? JSON.stringify(event.requestBody) : "No Body"} \n` +
                        `Response Status: ${event.rawResponse.status} ${event.rawResponse.statusText}\n` +
                        `Response Body: ${text.length > 100 ? text.substr(0, 90) + "..." : text}\n`);
        }},
        {type: HookType.Pre, path: ["users", null], method: "GET", hook: event => {
            console.log(`Attempting to retrieve single user ${event.path}\n`);
        }}
    ]
});

// add a hook for retrieving all users
api.users.Get._addHook({
    type: HookType.Pre, hook: event => {
        console.log(`Attempting to retrieve all users with: ${JSON.stringify(event.requestQuery)}\n`);
    }
});

// Change trailing slash configuration for all calls in /users
api.users._options.trailingSlash = false;