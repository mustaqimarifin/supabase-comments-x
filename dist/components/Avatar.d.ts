import React, { FC } from 'react';
export interface AvatarProps extends Omit<React.HTMLProps<HTMLDivElement>, 'size'> {
    src?: string;
    size?: 'sm' | 'lg';
}
declare const Avatar: FC<AvatarProps>;
export default Avatar;
