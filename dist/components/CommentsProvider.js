import { QueryClient, QueryClientProvider } from 'react-query';
import React, { createContext, useContext, useEffect, useMemo, } from 'react';
import Auth from './Auth';
import { useCssPalette } from '..';
import { CommentReactions as DefaultCommentReactions, } from './CommentReactions';
const defaultQueryClient = new QueryClient();
const SupabaseClientContext = createContext(null);
export const useSupabaseClient = () => {
    const supabaseClient = useContext(SupabaseClientContext);
    if (!supabaseClient) {
        throw new Error('No supabase client found. Make sure this code is contained in a CommentsProvider.');
    }
    return supabaseClient;
};
const CommentsContext = createContext(null);
export const useCommentsContext = () => {
    const context = useContext(CommentsContext);
    if (!context) {
        throw new Error('CommentsProvider not found. Make sure this code is contained in a CommentsProvider.');
    }
    return context;
};
const CommentsProvider = ({ queryClient = defaultQueryClient, supabaseClient, children, onAuthRequested, onUserClick, mode = 'light', accentColor = 'rgb(110, 231,183)', onError, components, enableMentions = true, }) => {
    components;
    const context = useMemo(() => ({
        onAuthRequested,
        onUserClick,
        mode,
        enableMentions,
        components: {
            CommentReactions: (components === null || components === void 0 ? void 0 : components.CommentReactions) || DefaultCommentReactions,
        },
    }), [
        onAuthRequested,
        onUserClick,
        mode,
        enableMentions,
        components === null || components === void 0 ? void 0 : components.CommentReactions,
    ]);
    useEffect(() => {
        const subscription = supabaseClient.auth.onAuthStateChange(() => {
            // refetch all queries when auth changes
            queryClient.invalidateQueries();
        });
        return () => {
            var _a;
            (_a = subscription.data) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        };
    }, [queryClient, supabaseClient]);
    useCssPalette(accentColor, 'sce-accent');
    useEffect(() => {
        document.body.classList.add(mode);
        return () => {
            document.body.classList.remove(mode);
        };
    }, [mode]);
    // Convenience api for handling errors
    useEffect(() => {
        const queryCache = queryClient.getQueryCache();
        const originalErrorHandler = queryCache.config.onError;
        queryCache.config.onError = (error, query) => {
            onError === null || onError === void 0 ? void 0 : onError(error, query);
            originalErrorHandler === null || originalErrorHandler === void 0 ? void 0 : originalErrorHandler(error, query);
        };
    }, [queryClient]);
    return (<QueryClientProvider client={queryClient}>
      <SupabaseClientContext.Provider value={supabaseClient}>
        <Auth.UserContextProvider supabaseClient={supabaseClient}>
          <CommentsContext.Provider value={context}>
            {children}
          </CommentsContext.Provider>
        </Auth.UserContextProvider>
      </SupabaseClientContext.Provider>
    </QueryClientProvider>);
};
export default CommentsProvider;
