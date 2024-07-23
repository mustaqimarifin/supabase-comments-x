import { type ComponentType } from 'react';
import { QueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Query } from '@tanstack/react-query';
import type { ApiError, DisplayUser } from '../api.js';
import { type CommentReactionsProps } from './CommentSection.js';
export declare function useSupabaseClient(): SupabaseClient<any, any, any>;
export interface ComponentOverrideOptions {
    CommentReactions?: ComponentType<CommentReactionsProps>;
}
export interface CommentsContextApi {
    enableMentions?: boolean;
    onAuthRequested?: () => void;
    onUserClick?: (author: DisplayUser) => void;
    mode: 'light' | 'dark';
    components: Required<ComponentOverrideOptions>;
}
export declare function useCommentsContext(): CommentsContextApi;
export declare function useAuthUtils(): {
    runIfAuthenticated: (callback: () => void) => void;
    isAuthenticated: boolean;
    auth: import("./Auth.js").AuthSession;
};
export interface CommentsProviderProps {
    queryClient?: QueryClient;
    supabaseClient: SupabaseClient<any, any, any>;
    onAuthRequested?: () => void;
    onUserClick?: (author: DisplayUser) => void;
    mode?: 'light' | 'dark';
    accentColor?: string;
    onError?: (error: ApiError, query: Query) => void;
    enableMentions?: boolean;
    components?: ComponentOverrideOptions;
    children: React.ReactNode;
}
declare function CommentsProvider({ queryClient, supabaseClient, children, onAuthRequested, onUserClick, mode, accentColor, onError, components, enableMentions, }: CommentsProviderProps): import("react/jsx-runtime").JSX.Element;
export default CommentsProvider;
//# sourceMappingURL=CommentsProvider.d.ts.map