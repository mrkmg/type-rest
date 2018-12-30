import {WithBody, WithQuery} from "type-rest";
import {ITodo} from "./todo";
import {ITodoRoute} from "./todo-route";

export interface ITodosRoute {
    Get: WithQuery<{page: number, limit?: number}, ITodo[]>;
    Post: WithBody<Pick<ITodo, Exclude<keyof ITodo, "id" | "completed">>, ITodo>;
    [todoId: number]: ITodoRoute;
}
