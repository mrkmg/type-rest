import {Merge, WithBody, WithNone, WithQuery} from "../../../../src";
import {Comment} from "../../entities/comment";

export type CommentsRoute = Merge<CommentsStatic, CommentsIndexed>;

export interface CommentsStatic {
    Get: WithQuery<CommentsListQuery, Comment[]> & WithNone<Comment[]>;
    Post: WithBody<CommentCreateRequest, Comment>;
}

export interface CommentsIndexed {
    [postId: number]: CommentStatic;
}

export interface CommentStatic {
    Get: WithNone<Comment>;
    Patch: WithBody<CommentUpdateRequest, Comment>;
    Put: WithBody<Comment, Comment>;
    Delete: WithNone<void>;
}

export type CommentsListQuery = Partial<Comment>;
export type CommentCreateRequest = Pick<Comment, "name" | "email" | "body">;
export type CommentUpdateRequest = Partial<Pick<Comment, "name" | "email" | "body">>