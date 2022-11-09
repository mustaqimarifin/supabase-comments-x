interface UseCommentsQuery {
    topic: string;
    parentId: string | null;
}
interface UseCommentsOptions {
    enabled?: boolean;
}
declare const useComments: ({ topic, parentId }: UseCommentsQuery, options?: UseCommentsOptions) => import("react-query").UseQueryResult<import("../api").Comment[], unknown>;
export default useComments;
