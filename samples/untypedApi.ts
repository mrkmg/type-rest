import {dynamicRest} from "../src";

async function main() {
    const api = dynamicRest("https://jsonplaceholder.typicode.com");

    try {
        const todo = await api.todos[1].Get();
        console.log(todo);
    } catch (e) {
        console.error("Failed to get todo 1")
    }

    try {
        const comments = await api.posts[1].comments.Get();
        console.log(comments);
    } catch (e) {
        console.error("Failed to get comments");
    }

    try {
        await api.posts.Post({title: "foo", body: "bar", userId: 1});
    } catch (e) {
        console.error("Failed to make post");
    }

    try {
        await api.users[1].Patch({title: "new"});
    } catch (e) {
        console.error("Failed to update post");
    }
}