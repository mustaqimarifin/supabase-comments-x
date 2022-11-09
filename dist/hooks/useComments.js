import { useQuery, useQueryClient } from 'react-query';
import { timeout } from '../utils';
import useApi from './useApi';
const useComments = ({ topic, parentId = null }, options = {}) => {
    const api = useApi();
    const queryClient = useQueryClient();
    return useQuery(['comments', { topic, parentId }], async () => {
        // This might look crazy, but it ensures the spinner will show for a
        // minimum of 200ms which is a pleasant amount of time for the sake of ux.
        const minTime = timeout(220);
        const comments = await api.getComments({ topic, parentId });
        await minTime;
        return comments;
    }, {
        enabled: options.enabled,
        onSuccess: (data) => {
            data === null || data === void 0 ? void 0 : data.forEach((comment) => {
                queryClient.setQueryData(['comments', comment.id], comment);
                queryClient.setQueryData(['users', comment.user.id], comment.user);
            });
        },
    });
};
export default useComments;
