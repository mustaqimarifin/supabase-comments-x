interface UseAddReactionPayload {
    reactionType: string;
    commentId: string;
}
declare const useAddReaction: () => import("react-query").UseMutationResult<import("../api").CommentReaction, unknown, UseAddReactionPayload, unknown>;
export default useAddReaction;
