import React from 'react';
import { SupabaseClient, Provider } from '@supabase/supabase-js';
declare type ViewType = 'sign_in' | 'sign_up' | 'forgotten_password' | 'magic_link' | 'update_password';
declare type RedirectTo = undefined | string;
export interface AuthProps {
    supabaseClient: SupabaseClient;
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    socialLayout?: 'horizontal' | 'vertical';
    socialColors?: boolean;
    socialButtonSize?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
    providers?: Provider[];
    verticalSocialLayout?: any;
    view?: ViewType;
    redirectTo?: RedirectTo;
    onlyThirdPartyProviders?: boolean;
    magicLink?: boolean;
}
declare function Auth({ supabaseClient, className, style, socialLayout, socialColors, socialButtonSize, providers, view, redirectTo, onlyThirdPartyProviders, magicLink, }: AuthProps): JSX.Element | null;
declare namespace Auth {
    var ForgottenPassword: ({ setAuthView, supabaseClient, redirectTo, }: {
        setAuthView: any;
        supabaseClient: SupabaseClient;
        redirectTo?: string | undefined;
    }) => JSX.Element;
    var UpdatePassword: ({ supabaseClient, }: {
        supabaseClient: SupabaseClient;
    }) => JSX.Element;
    var MagicLink: ({ setAuthView, supabaseClient, redirectTo, }: {
        setAuthView: any;
        supabaseClient: SupabaseClient;
        redirectTo?: string | undefined;
    }) => JSX.Element;
    var UserContextProvider: (props: import("@supabase/ui/dist/cjs/components/Auth/UserContext").Props) => JSX.Element;
    var useUser: () => import("@supabase/ui/dist/cjs/components/Auth/UserContext").AuthSession;
}
export default Auth;
