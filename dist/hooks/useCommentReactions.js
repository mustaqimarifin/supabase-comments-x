import { useQuery, useQueryClient } from 'react-query';
import useApi from './useApi';
const useCommentReactions = ({ commentId, reactionType }, options = {}) => {
    const api = useApi();
    const queryClient = useQueryClient();
    return useQuery(['comment-reactions', { commentId, reactionType }], () => {
        return api.getCommentReactions({
            comment_id: commentId,
            reaction_type: reactionType,
        });
    }, {
        staleTime: Infinity,
        enabled: options.enabled,
        onSuccess: (data) => {
            data === null || data === void 0 ? void 0 : data.forEach((commentReaction) => {
                queryClient.setQueryData(['users', commentReaction.user_id], commentReaction.user);
            });
        },
    });
};
export default useCommentReactions;
