declare const useApi: () => {
    getComments: ({ topic, parentId, }: import("../api").GetCommentsOptions) => Promise<import("../api").Comment[]>;
    getComment: (id: string) => Promise<import("../api").Comment>;
    addComment: (payload: import("../api").AddCommentPayload) => Promise<import("../api").Comment>;
    updateComment: (id: string, payload: import("../api").UpdateCommentPayload) => Promise<import("../api").Comment>;
    deleteComment: (id: string) => Promise<import("../api").Comment>;
    getReactions: () => Promise<import("../api").Reaction[]>;
    getReaction: (type: string) => Promise<import("../api").Reaction>;
    getCommentReactions: ({ reaction_type, comment_id, }: import("../api").GetCommentReactionsOptions) => Promise<import("../api").CommentReaction[]>;
    addCommentReaction: (payload: import("../api").AddCommentReactionPayload) => Promise<import("../api").CommentReaction>;
    removeCommentReaction: ({ reaction_type, comment_id, }: import("../api").RemoveCommentReactionPayload) => Promise<import("../api").CommentReaction>;
    searchUsers: (search: string) => Promise<import("../api").DisplayUser[]>;
    getUser: (id: string) => Promise<import("../api").DisplayUser>;
};
export default useApi;
