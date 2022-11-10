declare const useAuthUtils: () => {
    runIfAuthenticated: (callback: Function) => void;
    isAuthenticated: boolean;
    auth: import("@supabase/ui/dist/cjs/components/Auth/UserContext").AuthSession;
};
export default useAuthUtils;
