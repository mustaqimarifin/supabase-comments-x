import { useQuery } from 'react-query';
import useApi from './useApi';
const useReaction = ({ type }, options = {}) => {
    const api = useApi();
    return useQuery(['reactions', type], () => {
        return api.getReaction(type);
    }, {
        enabled: options.enabled,
        staleTime: Infinity,
    });
};
export default useReaction;
