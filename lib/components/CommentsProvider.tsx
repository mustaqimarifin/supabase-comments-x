import { type ComponentType, createContext, useContext, useEffect, useMemo } from 'react'
import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Query } from '@tanstack/react-query'
import type { ApiError, DisplayUser } from '../api.js'
import { useCssPalette } from '../utils.js'
import { type CommentReactionsProps, CommentReactions as DefaultReactions } from './CommentSection.js'
import Auth from './Auth.js'

function makeQueryClient() {
  return new QueryClient({})
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  }
  else {
    if (!browserQueryClient)
      browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

const SupabaseClientContext = createContext<SupabaseClient<any, any, any> | null>(null)

export function useSupabaseClient() {
  const supabaseClient = useContext(SupabaseClientContext)
  if (!supabaseClient) {
    throw new Error('No supabase client found. Make sure this code is contained in a CommentsProvider.')
  }
  return supabaseClient
}

export interface ComponentOverrideOptions {
  CommentReactions?: ComponentType<CommentReactionsProps>
}

export interface CommentsContextApi {
  enableMentions?: boolean
  onAuthRequested?: () => void
  onUserClick?: (author: DisplayUser) => void
  mode: 'light' | 'dark'
  components: Required<ComponentOverrideOptions>
}

const CommentsContext = createContext<CommentsContextApi | null>(null)

export function useCommentsContext() {
  const context = useContext(CommentsContext)
  if (!context) {
    throw new Error('CommentsProvider not found. Make sure this code is contained in a CommentsProvider.')
  }
  return context
}
export function useAuthUtils() {
  const auth = Auth.useUser()
  const { onAuthRequested } = useCommentsContext()

  const isAuthenticated = !!auth.session

  const runIfAuthenticated = (callback: () => void) => {
    if (!isAuthenticated) {
      onAuthRequested?.()
    }
    callback()
  }

  return {
    runIfAuthenticated,
    isAuthenticated,
    auth,
  }
}

export interface CommentsProviderProps {
  queryClient?: QueryClient
  supabaseClient: SupabaseClient<any, any, any>
  onAuthRequested?: () => void
  onUserClick?: (author: DisplayUser) => void
  mode?: 'light' | 'dark'
  accentColor?: string
  onError?: (error: ApiError, query: Query) => void
  enableMentions?: boolean
  components?: ComponentOverrideOptions
  children: React.ReactNode
}

function CommentsProvider({
  queryClient,
  supabaseClient,
  children,
  onAuthRequested,
  onUserClick,
  mode = 'light',
  accentColor = '#ff8787',
  onError,
  components,
  enableMentions,
}: CommentsProviderProps) {
  queryClient = getQueryClient()
  const value = useMemo(
    () => ({
      onAuthRequested,
      enableMentions,
      onUserClick,
      mode,
      components: {
        CommentReactions: components?.CommentReactions || DefaultReactions,
      },
    }),
    [onAuthRequested, onUserClick, mode, components?.CommentReactions, enableMentions],
  )

  useEffect(() => {
    const subscription = supabaseClient.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries()
    })
    return () => {
      subscription.data?.subscription.unsubscribe()
    }
  }, [queryClient, supabaseClient])

  useCssPalette(accentColor, 'scx-accent')

  useEffect(() => {
    document.body.classList.add(mode)
    return () => {
      document.body.classList.remove(mode)
    }
  }, [mode])

  useEffect(() => {
    const queryCache = queryClient.getQueryCache()
    const originalErrorHandler = queryCache.config.onError
    queryCache.config.onError = (error, query) => {
      onError?.(error as ApiError, query as Query)
      originalErrorHandler?.(error, query)
    }
  }, [queryClient, onError])

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseClientContext.Provider value={supabaseClient}>
        <Auth.UserContextProvider supabaseClient={supabaseClient}>
          <CommentsContext.Provider value={value}>{children}</CommentsContext.Provider>
        </Auth.UserContextProvider>
      </SupabaseClientContext.Provider>
    </QueryClientProvider>
  )
}

export default CommentsProvider
