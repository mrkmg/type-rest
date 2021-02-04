import {Merge, WithBody, WithNone, WithOptionalQuery} from "../../../../dist";
import {Post} from "../../entities/post";
import {CommentsStatic} from "./comments.route";

export type PostsRoute = Merge<PostsStatic, PostsIndexed>;

export interface PostsStatic {
    Get: WithOptionalQuery<PostListQuery, Post[]> & WithNone<Post[]>;
    Post: WithBody<PostCreateRequest, Post>;
}

export interface PostsIndexed {
    [postId: number]: PostStatic;
}

export interface PostStatic {
    Get: WithNone<Post>;
    Patch: WithBody<PostUpdateRequest, Post>;
    Put: WithBody<Post, Post>;
    Delete: WithNone<void>;
    comments: CommentsStatic;
}

export type PostListQuery = Partial<Post>;
export type PostCreateRequest = Pick<Post, "title" | "body">;
export type PostUpdateRequest = Partial<Pick<Post, "title" | "body">>