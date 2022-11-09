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
import { Image } from '@supabase/ui';
import clsx from 'clsx';
import React from 'react';
import { useImage } from 'react-image';
const Avatar = (_a) => {
    var { src, className, size = 'lg' } = _a, otherProps = __rest(_a, ["src", "className", "size"]);
    const image = useImage({ srcList: src || [], useSuspense: false });
    return (<div {...otherProps} className={clsx(size === 'sm' ? 'w-6 h-6' : 'w-10 h-10', 'relative inline-block overflow-hidden rounded-full bg-alpha-10', className)}>
      {image.src && (<Image className="object-cover w-full h-full rounded-full" source={image.src}/>)}

      {image.isLoading && <div className="absolute inset-0"></div>}
      {image.error && (<div className="absolute inset-0">
          <svg className="text-alpha-60" viewBox="0 0 128 128" role="img" aria-label="avatar">
            <path fill="currentColor" d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"></path>
            <path fill="currentColor" d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"></path>
          </svg>
        </div>)}
    </div>);
};
export default Avatar;
