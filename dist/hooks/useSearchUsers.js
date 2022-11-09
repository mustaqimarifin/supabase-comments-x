import { useQuery, useQueryClient } from 'react-query';
import useApi from './useApi';
const useSearchUsers = ({ search }, options = {}) => {
    const api = useApi();
    const queryClient = useQueryClient();
    return useQuery(['users', { search }], () => {
        return api.searchUsers(search);
    }, {
        enabled: options.enabled,
        staleTime: Infinity,
        onSuccess: (data) => {
            data === null || data === void 0 ? void 0 : data.forEach((user) => {
                queryClient.setQueryData(['users', user.id], user);
            });
        },
    });
};
export default useSearchUsers;
