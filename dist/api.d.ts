import { SupabaseClient } from '@supabase/supabase-js';
export interface CommentReactionMetadata {
    comment_id: string;
    reaction_type: string;
    reaction_count: number;
    active_for_user: boolean;
}
export interface DisplayUser {
    id: string;
    name: string;
    avatar: string;
}
export interface Comment {
    id: string;
    user_id: string;
    parent_id: string | null;
    topic: string;
    comment: string;
    created_at: string;
    replies_count: number;
    reactions_metadata: CommentReactionMetadata[];
    user: DisplayUser;
    mentioned_user_ids: string[];
}
export interface Reaction {
    type: string;
    created_at: string;
    label: string;
    url: string;
    metadata: any;
}
export interface CommentReaction {
    id: string;
    user_id: string;
    comment_id: string;
    reaction_type: string;
    created_at: string;
    user: DisplayUser;
}
export declare const assertResponseOk: (response: {
    error: any;
}) => void;
export declare class ApiError extends Error {
    type: string;
    message: string;
    details?: string;
    hint?: string;
    code?: string;
    constructor(error: any);
}
export interface GetCommentsOptions {
    topic: string;
    parentId: string | null;
}
export interface AddCommentPayload {
    comment: string;
    topic: string;
    parent_id: string | null;
    mentioned_user_ids: string[];
}
export interface UpdateCommentPayload {
    comment: string;
    mentioned_user_ids: string[];
}
export interface GetCommentReactionsOptions {
    reaction_type: string;
    comment_id: string;
}
export interface AddCommentReactionPayload {
    reaction_type: string;
    comment_id: string;
}
export interface RemoveCommentReactionPayload {
    reaction_type: string;
    comment_id: string;
}
export declare const createApiClient: (supabase: SupabaseClient) => {
    getComments: ({ topic, parentId, }: GetCommentsOptions) => Promise<Comment[]>;
    getComment: (id: string) => Promise<Comment>;
    addComment: (payload: AddCommentPayload) => Promise<Comment>;
    updateComment: (id: string, payload: UpdateCommentPayload) => Promise<Comment>;
    deleteComment: (id: string) => Promise<Comment>;
    getReactions: () => Promise<Reaction[]>;
    getReaction: (type: string) => Promise<Reaction>;
    getCommentReactions: ({ reaction_type, comment_id, }: GetCommentReactionsOptions) => Promise<CommentReaction[]>;
    addCommentReaction: (payload: AddCommentReactionPayload) => Promise<CommentReaction>;
    removeCommentReaction: ({ reaction_type, comment_id, }: RemoveCommentReactionPayload) => Promise<CommentReaction>;
    searchUsers: (search: string) => Promise<DisplayUser[]>;
    getUser: (id: string) => Promise<DisplayUser>;
};
