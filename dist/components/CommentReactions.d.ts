import { FC } from 'react';
import type * as api from '../api';
export interface CommentReactionsProps {
    activeReactions: Set<string>;
    reactionsMetadata: api.CommentReactionMetadata[];
    toggleReaction: (reactionType: string) => void;
}
export declare const CommentReactions: FC<CommentReactionsProps>;
export default CommentReactions;
