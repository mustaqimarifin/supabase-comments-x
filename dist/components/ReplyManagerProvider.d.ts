import { FC } from 'react';
import type * as api from '../api';
interface ReplyManagerContextApi {
    replyingTo: api.Comment | null;
    setReplyingTo: (comment: api.Comment | null) => void;
}
export declare const useReplyManager: () => ReplyManagerContextApi | null;
declare const ReplyManagerProvider: FC;
export default ReplyManagerProvider;
