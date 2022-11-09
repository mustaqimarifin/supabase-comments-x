import { useMutation, useQueryClient } from 'react-query';
import useApi from './useApi';
const useUpdateComment = () => {
    const api = useApi();
    const queryClient = useQueryClient();
    return useMutation(({ id, comment, mentionedUserIds }) => {
        return api.updateComment(id, {
            comment,
            mentioned_user_ids: mentionedUserIds,
        });
    }, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['comments', data.id]);
        },
    });
};
export default useUpdateComment;
