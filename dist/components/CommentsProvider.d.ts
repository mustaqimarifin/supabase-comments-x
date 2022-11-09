import { Query, QueryClient } from 'react-query';
import { ComponentType, FC } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { ApiError, DisplayUser } from '../api';
import { CommentReactionsProps } from './CommentReactions';
export declare const useSupabaseClient: () => SupabaseClient;
export interface ComponentOverrideOptions {
    CommentReactions?: ComponentType<CommentReactionsProps>;
}
export interface CommentsContextApi {
    onAuthRequested?: () => void;
    onUserClick?: (user: DisplayUser) => void;
    mode: 'light' | 'dark';
    components: Required<ComponentOverrideOptions>;
    enableMentions: boolean;
}
export declare const useCommentsContext: () => CommentsContextApi;
export interface CommentsProviderProps {
    queryClient?: QueryClient;
    supabaseClient: SupabaseClient;
    onAuthRequested?: () => void;
    onUserClick?: (user: DisplayUser) => void;
    mode?: 'light' | 'dark';
    accentColor?: string;
    onError?: (error: ApiError, query: Query) => void;
    components?: ComponentOverrideOptions;
    enableMentions?: boolean;
}
declare const CommentsProvider: FC<CommentsProviderProps>;
export default CommentsProvider;
