import { useMutation, useQueryClient } from 'react-query';
import useApi from './useApi';
// Do a little surgery on the comment and manually increment the reaction count
// or add a new item to the array if the reaction was not previously in the
// reactions array.
const addOrIncrement = (reactionType, comment) => {
    const isInArray = !!comment.reactions_metadata.find((val) => val.reaction_type === reactionType);
    let newArray = [...comment.reactions_metadata];
    if (!isInArray) {
        newArray.push({
            comment_id: comment.id,
            reaction_type: reactionType,
            reaction_count: 1,
            active_for_user: true,
        });
    }
    else {
        newArray = newArray.map((item) => {
            if (item.reaction_type === reactionType) {
                return Object.assign(Object.assign({}, item), { reaction_count: item.reaction_count + 1, active_for_user: true });
            }
            else {
                return item;
            }
        });
    }
    newArray.sort((a, b) => a.reaction_type.localeCompare(b.reaction_type));
    return Object.assign(Object.assign({}, comment), { reactions_metadata: newArray });
};
const useAddReaction = () => {
    const api = useApi();
    const queryClient = useQueryClient();
    return useMutation((payload) => {
        return api.addCommentReaction({
            reaction_type: payload.reactionType,
            comment_id: payload.commentId,
        });
    }, {
        onSuccess: (data, params) => {
            // Manually patch the comment while it refetches
            queryClient.setQueryData(['comments', params.commentId], (prev) => addOrIncrement(params.reactionType, prev));
            queryClient.invalidateQueries(['comments', params.commentId]);
            queryClient.invalidateQueries([
                'comment-reactions',
                { commentId: params.commentId, reactionType: params.reactionType },
            ]);
        },
    });
};
export default useAddReaction;
