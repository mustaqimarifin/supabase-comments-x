interface UseReactionsOptions {
    enabled?: boolean;
}
declare const useReactions: (options?: UseReactionsOptions) => import("react-query").UseQueryResult<import("../api").Reaction[], unknown>;
export default useReactions;
