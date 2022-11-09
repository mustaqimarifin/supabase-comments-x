interface UseRemoveReactionPayload {
    reactionType: string;
    commentId: string;
}
declare const useRemoveReaction: () => import("react-query").UseMutationResult<import("../api").CommentReaction, unknown, UseRemoveReactionPayload, unknown>;
export default useRemoveReaction;
