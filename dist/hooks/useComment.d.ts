interface UseCommentQuery {
    id: string;
}
interface UseCommentOptions {
    enabled?: boolean;
}
declare const useComment: ({ id }: UseCommentQuery, options?: UseCommentOptions) => import("react-query").UseQueryResult<import("../api").Comment, unknown>;
export default useComment;
