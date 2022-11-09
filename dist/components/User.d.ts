import { FC } from 'react';
export interface UserProps {
    id?: string;
    size?: 'sm' | 'lg';
    showName?: boolean;
    showAvatar?: boolean;
    propagateClick?: boolean;
    className?: string;
}
declare const User: FC<UserProps>;
export default User;
