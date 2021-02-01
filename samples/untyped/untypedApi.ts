import {typeRest} from "../../src";

async function main() {
    const api = typeRest("https://jsonplaceholder.typicode.com");
    api._addHook({
        type: "pre",
        hook: (ev) => {
            const {method, path, requestBody, requestQuery} = ev;
            console.log({method, path, requestBody, requestQuery});
        },
    });

    try {
        const todo = await api.todos[1].Get();
        console.log(todo);
    } catch (e) {
        console.error("Failed to get todo 1");
    }

    try {
        const comments = await api.posts[1].comments.Get();
        console.log(comments);
    } catch (e) {
        console.error("Failed to get comments");
    }

    try {
        const insertResult = await api.posts.Post({title: "foo", body: "bar", userId: 1});
        console.log(insertResult);
    } catch (e) {
        console.error("Failed to make post");
    }

    try {
        const updateResult = await api.users[1].Patch({title: "new"});
        console.log(updateResult);
    } catch (e) {
        console.error("Failed to update post");
    }
}

main().catch(e => console.error(e));
