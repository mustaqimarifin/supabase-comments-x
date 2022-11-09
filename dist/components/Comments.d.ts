import { FC } from 'react';
export interface CommentsProps {
    topic: string;
    parentId?: string | null;
}
declare const Comments: FC<CommentsProps>;
export default Comments;
