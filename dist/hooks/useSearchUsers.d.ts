interface UseSearchUsersQuery {
    search: string;
}
interface UseSearchUsersOptions {
    enabled?: boolean;
}
declare const useSearchUsers: ({ search }: UseSearchUsersQuery, options?: UseSearchUsersOptions) => import("react-query").UseQueryResult<import("../api").DisplayUser[], unknown>;
export default useSearchUsers;
