import { useQuery } from 'react-query';
import useApi from './useApi';
const useUser = ({ id }, options = {}) => {
    const api = useApi();
    return useQuery(['users', id], () => {
        return api.getUser(id);
    }, {
        staleTime: Infinity,
        enabled: options.enabled,
    });
};
export default useUser;
