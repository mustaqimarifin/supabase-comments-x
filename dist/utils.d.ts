import React from 'react';
export declare function getMentions(doc: string): string[];
/**
 * less annoying useLayoutEffect
 */
declare const useLayoutEffect: typeof React.useLayoutEffect;
export { useLayoutEffect };
export type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];
export declare const cx: (...classes: ClassValue[]) => string;
export declare function timeAgo(d: string): string;
interface UseUncontrolledStateOptions<T> {
    defaultValue: T;
}
export declare function useUncontrolledState<T>(options: UseUncontrolledStateOptions<T>): {
    setValue: (val: T) => void;
    setDefaultValue: (defaultVal: T) => void;
    resetValue: () => void;
    defaultValue: T;
    value: T;
    key: number;
};
export declare function useCssPalette(baseColor: string, variablePrefix: string): void;
