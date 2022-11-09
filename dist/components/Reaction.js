import React from 'react';
import { Image } from '@supabase/ui';
import { useReaction } from '../hooks';
import clsx from 'clsx';
const Reaction = ({ type }) => {
    var _a, _b;
    const query = useReaction({ type });
    return (<div className={clsx('h-4 w-4 rounded-full grid place-items-center text-alpha-50')}>
      <Image className={'h-4 w-4'} source={(_a = query.data) === null || _a === void 0 ? void 0 : _a.url} alt={(_b = query.data) === null || _b === void 0 ? void 0 : _b.label}/>
    </div>);
};
export default Reaction;
