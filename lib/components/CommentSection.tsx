import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, Cat, EllipsisVertical as Dots, Plus } from 'lucide-react'

// import crm from './CommentReactions.module.css'
// import rt from './Reaction.module.css'
// import sty from './Comment.module.css'
// import av from './Avatar.module.css'

import { Button, Dropdown, Loading, Typography, Modal } from 'supalazy'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  useAddComment,
  useAddReaction,
  useComment,
  useCommentReactions,
  useComments,
  useDeleteComment,
  useReaction,
  useReactions,
  useRemoveReaction,
  useUpdateComment,
  useUser,
} from '../hooks/index.js'
import { cx, getMentions, timeAgo, useLayoutEffect, useUncontrolledState } from '../utils.js'
import type * as api from '../api.js'
import { useAuthUtils, useCommentsContext } from './CommentsProvider.js'
import type { EditorRefHandle } from './Editor.js'
import Editor from './Editor.js'

export interface AvatarProps extends Omit<React.HTMLProps<HTMLDivElement>, 'size'> {
  src: string
  size?: 'sm' | 'lg'
}

function Avatar({ src, className, size = 'lg', ...otherProps }: AvatarProps) {
  return (
    <div
      {...otherProps}
      className={cx(
        size === 'sm' ? 'w-6 h-6' : 'w-10 h-10',
        'relative inline-block overflow-hidden rounded-full bg-alpha-10',
        className
      )}>
      {src && <img className="object-cover w-full h-full rounded-full" src={src} />}
      <div className="absolute inset-0"></div>
      {!src && (
        <div className="absolute inset-0">
          <Cat className="text-alpha-60" />
        </div>
      )}
    </div>
  )
}

export interface UserProps {
  id: string
  size?: 'sm' | 'lg'
  showName?: boolean
  showAvatar?: boolean
  propagateClick?: boolean
  className?: string
  enabled?: boolean
}

function User({ id, size = 'sm', showName = true, showAvatar = true, propagateClick = true, className }: UserProps) {
  const context = useCommentsContext()
  const query = useUser({ id: id!, enabled: !!id })

  const author = query.data

  return (
    <div className={cx('flex items-center space-x-2', className)}>
      {showAvatar && (
        <Avatar
          key={author?.avatar}
          className={cx(author && 'cursor-pointer')}
          onClick={() => {
            if (author && propagateClick) {
              context.onUserClick?.(author)
            }
          }}
          src={author?.avatar}
          size={size}
        />
      )}
      {author && showName && (
        <Typography.Text>
          <span
            className="cursor-pointer"
            tabIndex={0}
            onClick={() => {
              if (propagateClick) {
                context.onUserClick?.(author)
              }
            }}>
            {author.name}
          </span>
        </Typography.Text>
      )}
    </div>
  )
}

interface ReplyManagerContextApi {
  replyingTo: api.Comment | null
  setReplyingTo: (comment: api.Comment | null) => void
}

const ReplyManagerContext = createContext<ReplyManagerContextApi | null>(null)

function useReplyManager() {
  return useContext(ReplyManagerContext)
}

interface ProviderAPI {
  children: React.ReactNode
}
function ReplyManagerProvider({ children }: ProviderAPI) {
  const [replyingTo, setReplyingTo] = useState<api.Comment | null>(null)

  const api = useMemo(
    () => ({
      replyingTo,
      setReplyingTo,
    }),
    [replyingTo, setReplyingTo]
  )
  return <ReplyManagerContext.Provider value={api}>{children}</ReplyManagerContext.Provider>
}

interface CommentMenuProps {
  onEdit: () => void
  onDelete: () => void
}

function CommentMenu({ onEdit, onDelete }: CommentMenuProps) {
  return (
    <Dropdown
      overlay={[
        <Dropdown.Item key="edit" onClick={() => onEdit()}>
          <Typography.Text className="text-sm">Edit</Typography.Text>
        </Dropdown.Item>,
        <Dropdown.Item key="delete" onClick={() => onDelete()}>
          <Typography.Text className="text-sm">Delete</Typography.Text>
        </Dropdown.Item>,
      ]}>
      <Dots className="h-7 px-0.5 py-1.5" name="ellipsis-vertical" />
    </Dropdown>
  )
}

export interface CommentProps {
  id: number
}

function Comment({ id }: CommentProps) {
  const query = useComment({ id })

  return (
    <div className="space-y-1">
      {query.isLoading && (
        <div className="grid p-4 place-items-center">
          <div className="mr-4">
            <Loading active>{null}</Loading>
          </div>
        </div>
      )}
      {query.data && !query.data.parent_id && (
        <ReplyManagerProvider>
          <CommentData comment={query.data} />
        </ReplyManagerProvider>
      )}
      {query.data && query.data.parent_id && <CommentData comment={query.data} />}
    </div>
  )
}

interface CommentDataProps {
  comment: api.Comment
}

function CommentData({ comment }: CommentDataProps) {
  const editorRef = useRef<EditorRefHandle | null>(null)
  const context = useCommentsContext()
  const [editing, setEditing] = useState(false)
  const [repliesVisible, setRepliesVisible] = useState(false)
  const commentState = useUncontrolledState({ defaultValue: comment.body })

  const replyManager = useReplyManager()
  const mutations = {
    addReaction: useAddReaction(),
    removeReaction: useRemoveReaction(),
    updateComment: useUpdateComment({
      id: comment.id,
      body: commentState.value,
      mentions: getMentions(commentState.value),
    }),
    deleteComment: useDeleteComment({ id: comment.id }),
  }
  const { runIfAuthenticated, auth } = useAuthUtils()

  const isReplyingTo = replyManager?.replyingTo?.id === comment.id

  useEffect(() => {
    if (comment.parent_id) {
      return
    }
    if (replyManager?.replyingTo) {
      setRepliesVisible(true)
    } else {
      setRepliesVisible(false)
    }
  }, [replyManager?.replyingTo, comment.parent_id])

  useEffect(() => {
    if (mutations.updateComment.isSuccess) {
      setEditing(false)
    }
  }, [mutations.updateComment.isSuccess])

  const isReply = !!comment.parent_id

  const activeReactions = comment.reactions_metadata.reduce((set, reactionMetadata) => {
    if (reactionMetadata.active_for_user) {
      set.add(reactionMetadata.type)
    }
    return set
  }, new Set<string>())

  const toggleReaction = (reactionType: string) => {
    runIfAuthenticated(() => {
      if (!activeReactions.has(reactionType)) {
        mutations.addReaction.mutate({
          comment_id: comment.id,
          type: reactionType,
        })
      } else {
        mutations.removeReaction.mutate({
          comment_id: comment.id,
          type: reactionType,
        })
      }
    })
  }

  return (
    <div className="flex space-x-2 scx-comment">
      <div className="min-w-fit scx-comment-avatar">
        <User id={comment.author.id!} showAvatar showName={false} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="relative p-3 py-2 rounded-md scx-comment-body bg-alpha-5 text-alpha-90">
          <div className="absolute top-0 right-0">
            {comment.user_id === auth?.user?.id && (
              <CommentMenu
                onEdit={() => {
                  setEditing(true)
                }}
                onDelete={() => {
                  mutations.deleteComment.mutate()
                }}
              />
            )}
          </div>
          <div>
            <span
              className="font-bold cursor-pointer"
              onClick={() => {
                context.onUserClick?.(comment.author)
              }}>
              {comment.author.name}
            </span>
          </div>
          <div>
            {!editing && <Editor key={comment.id} defaultValue={comment.body} readOnly />}
            {editing && (
              <Editor
                ref={editorRef}
                key={commentState.key}
                defaultValue={commentState.defaultValue}
                onChange={(val: any) => {
                  commentState.setValue(val)
                }}
                autoFocus={!!replyManager?.replyingTo}
                actions={
                  <div className="flex mx-[3px] space-x-[3px]">
                    <Button
                      onClick={() => {
                        setEditing(false)
                      }}
                      size="tiny"
                      className="!px-[6px] !py-[3px]"
                      type="secondary">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        mutations.updateComment.mutate()
                      }}
                      size="tiny"
                      className="!px-[6px] !py-[3px]"
                      disabled={editorRef.current?.editor()?.isEmpty || mutations.updateComment.isPending}>
                      Save
                    </Button>
                  </div>
                }
              />
            )}
          </div>
          <div className="text-sm text-alpha-40">{timeAgo(comment.created_at)}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="relative h-6 scx-comment-reactions">
            <context.components.CommentReactions
              toggleReaction={toggleReaction}
              activeReactions={activeReactions}
              reactionsMetadata={comment.reactions_metadata}
            />
          </div>
          <div className="flex space-x-3 text-sm text-alpha-40">
            {!isReply && (
              <div onClick={() => setRepliesVisible((prev: any) => !prev)} className="cursor-pointer" tabIndex={0}>
                {!repliesVisible && <div>view replies ({comment.replies_count})</div>}
                {repliesVisible && <div>hide replies</div>}
              </div>
            )}
            {!isReplyingTo && (
              <div
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => {
                  replyManager?.setReplyingTo(comment)
                }}>
                reply
              </div>
            )}
            {isReplyingTo && (
              <div
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => {
                  replyManager?.setReplyingTo(null)
                }}>
                cancel
              </div>
            )}
          </div>
        </div>
        <div>
          {repliesVisible && !isReply && (
            <div className="my-3">
              <Comments topic={comment.topic} parent_id={comment.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export interface CommentsProps {
  topic: string
  parent_id?: number
}

function Comments({ topic, parent_id }: CommentsProps) {
  const editorRef = useRef<EditorRefHandle | null>(null)
  const context = useCommentsContext()
  const [layoutReady, setLayoutReady] = useState(false)
  const [parent] = useAutoAnimate<HTMLDivElement>()

  const replyManager = useReplyManager()
  const commentState = useUncontrolledState({ defaultValue: '' })
  const { auth, isAuthenticated, runIfAuthenticated } = useAuthUtils()

  const queries = {
    comments: useComments({ topic, parentId: parent_id }),
    user: useUser({ id: auth.user?.id, enabled: !!auth.user?.id }),
  }
  const mutations = {
    addComment: useAddComment(),
  }
  const [_error, setError] = useState('')

  const handleCommentCreate = async (body: string) => {
    if (body.trim().length === 0) {
      setError('You need to specify a body!')
      return
    }

    if (body.trim().length < 4) {
      setError('body is too short!')
      return
    }

    return await mutations.addComment
      .mutateAsync({
        topic,
        parent_id,
        body,
      })
      .then(() => {
        setError('')
      })
  }

  useReactions()
  useEffect(() => {
    if (replyManager?.replyingTo) {
      commentState.setDefaultValue(
        `<span data-type="mention" data-id="${replyManager?.replyingTo.author.id}" data-label="${replyManager?.replyingTo.author.name}" contenteditable="false"></span><span>&nbsp</span>`
      )
    } else {
      commentState.setDefaultValue('')
    }
  }, [replyManager?.replyingTo])

  useEffect(() => {
    if (mutations.addComment.isSuccess) {
      replyManager?.setReplyingTo(null)
      commentState.setDefaultValue('')
    }
  }, [mutations.addComment.isSuccess])

  useLayoutEffect(() => {
    if (queries.comments.isSuccess) {
      setLayoutReady(true)
    }
  }, [queries.comments.isSuccess])

  const user = queries.user.data

  return (
    <div className={cx(context.mode, 'scx-comments relative')}>
      {queries.comments.isLoading && (
        <div className="grid p-4 place-items-center">
          <div className="mr-4">
            <Loading active>{null}</Loading>
          </div>
        </div>
      )}
      <div ref={parent}>
        {queries.comments.isError && (
          <div className="grid p-4 place-items-center">
            <div className="flex flex-col items-center space-y-0.5 text-center">
              <Typography.Text>
                <AlertCircle />
              </Typography.Text>
              <Typography.Text>Unable to load comments.</Typography.Text>
            </div>
          </div>
        )}
      </div>
      <div ref={parent}>
        {queries.comments.data && (
          <div className={cx('relative space-y-1 rounded-md', !layoutReady ? 'invisible' : 'visible')}>
            <div className="space-y-1">
              {queries.comments.data.map((comment) => (
                <Comment key={comment.id} id={comment.id} />
              ))}
            </div>
            <div className="flex space-x-2">
              <div className="min-w-fit">
                <User id={user?.id} showAvatar showName={false} />
              </div>
              <div className="flex-1">
                <Editor
                  ref={editorRef}
                  key={commentState.key}
                  defaultValue={commentState.defaultValue}
                  onChange={(val) => {
                    commentState.setValue(val)
                  }}
                  autoFocus={!!replyManager?.replyingTo}
                  actions={
                    <Button
                      onClick={() => {
                        runIfAuthenticated(() => {
                          handleCommentCreate(commentState.value)
                        })
                      }}
                      size="tiny"
                      className="!px-[6px] !py-[3px] m-[3px]"
                      disabled={
                        (isAuthenticated && editorRef.current?.editor()?.isEmpty) || mutations.addComment.isPending
                      }>
                      {!isAuthenticated ? 'Sign In' : 'Submit'}
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export interface ReactionProps {
  type: string
}

function Reaction({ type }: ReactionProps) {
  const query = useReaction({ type })

  return (
    <div className={cx('h-4 w-4 rounded-full grid place-items-center text-alpha-50')}>
      <img className="h-4 w-4" src={query.data?.url} alt={query.data?.label} />
    </div>
  )
}

function CommentReactionsModal({ visible, commentId, reactionType, onClose }: any) {
  const query = useCommentReactions({
    commentId,
    reactionType,
    enabled: visible,
  })

  return (
    <div className="fixed inset-0 -z-10">
      <Modal
        title="Reactions"
        visible={visible}
        onCancel={() => onClose()}
        onConfirm={() => onClose()}
        showIcon={false}
        size="tiny"
        hideFooter>
        <div className="max-h-[320px] overflow-y-auto space-y-3 w-full">
          {query.isLoading && (
            <div className="grid w-full h-10 place-items-center">
              <div className="mr-4">
                <Loading active>{null}</Loading>
              </div>
            </div>
          )}
          {query.data?.map((commentReaction) => (
            <User key={commentReaction.id} id={commentReaction.user_id} showAvatar showName className="font-bold" />
          ))}
        </div>
      </Modal>
    </div>
  )
}

export interface CommentReactionProps {
  metadata: api.CommentReactionMetadata
  toggleReaction: (reactionType: string) => void
}

function CommentReaction({ metadata, toggleReaction }: CommentReactionProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [parent] = useAutoAnimate<HTMLDivElement>()

  return (
    <>
      <CommentReactionsModal
        commentId={metadata.comment_id}
        reactionType={metadata.type}
        visible={showDetails}
        onClose={() => setShowDetails(false)}
        size="small"
      />
      <div
        ref={parent}
        className={cx(
          'flex space-x-2 py-0.5 px-1 rounded-full items-center border-2',
          metadata.active_for_user
            ? `bg-[color:var(--scx-accent-50)] dark:bg-[color:var(--scx-accent-900)] border-[color:var(--scx-accent-200)] dark:border-[color:var(--scx-accent-600)]`
            : 'bg-transparent border-alpha-10'
        )}>
        <div
          tabIndex={0}
          className="cursor-pointer"
          onClick={() => {
            toggleReaction(metadata.type)
          }}>
          <Reaction type={metadata.type} />
        </div>
        <p className="pr-1 text-xs dark:text-[color:var(--scx-accent-50)] text-[color:var(--scx-accent-900)]">
          <span className="cursor-pointer" onClick={() => setShowDetails(true)}>
            {metadata.reaction_count}
          </span>
        </p>
      </div>
    </>
  )
}

export interface ReactionSelectorProps {
  activeReactions: Set<string>
  toggleReaction: (reactionType: string) => void
}

function ReactionSelector({ activeReactions, toggleReaction }: ReactionSelectorProps) {
  const reactions = useReactions()
  return (
    <Dropdown
      overlay={reactions.data?.map((reaction) => (
        <Dropdown.Item
          key={reaction.type}
          onClick={() => {
            toggleReaction(reaction.type)
          }}
          icon={
            <div
              className={cx(
                'p-0.5 -ml-2 border-2 rounded-full',
                activeReactions.has(reaction.type)
                  ? 'bg-[color:var(--scx-accent-50)] border-[color:var(--scx-accent-200)] dark:bg-[color:var(--scx-accent-900)] dark:border-[color:var(--scx-accent-600)]'
                  : 'bg-transparent border-transparent'
              )}>
              <Reaction type={reaction.type} />
            </div>
          }>
          <Typography.Text className="text-sm">{reaction.label}</Typography.Text>
        </Dropdown.Item>
      ))}>
      <div className="flex items-center justify-center w-[22px] h-[22px] text-xs rounded-full border-alpha-10 border-2">
        <Plus className="w-[12px] h-[12px] text-alpha-50" />
      </div>
    </Dropdown>
  )
}

export interface CommentReactionsProps {
  activeReactions: Set<string>
  reactionsMetadata: api.CommentReactionMetadata[]
  toggleReaction: (reactionType: string) => void
}

function CommentReactions({ activeReactions, reactionsMetadata, toggleReaction }: CommentReactionsProps) {
  return (
    <div className="flex h-6 space-x-2">
      <ReactionSelector activeReactions={activeReactions} toggleReaction={toggleReaction} />
      {reactionsMetadata?.map((reactionMetadata) => (
        <CommentReaction key={reactionMetadata.type} metadata={reactionMetadata} toggleReaction={toggleReaction} />
      ))}
    </div>
  )
}

export { User, Comment, Comments, Reaction, CommentReaction, CommentReactions, ReactionSelector }
