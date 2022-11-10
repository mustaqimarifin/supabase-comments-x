import { ComponentProps, FC } from 'react';
import Auth from './Auth';
import { Session } from '@supabase/gotrue-js';
export interface AuthModalProps extends Omit<ComponentProps<typeof Auth>, 'supabaseClient'> {
    visible: boolean;
    onClose?: () => void;
    onAuthenticate?: (session: Session) => void;
    title?: string;
    description?: string;
}
declare const AuthModal: FC<AuthModalProps>;
export default AuthModal;
