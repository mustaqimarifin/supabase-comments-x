import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
// Enables updates to default value when using uncontrolled inputs
const useUncontrolledState = (options) => {
    const [state, setState] = useState({
        defaultValue: options.defaultValue,
        value: options.defaultValue,
        key: 0,
    });
    const setValue = useCallback((val) => setState((prev) => (Object.assign(Object.assign({}, prev), { value: val }))), []);
    const setDefaultValue = useCallback((defaultVal) => setState((prev) => ({
        key: prev.key + 1,
        value: defaultVal,
        defaultValue: defaultVal,
    })), []);
    const resetValue = useCallback(() => setState((prev) => (Object.assign(Object.assign({}, prev), { value: prev.defaultValue, key: prev.key + 1 }))), []);
    useLayoutEffect(() => {
        setDefaultValue(options.defaultValue);
    }, [options.defaultValue]);
    return useMemo(() => (Object.assign(Object.assign({}, state), { setValue,
        setDefaultValue,
        resetValue })), [state]);
};
export default useUncontrolledState;
