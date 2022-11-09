var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useEffect } from 'react';
import { Modal } from '@supabase/ui';
import Auth from './Auth';
import { useSupabaseClient } from './CommentsProvider';
import { useLatestRef } from '../hooks/useLatestRef';
import clsx from 'clsx';
const AuthModal = (_a) => {
    var _b;
    var { visible, onAuthenticate, onClose, view = 'sign_in', title = 'Sign In', description, className } = _a, otherProps = __rest(_a, ["visible", "onAuthenticate", "onClose", "view", "title", "description", "className"]);
    const supabase = useSupabaseClient();
    const onAuthenticateRef = useLatestRef(onAuthenticate);
    useEffect(() => {
        const subscription = supabase.auth.onAuthStateChange((ev, session) => {
            var _a;
            if (ev === 'SIGNED_IN' && session) {
                (_a = onAuthenticateRef.current) === null || _a === void 0 ? void 0 : _a.call(onAuthenticateRef, session);
            }
        });
        return () => {
            var _a;
            (_a = subscription.data) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        };
    }, [supabase]);
    return (<Modal title={title} description={description} visible={visible} onCancel={onClose} hideFooter size="medium" className={clsx(' min-w-[300px]', className)}>
      <div className={clsx('w-full', otherProps.providers && ((_b = otherProps.providers) === null || _b === void 0 ? void 0 : _b.length) > 0
            ? null
            : '!-mt-4')}>
        <Auth {...otherProps} view={view} supabaseClient={supabase}/>
      </div>
    </Modal>);
};
export default AuthModal;
