import { type ComponentProps, type MutableRefObject, useEffect, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Modal } from 'supalazy'

import { cx } from '../utils.js'
import { useSupabaseClient } from './CommentsProvider.js'
import Auth from './Auth.js'

/**
 * React hook to persist any value between renders,
 * but keeps it up-to-date if it changes.
 *
 * @param value the value or function to persist
 */
function useLatestRef<T>(value: T) {
  const ref = useRef<T | null>(null)
  ref.current = value
  return ref as MutableRefObject<T>
}

export interface AuthModalProps extends Omit<ComponentProps<typeof Auth>, 'supabaseClient'> {
  visible: boolean
  onClose: () => void
  onAuthenticate?: (session: Session) => void
  title?: string
  description?: string
  className?: string
}

function AuthModal({
  visible,
  onAuthenticate,
  onClose,
  title = 'Please Sign In',
  description,
  className,
  ...otherProps
}: AuthModalProps) {
  const supabase = useSupabaseClient()
  const onAuthenticateRef = useLatestRef(onAuthenticate)
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((ev, session) => {
      if (ev === 'SIGNED_IN' && session) {
        onAuthenticateRef.current?.(session)
      }
    })
    return () => {
      subscription.data?.subscription.unsubscribe()
    }
  }, [onAuthenticateRef, supabase])

  return (
    <Modal
      title={title}
      description={description}
      visible={visible}
      onCancel={onClose}
      hideFooter
      size="medium"
      className={cx('min-w-[300px]', className)}>
      <div className={cx('w-full', otherProps.providers && otherProps.providers?.length > 0 ? null : '!-mt-4')}>
        <Auth {...otherProps} supabaseClient={supabase} />
      </div>
    </Modal>
  )
}

export default AuthModal
