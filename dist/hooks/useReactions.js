import { useQuery, useQueryClient } from 'react-query';
import useApi from './useApi';
const useReactions = (options = {}) => {
    const api = useApi();
    const queryClient = useQueryClient();
    return useQuery(['reactions'], () => {
        return api.getReactions();
    }, {
        enabled: options.enabled,
        staleTime: Infinity,
        onSuccess: (data) => {
            data === null || data === void 0 ? void 0 : data.forEach((reaction) => {
                queryClient.setQueryData(['reactions', reaction.type], reaction);
            });
        },
    });
};
export default useReactions;
