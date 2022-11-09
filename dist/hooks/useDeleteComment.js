import { useMutation, useQueryClient } from 'react-query';
import useApi from './useApi';
const useDeleteComment = () => {
    const queryClient = useQueryClient();
    const api = useApi();
    return useMutation(({ id }) => {
        return api.deleteComment(id);
    }, {
        onSuccess: (data) => {
            queryClient.invalidateQueries([
                'comments',
                { topic: data.topic, parentId: data.parent_id },
            ]);
        },
    });
};
export default useDeleteComment;
