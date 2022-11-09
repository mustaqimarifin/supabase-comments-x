import { FC } from 'react';
import { CommentReactionMetadata } from '../api';
export interface CommentReactionProps {
    metadata: CommentReactionMetadata;
    toggleReaction: (reactionType: string) => void;
}
declare const CommentReaction: FC<CommentReactionProps>;
export default CommentReaction;
