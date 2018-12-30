import {WithBody, WithNone} from "type-rest";

export interface IAuthenticationRoute {
    Get: WithNone<{authenticated: boolean}>;
    Post: WithBody<{username: string, password: string}, {result: boolean, token?: string, error?: string}>;
    Delete: WithNone<void>;
}
