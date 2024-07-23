import type { Provider, Session, SupabaseClient, User } from '@supabase/supabase-js';
import React from 'react';
export interface AuthSession {
    user: User | null;
    session: Session | null;
}
interface Props {
    supabaseClient: SupabaseClient;
    [propName: string]: any;
}
export declare function UserContextProvider(props: Props): import("react/jsx-runtime").JSX.Element;
export declare function useUserCTX(): AuthSession;
export interface IconsProps {
    provider: string;
}
type RedirectTo = undefined | string;
declare type ProviderScopes = {
    [key in Partial<Provider>]: string;
};
export interface AuthProps {
    supabaseClient: SupabaseClient<any, any, any>;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    socialLayout?: 'horizontal' | 'vertical';
    socialColors?: boolean;
    socialButtonSize?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
    providers?: Provider[];
    view?: 'sign_in' | 'sign_up' | 'magic_link';
    providerScopes?: Partial<ProviderScopes>;
    queryParams?: {
        [key: string]: string;
    };
    verticalSocialLayout?: any;
    redirectTo?: RedirectTo;
    onlyThirdPartyProviders?: boolean;
    magicLink?: boolean;
}
declare function Auth({ supabaseClient, className, style, socialLayout, socialColors, socialButtonSize, providers, redirectTo, onlyThirdPartyProviders, magicLink, ...props }: AuthProps): import("react/jsx-runtime").JSX.Element;
declare namespace Auth {
    var UserContextProvider: typeof import("./Auth.js").UserContextProvider;
    var useUser: typeof useUserCTX;
}
export default Auth;
