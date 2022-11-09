import { Loading, Dropdown, Typography, IconMoreVertical, Button, } from '@supabase/ui';
import React, { useEffect, useRef, useState } from 'react';
import { useComment, useDeleteComment, useUpdateComment, useAddReaction, useRemoveReaction, useUncontrolledState, } from '../hooks';
import Editor from './Editor';
//import TimeAgo from './TimeAgo';
import Comments from './Comments';
import ReplyManagerProvider, { useReplyManager } from './ReplyManagerProvider';
import { useCommentsContext } from './CommentsProvider';
import { getMentionedUserIds } from '../utils';
import useAuthUtils from '../hooks/useAuthUtils';
import User from './User';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime, {
    rounding: Math.floor,
});
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(dayjs.tz.guess());
const CommentMenu = ({ onEdit, onDelete }) => {
    return (<Dropdown overlay={[
            <Dropdown.Item key="edit" onClick={() => onEdit()}>
          <Typography.Text className="text-sm">Edit</Typography.Text>
        </Dropdown.Item>,
            <Dropdown.Item key="delete" onClick={() => onDelete()}>
          <Typography.Text className="text-sm">Delete</Typography.Text>
        </Dropdown.Item>,
        ]}>
      <IconMoreVertical className="h-7 px-0.5 py-1.5"/>
    </Dropdown>);
};
const Comment = ({ id }) => {
    const query = useComment({ id });
    return (<div className="space-y-1">
      {query.isLoading && (<div className="grid p-4 place-items-center">
          <div className="mr-4">
            <Loading active>{null}</Loading>
          </div>
        </div>)}
      {query.data && !query.data.parent_id && (<ReplyManagerProvider>
          <CommentData comment={query.data}/>
        </ReplyManagerProvider>)}
      {query.data && query.data.parent_id && (<CommentData comment={query.data}/>)}
    </div>);
};
const CommentData = ({ comment }) => {
    var _a, _b, _c, _d;
    const editorRef = useRef(null);
    const context = useCommentsContext();
    const [editing, setEditing] = useState(false);
    const [repliesVisible, setRepliesVisible] = useState(false);
    const commentState = useUncontrolledState({ defaultValue: comment.comment });
    const replyManager = useReplyManager();
    const mutations = {
        addReaction: useAddReaction(),
        removeReaction: useRemoveReaction(),
        updateComment: useUpdateComment(),
        deleteComment: useDeleteComment(),
    };
    const { isAuthenticated, runIfAuthenticated, auth } = useAuthUtils();
    const isReplyingTo = ((_a = replyManager === null || replyManager === void 0 ? void 0 : replyManager.replyingTo) === null || _a === void 0 ? void 0 : _a.id) === comment.id;
    useEffect(() => {
        if (comment.parent_id) {
            return;
        }
        // if we're at the top level use replyingTo
        // to control expansion state
        if (replyManager === null || replyManager === void 0 ? void 0 : replyManager.replyingTo) {
            setRepliesVisible(true);
        }
        else {
            setRepliesVisible(false);
        }
    }, [replyManager === null || replyManager === void 0 ? void 0 : replyManager.replyingTo, comment.parent_id]);
    useEffect(() => {
        if (mutations.updateComment.isSuccess) {
            setEditing(false);
        }
    }, [mutations.updateComment.isSuccess]);
    const isReply = !!comment.parent_id;
    const activeReactions = comment.reactions_metadata.reduce((set, reactionMetadata) => {
        if (reactionMetadata.active_for_user) {
            set.add(reactionMetadata.reaction_type);
        }
        return set;
    }, new Set());
    const toggleReaction = (reactionType) => {
        runIfAuthenticated(() => {
            if (!activeReactions.has(reactionType)) {
                mutations.addReaction.mutate({
                    commentId: comment.id,
                    reactionType,
                });
            }
            else {
                mutations.removeReaction.mutate({
                    commentId: comment.id,
                    reactionType,
                });
            }
        });
    };
    return (<div className="flex space-x-2 sce-comment">
      <div className="min-w-fit sce-comment-avatar">
        <User id={comment.user.id} showAvatar showName={false}/>
      </div>
      <div className="flex-1 space-y-2">
        <div className="relative p-3 py-2 rounded-md sce-comment-body bg-alpha-5 text-alpha-90">
          <div className="absolute top-0 right-0">
            {comment.user_id === ((_b = auth === null || auth === void 0 ? void 0 : auth.user) === null || _b === void 0 ? void 0 : _b.id) && (<CommentMenu onEdit={() => {
                setEditing(true);
            }} onDelete={() => {
                mutations.deleteComment.mutate({ id: comment.id });
            }}/>)}
          </div>
          <p>
            <span className="font-bold cursor-pointer" onClick={() => {
            var _a;
            (_a = context.onUserClick) === null || _a === void 0 ? void 0 : _a.call(context, comment.user);
        }}>
              {comment.user.name}
            </span>
          </p>
          <p>
            {!editing && (<Editor key={comment.comment} defaultValue={comment.comment} readOnly/>)}
            {editing && (<Editor ref={editorRef} key={commentState.key} defaultValue={commentState.defaultValue} onChange={(val) => {
                commentState.setValue(val);
            }} autoFocus={!!(replyManager === null || replyManager === void 0 ? void 0 : replyManager.replyingTo)} actions={<div className="flex mx-[3px] space-x-[3px]">
                    <Button onClick={() => {
                    setEditing(false);
                }} size="tiny" className="!px-[6px] !py-[3px]" type="secondary">
                      Cancel
                    </Button>
                    <Button onClick={() => {
                    mutations.updateComment.mutate({
                        id: comment.id,
                        comment: commentState.value,
                        mentionedUserIds: getMentionedUserIds(commentState.value),
                    });
                }} loading={mutations.updateComment.isLoading} size="tiny" className="!px-[6px] !py-[3px]" disabled={(_d = (_c = editorRef.current) === null || _c === void 0 ? void 0 : _c.editor()) === null || _d === void 0 ? void 0 : _d.isEmpty}>
                      Save
                    </Button>
                  </div>}/>)}
          </p>
          <div className="text-sm text-alpha-40">
            {dayjs().diff(comment.created_at, 'seconds', true) < 30
            ? 'just now'
            : dayjs(comment.created_at).fromNow()}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="relative h-6 sce-comment-reactions">
            <context.components.CommentReactions toggleReaction={toggleReaction} activeReactions={activeReactions} reactionsMetadata={comment.reactions_metadata}/>
          </div>
          <div className="flex space-x-3 text-sm text-alpha-40">
            {!isReply && (<div onClick={() => setRepliesVisible((prev) => !prev)} className="cursor-pointer" tabIndex={0}>
                {!repliesVisible && (<p>view replies ({comment.replies_count})</p>)}
                {repliesVisible && <p>hide replies</p>}
              </div>)}
            {!isReplyingTo && (<p tabIndex={0} className="cursor-pointer" onClick={() => {
                replyManager === null || replyManager === void 0 ? void 0 : replyManager.setReplyingTo(comment);
            }}>
                reply
              </p>)}
            {isReplyingTo && (<p tabIndex={0} className="cursor-pointer" onClick={() => {
                replyManager === null || replyManager === void 0 ? void 0 : replyManager.setReplyingTo(null);
            }}>
                cancel
              </p>)}
          </div>
        </div>
        <div>
          {repliesVisible && !isReply && (<div className="my-3">
              <Comments topic={comment.topic} parentId={comment.id}/>
            </div>)}
        </div>
      </div>
    </div>);
};
export default Comment;
