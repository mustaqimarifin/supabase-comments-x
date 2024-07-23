import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSupabaseClient } from '../components/CommentsProvider.js'
import { createApiClient } from '../api.js'
import type { Comment } from '../api.js'

function useAPI() {
  const supabase = useSupabaseClient()
  const api = useMemo(() => createApiClient(supabase), [supabase])
  return api
}
// MUTATIONS

function useAddComment() {
  const queryClient = useQueryClient()
  const api = useAPI()
  return useMutation({
    mutationFn: api.addComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        type: 'active',
        refetchType: 'active',
        queryKey: ['comments'],
      })
    },
  })
}
function addOrIncrement(reactionType: string, comment: Comment): Comment {
  const isInArray = !!comment.reactions_metadata.find(val => val.type === reactionType)
  let newArray = [...comment.reactions_metadata]
  if (!isInArray) {
    newArray.push({
      comment_id: comment.id,
      type: reactionType,
      reaction_count: 1,
      active_for_user: true,
    })
  }
  else {
    newArray = newArray.map((item) => {
      if (item.type === reactionType) {
        return {
          ...item,
          reaction_count: item.reaction_count + 1,
          active_for_user: true,
        }
      }
      else {
        return item
      }
    })
  }
  newArray.sort((a, b) => a.type.localeCompare(b.type))
  return {
    ...comment,
    reactions_metadata: newArray,
  }
}

function useAddReaction() {
  const queryClient = useQueryClient()
  const api = useAPI()

  return useMutation({
    mutationFn: api.addCommentReaction,
    onSuccess: async (data) => {
      await queryClient.setQueryData(['comments', data?.comment_id], (prev: Comment) =>
        addOrIncrement(data?.type, prev))
      queryClient.invalidateQueries({ type: 'active', refetchType: 'active', queryKey: ['comments'] })
      queryClient.invalidateQueries({
        type: 'active',
        refetchType: 'active',
        queryKey: ['comment-reactions'],
      })
    },
  })
}

function removeOrDecrement(reactionType: string | undefined, comment: Comment): Comment {
  let newArray = [...comment.reactions_metadata]
  newArray = newArray.map((item) => {
    if (item.type === reactionType) {
      return {
        ...item,
        reaction_count: item.reaction_count - 1,
        active_for_user: false,
      }
    }
    else {
      return item
    }
  })
  newArray = newArray.filter((item) => {
    return item.reaction_count > 0
  })
  newArray.sort((a, b) => a.type.localeCompare(b.type))
  return {
    ...comment,
    reactions_metadata: newArray,
  }
}

function useRemoveReaction() {
  const queryClient = useQueryClient()
  const api = useAPI()
  return useMutation({
    mutationFn: api.removeCommentReaction,
    onSuccess: (data) => {
      queryClient.setQueryData(['comments', data?.comment_id], (prev: Comment) => removeOrDecrement(data?.type, prev))
      queryClient.invalidateQueries({
        type: 'active',
        refetchType: 'active',
        queryKey: ['comments', data?.comment_id],
      })
      queryClient.invalidateQueries({
        type: 'active',
        refetchType: 'active',

        queryKey: ['comment-reactions', { commentId: data?.comment_id, reactionType: data?.type }],
      })
    },
  })
}

interface UseDeleteCommentPayload {
  id: number
}
function useDeleteComment({ id }: UseDeleteCommentPayload) {
  const queryClient = useQueryClient()
  const api = useAPI()
  return useMutation({
    mutationFn: () => api.deleteComment(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        type: 'active',
        refetchType: 'active',
        queryKey: ['comments', { topic: data.topic, parentId: data.parent_id }],
      })
    },
  })
}

interface UseUpdateCommentPayload {
  id: number
  body: string
  mentions: string[]
}

function useUpdateComment({ id, body, mentions }: UseUpdateCommentPayload) {
  const queryClient = useQueryClient()
  const api = useAPI()

  return useMutation({
    mutationFn: () => api.updateComment(id, { body, mentions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ type: 'active', refetchType: 'active', queryKey: ['comments'] })
    },
  })
}
// QUERIES

interface UseCommentQuery {
  id: number
}
interface UseCommentOptions {
  enabled?: boolean
}

function useComment({ id }: UseCommentQuery, options: UseCommentOptions = {}) {
  const api = useAPI()
  return useQuery({
    queryKey: ['comments', id],
    queryFn: () => api.getComment(id),
    enabled: options.enabled,
    staleTime: Infinity,
  })
}

interface UseCommentReactionsQuery {
  commentId: number
  reactionType: string
  enabled?: string
}

interface Options {
  enabled?: boolean
}

function useCommentReactions({ commentId, reactionType }: UseCommentReactionsQuery, options: Options = {}) {
  const api = useAPI()
  return useQuery({
    queryKey: ['comment-reactions', { commentId, reactionType }],
    queryFn: () => {
      return api.getCommentReactions({
        comment_id: commentId,
        type: reactionType,
      })
    },
    enabled: options.enabled,
    staleTime: Infinity,
  })
}

interface UseCommentsQuery {
  topic: string
  parentId?: number
}

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
function useComments({ topic, parentId }: UseCommentsQuery, options: Options = {}) {
  const api = useAPI()
  return useQuery({
    queryKey: ['comments', { topic, parentId }],
    queryFn: async () => {
      const minTime = timeout(60)
      const comments = api.getComments({ topic, parent_id: parentId })
      await minTime
      return comments
    },
    enabled: options.enabled,
    staleTime: Infinity,
  })
}

interface UseReactionQuery {
  type: string
}

function useReaction({ type }: UseReactionQuery, options: Options = {}) {
  const api = useAPI()
  return useQuery({
    queryKey: ['reactions', type],
    queryFn: () => api.getReaction(type),
    enabled: options.enabled,
    staleTime: Infinity,
  })
}

function useReactions(options: Options = {}) {
  const api = useAPI()

  return useQuery({
    queryKey: ['reactions'],
    queryFn: () => api.getReactions(),
    enabled: options.enabled,
    staleTime: Infinity,
  })
}

interface UseUserQuery {
  id: string
  enabled?: boolean
}

function useUser({ id }: UseUserQuery, options: Options = {}) {
  const api = useAPI()
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => api.getUser(id),
    enabled: options.enabled,
    staleTime: Infinity,
  })
}

interface UseSearchUsersQuery {
  search: string
}

function useSearchUsers({ search }: UseSearchUsersQuery, options: Options = {}) {
  const api = useAPI()

  return useQuery({
    queryKey: ['users', { search }],
    queryFn: () => api.searchUsers(search),
    enabled: options.enabled,
    staleTime: Infinity,
  })
}

export {
  useComment,
  useComments,
  useSearchUsers,
  useUser,
  useReaction,
  useReactions,
  useCommentReactions,
  useAddComment,
  useAddReaction,
  useDeleteComment,
  useRemoveReaction,
  useUpdateComment,
}
