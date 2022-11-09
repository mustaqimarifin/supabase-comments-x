import { Auth } from '@supabase/ui';
import { useCommentsContext } from '../components/CommentsProvider';
// run callback if authenticated
const useAuthUtils = () => {
    const auth = Auth.useUser();
    const { onAuthRequested } = useCommentsContext();
    const isAuthenticated = !!auth.session;
    const runIfAuthenticated = (callback) => {
        if (!isAuthenticated) {
            onAuthRequested === null || onAuthRequested === void 0 ? void 0 : onAuthRequested();
        }
        else {
            callback();
        }
    };
    return {
        runIfAuthenticated,
        isAuthenticated,
        auth,
    };
};
export default useAuthUtils;
