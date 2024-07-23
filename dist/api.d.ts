import type { SupabaseClient } from '@supabase/supabase-js';
export type CommentReactionMetadata = {
    comment_id: number;
    type: string;
    reaction_count: number;
    active_for_user: boolean;
};
export type DisplayUser = {
    id: string;
    name: string;
    avatar: string;
};
export type Comment = {
    id: number;
    user_id: string;
    parent_id?: number;
    topic: string;
    body: string;
    created_at: string;
    replies_count: number;
    reactions_metadata: CommentReactionMetadata[];
    author: DisplayUser;
    mentions?: string[];
};
export type Reaction = {
    type: string;
    created_at: string;
    label: string;
    url: string;
    metadata: any;
};
export declare function assertResponseOk(response: {
    error: any;
}): void;
export declare class ApiError extends Error {
    type: string;
    message: string;
    details?: string;
    hint?: string;
    code?: string;
    constructor(error: any);
}
export type GetCommentsOptions = {
    topic: string;
    parent_id?: number;
};
export type AddCommentPayload = {
    body: string;
    topic: string;
    parent_id?: number;
    mentions?: string[];
};
export type UpdateCommentPayload = {
    body: string;
    mentions?: string[];
};
export type CommentReaction = {
    id: number;
    user_id: string;
    comment_id: number;
    type: string;
    created_at: string;
    author: DisplayUser;
};
export type CommentReactionPayload = {
    type: string;
    comment_id: number;
};
export declare function createApiClient(supabase: SupabaseClient): {
    getComments: ({ topic, parent_id }: GetCommentsOptions) => Promise<Comment[]>;
    getComment: (id: number) => Promise<Comment>;
    addComment: (payload: AddCommentPayload) => Promise<Comment>;
    updateComment: (id: number, payload: UpdateCommentPayload) => Promise<Comment>;
    deleteComment: (id: number) => Promise<Comment>;
    getReactions: () => Promise<Reaction[]>;
    getReaction: (type: string) => Promise<Reaction>;
    getCommentReactions: ({ type, comment_id }: CommentReactionPayload) => Promise<CommentReaction[]>;
    addCommentReaction: (payload: CommentReactionPayload) => Promise<CommentReaction>;
    removeCommentReaction: ({ type, comment_id }: CommentReactionPayload) => Promise<CommentReaction>;
    searchUsers: (search: string) => Promise<DisplayUser[]>;
    getUser: (id: string) => Promise<DisplayUser>;
};
