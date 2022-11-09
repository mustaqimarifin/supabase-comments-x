interface UseUncontrolledStateOptions<T> {
    defaultValue: T;
}
declare const useUncontrolledState: <T>(options: UseUncontrolledStateOptions<T>) => {
    setValue: (val: T) => void;
    setDefaultValue: (defaultVal: T) => void;
    resetValue: () => void;
    defaultValue: T;
    value: T;
    key: number;
};
export default useUncontrolledState;
