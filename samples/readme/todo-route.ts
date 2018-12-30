import {WithBody, WithNone} from "type-rest";
import {ITodo} from "./todo";

export interface ITodoRoute {
    Get: WithNone<ITodo>;
    Patch: WithBody<Partial<ITodo>, ITodo>;
    Delete: WithNone<void>;
}
