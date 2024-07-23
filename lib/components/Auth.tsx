/* eslint-disable eqeqeq */

import type { Provider, Session, SupabaseClient, User } from '@supabase/supabase-js'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Space } from 'supalazy'
import { Google, Twitter, Discord, Github } from '../Icons.js'

export interface AuthSession {
  user: User | null
  session: Session | null
}

const UserContext = createContext<AuthSession>({ user: null, session: null })

interface Props {
  supabaseClient: SupabaseClient
  [propName: string]: any
}

export function UserContextProvider(props: Props) {
  const { supabaseClient } = props
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(session?.user ?? null)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabaseClient.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user ?? null)
    })()

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])
  const value = useMemo(
    () => ({
      session,
      user,
    }),
    [session, user]
  )

  return <UserContext.Provider value={value} {...props} />
}

export function useUserCTX() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`)
  }
  return context
}

export interface IconsProps {
  provider: string
}

function Icons({ provider }: IconsProps) {
  if (provider == 'google') return Google()
  if (provider == 'twitter') return Twitter()
  if (provider == 'github') return Github()
  if (provider == 'discord') return Discord()

  return null
}

type RedirectTo = undefined | string

declare type ProviderScopes = {
  [key in Partial<Provider>]: string
}

export interface AuthProps {
  supabaseClient: SupabaseClient<any, any, any>
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  socialLayout?: 'horizontal' | 'vertical'
  socialColors?: boolean
  socialButtonSize?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
  providers?: Provider[]
  view?: 'sign_in' | 'sign_up' | 'magic_link'

  providerScopes?: Partial<ProviderScopes>
  queryParams?: { [key: string]: string }
  verticalSocialLayout?: any
  redirectTo?: RedirectTo
  onlyThirdPartyProviders?: boolean
  magicLink?: boolean
}
function Auth({
  supabaseClient,
  className,
  style,
  socialLayout = 'vertical',
  socialColors = false,
  socialButtonSize = 'medium',
  providers,
  redirectTo,
  onlyThirdPartyProviders = false,
  magicLink = false,
  ...props
}: AuthProps) {
  const verticalSocialLayout = socialLayout === 'vertical'
  const containerClasses = [] as string[]
  if (className) {
    containerClasses.push(className)
  }

  return (
    <div className={containerClasses.join(' ')} style={style}>
      <Space size={8} direction="vertical">
        <SocialAuth
          supabaseClient={supabaseClient}
          verticalSocialLayout={verticalSocialLayout}
          providers={providers}
          socialLayout={socialLayout}
          socialButtonSize={socialButtonSize}
          socialColors={socialColors}
          redirectTo={redirectTo}
          onlyThirdPartyProviders={onlyThirdPartyProviders}
          magicLink={magicLink}
        />
        {!onlyThirdPartyProviders && props.children}
      </Space>
    </div>
  )
}

function SocialAuth({
  supabaseClient,
  socialLayout = 'vertical',
  socialColors = false,
  socialButtonSize,
  providers,
  queryParams,
  providerScopes,
  verticalSocialLayout,
  redirectTo,
}: AuthProps) {
  const buttonStyles: any = {
    github: {
      backgroundColor: '#333',
      color: 'white',
    },

    google: {
      backgroundColor: '#ce4430',
      color: 'white',
    },
    twitter: {
      backgroundColor: '#1DA1F2',
      color: 'white',
    },

    discord: {
      backgroundColor: '#404fec',
      color: 'white',
    },
  }
  const [loading, setLoading] = useState(false)
  const [_error, setError] = useState('')

  const handleProviderSignIn = async (provider: Provider) => {
    setLoading(true)
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        scopes: providerScopes?.[provider],
        queryParams,
      },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <Space size={8} direction="vertical">
      {providers && providers.length > 0 && (
        <Space size={4} direction="vertical">
          <Space size={2} direction={socialLayout}>
            {providers.map((provider) => {
              return (
                <div key={provider} style={!verticalSocialLayout ? { flexGrow: 1 } : {}}>
                  <Button
                    block
                    type="default"
                    shadow
                    size={socialButtonSize}
                    style={socialColors ? buttonStyles[provider] : {}}
                    icon={<Icons provider={provider} />}
                    loading={loading}
                    onClick={() => handleProviderSignIn(provider)}
                    className="flex items-center">
                    {verticalSocialLayout && `Sign up with ${provider.charAt(0).toUpperCase()}${provider.slice(1)}`}
                  </Button>
                </div>
              )
            })}
          </Space>
        </Space>
      )}
    </Space>
  )
}
Auth.UserContextProvider = UserContextProvider
Auth.useUser = useUserCTX
export default Auth
