interface UseCommentReactionsQuery {
    commentId: string;
    reactionType: string;
}
interface UseCommentReactionsOptions {
    enabled?: boolean;
}
declare const useCommentReactions: ({ commentId, reactionType }: UseCommentReactionsQuery, options?: UseCommentReactionsOptions) => import("react-query").UseQueryResult<import("../api").CommentReaction[], unknown>;
export default useCommentReactions;
