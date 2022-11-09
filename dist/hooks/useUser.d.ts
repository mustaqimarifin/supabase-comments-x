interface UseUserQuery {
    id: string;
}
interface UseUserOptions {
    enabled?: boolean;
}
declare const useUser: ({ id }: UseUserQuery, options?: UseUserOptions) => import("react-query").UseQueryResult<import("../api").DisplayUser, unknown>;
export default useUser;
