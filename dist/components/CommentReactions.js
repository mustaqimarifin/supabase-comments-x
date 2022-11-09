import React from 'react';
import CommentReaction from './CommentReaction';
import ReactionSelector from './ReactionSelector';
export const CommentReactions = ({ activeReactions, reactionsMetadata, toggleReaction, }) => {
    return (<div className="flex h-6 space-x-2">
      <ReactionSelector activeReactions={activeReactions} toggleReaction={toggleReaction}/>
      {reactionsMetadata.map((reactionMetadata) => (<CommentReaction key={reactionMetadata.reaction_type} metadata={reactionMetadata} toggleReaction={toggleReaction}/>))}
    </div>);
};
export default CommentReactions;
