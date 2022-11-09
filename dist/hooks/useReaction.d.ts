interface UseReactionQuery {
    type: string;
}
interface UseReactionOptions {
    enabled?: boolean;
}
declare const useReaction: ({ type }: UseReactionQuery, options?: UseReactionOptions) => import("react-query").UseQueryResult<import("../api").Reaction, unknown>;
export default useReaction;
