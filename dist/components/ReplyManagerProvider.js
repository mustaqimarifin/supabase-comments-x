import React, { createContext, useContext, useMemo, useState } from 'react';
const ReplyManagerContext = createContext(null);
export const useReplyManager = () => {
    return useContext(ReplyManagerContext);
};
const ReplyManagerProvider = ({ children }) => {
    const [replyingTo, setReplyingTo] = useState(null);
    const api = useMemo(() => ({
        replyingTo,
        setReplyingTo,
    }), [replyingTo, setReplyingTo]);
    return (<ReplyManagerContext.Provider value={api}>
      {children}
    </ReplyManagerContext.Provider>);
};
export default ReplyManagerProvider;
