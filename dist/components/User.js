import React from 'react';
import { Typography } from '@supabase/ui';
import useUser from '../hooks/useUser';
import Avatar from './Avatar';
import { useCommentsContext } from './CommentsProvider';
import clsx from 'clsx';
const User = ({ id, size = 'lg', showName = true, showAvatar = true, propagateClick = true, className, }) => {
    const context = useCommentsContext();
    const query = useUser({ id: id }, { enabled: !!id });
    const user = query.data;
    return (<div className={clsx('flex items-center space-x-2', className)}>
      {showAvatar && (<Avatar key={user === null || user === void 0 ? void 0 : user.avatar} className={clsx(user && 'cursor-pointer')} onClick={() => {
                var _a;
                if (user && propagateClick) {
                    (_a = context.onUserClick) === null || _a === void 0 ? void 0 : _a.call(context, user);
                }
            }} src={user === null || user === void 0 ? void 0 : user.avatar} size={size}/>)}
      {user && showName && (<Typography.Text>
          <span className="cursor-pointer" tabIndex={0} onClick={() => {
                var _a;
                if (propagateClick) {
                    (_a = context.onUserClick) === null || _a === void 0 ? void 0 : _a.call(context, user);
                }
            }}>
            {user.name}
          </span>
        </Typography.Text>)}
    </div>);
};
export default User;
