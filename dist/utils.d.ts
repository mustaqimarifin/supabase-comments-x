import { useLayoutEffect } from 'react';
export declare const getMentionedUserIds: (doc: string) => string[];
export declare const timeout: (ms: number) => Promise<unknown>;
export declare const useIsomorphicEffect: () => typeof useLayoutEffect;
