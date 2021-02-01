import {DeleteRoute, GetRoute, PatchRoute, PostRoute, PutRoute} from "./types";

export type UntypedTypeRestApi = ITypeRestEndpoints & ITypeRestIntermediary;

export interface ITypeRestIntermediary {
    [part: number]: UntypedTypeRestApi;
    [part: string]: UntypedTypeRestApi;
}

export interface ITypeRestEndpoints {
    Delete: DeleteRoute;
    Get: GetRoute;
    Post: PostRoute;
    Patch: PatchRoute;
    Put: PutRoute;
}
