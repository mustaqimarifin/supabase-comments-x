import { type ComponentProps } from 'react';
import type { Session } from '@supabase/supabase-js';
import Auth from './Auth.js';
export interface AuthModalProps extends Omit<ComponentProps<typeof Auth>, 'supabaseClient'> {
    visible: boolean;
    onClose: () => void;
    onAuthenticate?: (session: Session) => void;
    title?: string;
    description?: string;
    className?: string;
}
declare function AuthModal({ visible, onAuthenticate, onClose, title, description, className, ...otherProps }: AuthModalProps): import("react/jsx-runtime").JSX.Element;
export default AuthModal;
