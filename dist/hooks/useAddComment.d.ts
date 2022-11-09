interface UseAddCommentPayload {
    comment: string;
    topic: string;
    parentId: string | null;
    mentionedUserIds: string[];
}
declare const useAddComment: () => import("react-query").UseMutationResult<import("../api").Comment, unknown, UseAddCommentPayload, unknown>;
export default useAddComment;
