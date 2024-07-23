/* eslint-disable ts/consistent-type-definitions */
import type { SupabaseClient } from '@supabase/supabase-js'

export type CommentReactionMetadata = {
  comment_id: number
  type: string
  reaction_count: number
  active_for_user: boolean
}
export type DisplayUser = {
  id: string
  name: string
  avatar: string
}

export type Comment = {
  id: number
  user_id: string
  parent_id?: number
  topic: string
  body: string
  created_at: string
  replies_count: number
  reactions_metadata: CommentReactionMetadata[]
  author: DisplayUser
  mentions?: string[]
}
export type Reaction = {
  type: string
  created_at: string
  label: string
  url: string
  metadata: any
}

export function assertResponseOk(response: { error: any }) {
  if (response.error) {
    throw new ApiError(response.error)
  }
}

export class ApiError extends Error {
  type = 'ApiError'
  message: string
  details?: string
  hint?: string
  code?: string
  constructor(error: any) {
    super(error.message)
    this.message = error.message
    this.details = error.details
    this.hint = error.hint
    this.code = error.code
  }
}

export type GetCommentsOptions = {
  topic: string
  parent_id?: number
}

export type AddCommentPayload = {
  body: string
  topic: string
  parent_id?: number
  mentions?: string[]
}

export type UpdateCommentPayload = {
  body: string
  mentions?: string[]
}

export type CommentReaction = {
  id: number
  user_id: string
  comment_id: number
  type: string
  created_at: string
  author: DisplayUser
}

export type CommentReactionPayload = {
  type: string
  comment_id: number
}
export function createApiClient(supabase: SupabaseClient) {
  const getComments = async ({ topic, parent_id }: GetCommentsOptions) => {
    const query = supabase
      .from('comment_meta')
      .select('*,reactions_metadata:comment_reactions_metadata(*)')
      .eq('topic', topic)
      .order('created_at', { ascending: true })

    if (parent_id) {
      query.eq('parent_id', parent_id)
    }
    else {
      query.is('parent_id', null)
    }
    const response = await query
    assertResponseOk(response)
    return response.data as Comment[]
  }

  const getComment = async (id: number) => {
    const query = supabase
      .from('comment_meta')
      .select('*,reactions_metadata:comment_reactions_metadata(*)')
      .eq('id', id)
      .single()

    const response = await query
    assertResponseOk(response)
    return response.data as Comment
  }

  const addComment = async (payload: AddCommentPayload) => {
    const query = supabase
      .from('comments')
      .insert({
        ...payload,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .single()

    const response = await query
    assertResponseOk(response)
    return response.data as unknown as Comment
  }

  const updateComment = async (id: number, payload: UpdateCommentPayload) => {
    const query = supabase.from('comments').update(payload).match({ id }).single()
    const response = await query
    assertResponseOk(response)
    return response.data as unknown as Comment
  }

  const deleteComment = async (id: number) => {
    const query = supabase.from('comments').delete().match({ id }).single()
    const response = await query
    assertResponseOk(response)
    return response.data as unknown as Comment
  }

  const getReactions = async () => {
    const query = supabase.from('reactions').select('*').order('type', { ascending: true })
    const response = await query
    assertResponseOk(response)
    return response.data as Reaction[]
  }

  const getReaction = async (type: string) => {
    const query = supabase.from('reactions').select('*').eq('type', type).single()
    const response = await query
    assertResponseOk(response)
    return response.data as Reaction
  }

  const getCommentReactions = async ({ type, comment_id }: CommentReactionPayload) => {
    const query = supabase
      .from('comment_reactions')
      .select('*,user:display_users!user_id(*)')
      .eq('comment_id', comment_id)
      .eq('type', type)
    const response = await query
    assertResponseOk(response)
    return response.data as CommentReaction[]
  }

  const addCommentReaction = async (payload: CommentReactionPayload) => {
    const query = supabase
      .from('comment_reactions')
      .insert({
        ...payload,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .single()

    const response = await query
    assertResponseOk(response)
    return response.data as unknown as CommentReaction
  }

  const removeCommentReaction = async ({ type, comment_id }: CommentReactionPayload) => {
    const query = supabase
      .from('comment_reactions')
      .delete()
      .match({
        type,
        comment_id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .single()
    const response = await query
    assertResponseOk(response)
    return response.data as unknown as CommentReaction
  }

  const searchUsers = async (search: string): Promise<DisplayUser[]> => {
    const query = supabase.from('display_users').select('*').ilike('name', `%${search}%`).limit(5)
    const response = await query
    assertResponseOk(response)
    return response.data as DisplayUser[]
  }

  const getUser = async (id: string) => {
    const query = supabase.from('display_users').select('*').eq('id', id).single()

    const response = await query
    assertResponseOk(response)
    return response.data as DisplayUser
  }

  return {
    getComments,
    getComment,
    addComment,
    updateComment,
    deleteComment,
    getReactions,
    getReaction,
    getCommentReactions,
    addCommentReaction,
    removeCommentReaction,
    searchUsers,
    getUser,
  }
}
