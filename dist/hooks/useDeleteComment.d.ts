interface UseDeleteCommentPayload {
    id: string;
}
declare const useDeleteComment: () => import("react-query").UseMutationResult<import("../api").Comment, unknown, UseDeleteCommentPayload, unknown>;
export default useDeleteComment;
