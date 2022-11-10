interface UseUpdateCommentPayload {
    id: string;
    comment: string;
    mentionedUserIds: string[];
}
declare const useUpdateComment: () => import("react-query").UseMutationResult<import("../api").Comment, unknown, UseUpdateCommentPayload, unknown>;
export default useUpdateComment;
