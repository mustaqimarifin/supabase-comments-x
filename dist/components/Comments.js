import React, { useEffect, useRef, useState } from 'react';
import { Loading, Button, Typography, IconAlertCircle } from '@supabase/ui';
import clsx from 'clsx';
import { useComments, useReactions, useAddComment, useUncontrolledState, } from '../hooks';
import Editor from './Editor';
import Comment from './Comment';
import { useReplyManager } from './ReplyManagerProvider';
import { getMentionedUserIds, useIsomorphicEffect } from '../utils';
import useAuthUtils from '../hooks/useAuthUtils';
import { useCommentsContext } from './CommentsProvider';
import useUser from '../hooks/useUser';
import User from './User';
const Comments = ({ topic, parentId = null }) => {
    var _a, _b, _c, _d;
    const editorRef = useRef(null);
    const context = useCommentsContext();
    const [layoutReady, setLayoutReady] = useState(false);
    const replyManager = useReplyManager();
    const commentState = useUncontrolledState({ defaultValue: '' });
    const { auth, isAuthenticated, runIfAuthenticated } = useAuthUtils();
    const isomorphicEffect = useIsomorphicEffect();
    const queries = {
        comments: useComments({ topic, parentId }),
        user: useUser({ id: (_a = auth.user) === null || _a === void 0 ? void 0 : _a.id }, { enabled: !!((_b = auth.user) === null || _b === void 0 ? void 0 : _b.id) }),
    };
    const mutations = {
        addComment: useAddComment(),
    };
    // preload reactions
    useReactions();
    useEffect(() => {
        if (replyManager === null || replyManager === void 0 ? void 0 : replyManager.replyingTo) {
            commentState.setDefaultValue(`<span data-type="mention" data-id="${replyManager === null || replyManager === void 0 ? void 0 : replyManager.replyingTo.user.id}" data-label="${replyManager === null || replyManager === void 0 ? void 0 : replyManager.replyingTo.user.name}" contenteditable="false"></span><span>&nbsp</span>`);
        }
        else {
            commentState.setDefaultValue('');
        }
    }, [replyManager === null || replyManager === void 0 ? void 0 : replyManager.replyingTo]);
    isomorphicEffect(() => {
        if (mutations.addComment.isSuccess) {
            replyManager === null || replyManager === void 0 ? void 0 : replyManager.setReplyingTo(null);
            commentState.setDefaultValue('');
        }
    }, [mutations.addComment.isSuccess]);
    useEffect(() => {
        if (queries.comments.isSuccess) {
            // this is neccessary because tiptap on first render has different height than on second render
            // which causes layout shift. this just hides content on the first render to avoid ugly layout
            // shift that happens when comment height changes.
            setLayoutReady(true);
        }
    }, [queries.comments.isSuccess]);
    const user = queries.user.data;
    return (<div className={clsx(context.mode, 'sce-comments relative')}>
      {queries.comments.isLoading && (<div className="grid p-4 place-items-center">
          <div className="mr-4">
            <Loading active>{null}</Loading>
          </div>
        </div>)}
      {queries.comments.isError && (<div className="grid p-4 place-items-center">
          <div className="flex flex-col items-center space-y-0.5 text-center">
            <Typography.Text>
              <IconAlertCircle />
            </Typography.Text>
            <Typography.Text>Unable to load comments.</Typography.Text>
          </div>
        </div>)}
      {queries.comments.data && (<div className={clsx('relative space-y-1 rounded-md', !layoutReady ? 'invisible' : 'visible')}>
          <div className="space-y-1">
            {queries.comments.data.map((comment) => (<Comment key={comment.id} id={comment.id}/>))}
          </div>
          <div className="flex space-x-2">
            <div className="min-w-fit">
              <User id={user === null || user === void 0 ? void 0 : user.id} showAvatar showName={false}/>
            </div>
            <div className="flex-1">
              <Editor ref={editorRef} key={commentState.key} defaultValue={commentState.defaultValue} onChange={(val) => {
                commentState.setValue(val);
            }} autoFocus={!!(replyManager === null || replyManager === void 0 ? void 0 : replyManager.replyingTo)} actions={<Button onClick={() => {
                    runIfAuthenticated(() => {
                        mutations.addComment.mutate({
                            topic,
                            parentId,
                            comment: commentState.value,
                            mentionedUserIds: getMentionedUserIds(commentState.value),
                        });
                    });
                }} loading={mutations.addComment.isLoading} size="tiny" className="!px-[6px] !py-[3px] m-[3px]" disabled={isAuthenticated && ((_d = (_c = editorRef.current) === null || _c === void 0 ? void 0 : _c.editor()) === null || _d === void 0 ? void 0 : _d.isEmpty)}>
                    {!isAuthenticated ? 'Sign In' : 'Submit'}
                  </Button>}/>
            </div>
          </div>
        </div>)}
    </div>);
};
export default Comments;