import {Merge, WithBody, WithNone, WithQuery} from "../../../../src";
import {Photo} from "../../entities/photo";

export type PhotosRoute = Merge<PhotosStatic, PhotosIndexed>;

export interface PhotosStatic {
    Get: WithQuery<PhotosListQuery, Photo[]> & WithNone<Photo[]>;
    Post: WithBody<PhotoCreateRequest, Photo>;
}

export interface PhotosIndexed {
    [postId: number]: PhotoStatic;
}

export interface PhotoStatic {
    Get: WithNone<Photo>;
    Patch: WithBody<PhotoUpdateRequest, Photo>;
    Put: WithBody<Photo, Photo>;
    Delete: WithNone<void>;
}

export type PhotosListQuery = Partial<Photo>;
export type PhotoCreateRequest = Pick<Photo, "title" | "url" | "thumbnailUrl">;
export type PhotoUpdateRequest = Partial<Pick<Photo, "title" | "url" | "thumbnailUrl">>