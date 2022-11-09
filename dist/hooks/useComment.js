import { useQuery } from 'react-query';
import useApi from './useApi';
const useComment = ({ id }, options = {}) => {
    const api = useApi();
    return useQuery(['comments', id], () => {
        return api.getComment(id);
    }, {
        staleTime: Infinity,
        enabled: options.enabled,
    });
};
export default useComment;
