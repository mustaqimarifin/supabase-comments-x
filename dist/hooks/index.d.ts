import type { Comment } from '../api.js';
declare function useAddComment(): import("@tanstack/react-query").UseMutationResult<Comment, Error, import("../api.js").AddCommentPayload, unknown>;
declare function useAddReaction(): import("@tanstack/react-query").UseMutationResult<import("../api.js").CommentReaction, Error, import("../api.js").CommentReactionPayload, unknown>;
declare function useRemoveReaction(): import("@tanstack/react-query").UseMutationResult<import("../api.js").CommentReaction, Error, import("../api.js").CommentReactionPayload, unknown>;
interface UseDeleteCommentPayload {
    id: number;
}
declare function useDeleteComment({ id }: UseDeleteCommentPayload): import("@tanstack/react-query").UseMutationResult<Comment, Error, void, unknown>;
interface UseUpdateCommentPayload {
    id: number;
    body: string;
    mentions: string[];
}
declare function useUpdateComment({ id, body, mentions }: UseUpdateCommentPayload): import("@tanstack/react-query").UseMutationResult<Comment, Error, void, unknown>;
interface UseCommentQuery {
    id: number;
}
interface UseCommentOptions {
    enabled?: boolean;
}
declare function useComment({ id }: UseCommentQuery, options?: UseCommentOptions): import("@tanstack/react-query").UseQueryResult<Comment, Error>;
interface UseCommentReactionsQuery {
    commentId: number;
    reactionType: string;
    enabled?: string;
}
interface Options {
    enabled?: boolean;
}
declare function useCommentReactions({ commentId, reactionType }: UseCommentReactionsQuery, options?: Options): import("@tanstack/react-query").UseQueryResult<import("../api.js").CommentReaction[], Error>;
interface UseCommentsQuery {
    topic: string;
    parentId?: number;
}
declare function useComments({ topic, parentId }: UseCommentsQuery, options?: Options): import("@tanstack/react-query").UseQueryResult<Comment[], Error>;
interface UseReactionQuery {
    type: string;
}
declare function useReaction({ type }: UseReactionQuery, options?: Options): import("@tanstack/react-query").UseQueryResult<import("../api.js").Reaction, Error>;
declare function useReactions(options?: Options): import("@tanstack/react-query").UseQueryResult<import("../api.js").Reaction[], Error>;
interface UseUserQuery {
    id: string;
    enabled?: boolean;
}
declare function useUser({ id }: UseUserQuery, options?: Options): import("@tanstack/react-query").UseQueryResult<import("../api.js").DisplayUser, Error>;
interface UseSearchUsersQuery {
    search: string;
}
declare function useSearchUsers({ search }: UseSearchUsersQuery, options?: Options): import("@tanstack/react-query").UseQueryResult<import("../api.js").DisplayUser[], Error>;
export { useComment, useComments, useSearchUsers, useUser, useReaction, useReactions, useCommentReactions, useAddComment, useAddReaction, useDeleteComment, useRemoveReaction, useUpdateComment, };
