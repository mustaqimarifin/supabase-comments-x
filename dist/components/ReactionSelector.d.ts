import { FC } from 'react';
export interface ReactionSelectorProps {
    activeReactions: Set<string>;
    toggleReaction: (reactionType: string) => void;
}
declare const ReactionSelector: FC<ReactionSelectorProps>;
export default ReactionSelector;
