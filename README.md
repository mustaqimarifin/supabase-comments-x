# Supabase Comments X

> Just a fork of the excellent [Supabase-Comments-Extension](https://malerba118.github.io/supabase-comments-extension/) by [Austin Malerba](https://github.com/malerba118). Give the project a like!

## Whats different?

**BREAKING CHANGES**

- Fully ESM.
- Now on Tanstack/@tanstack/react-query
- Removed all Date-related packages. Using native JS.
- Removed `color` for `tinycolor2`

**Size**

- Biggest change by far. Over 50% in reduction in overall project size, much of it due to the deprecated @supabase/ui library which re-exported almost all of Feather icons. So that was scrapped and replaced with Lucide React which already tree-shakes any unused icons.

**REACT 18**

- All dependencies have been updated

**FIXES**

- useLayoutEffect to isomorphicEffect to silence console warnings
- Addressed duplicate 'CodeBlock' issue with @tiptap editor

_and_

- Personalized stickers 👺

---

Add a robust comment system to your react app in ~10 minutes!

This library provides comments, replies, reactions, mentions, and authentication all out of the box.


## Getting Started

First things first, this project is powered by [supabase](https://supabase.com/) so if you don't already have a supabase db, [head over there and make one](https://app.supabase.io/) (it's super simple and literally takes a few seconds)

### Installation

Install this package and its peer dependencies

```bash
npm install --save supabase-comments-x @supabase/ssr @supabase/supabase-js @tanstack/react-query
```

### Running Migrations

Once you've got yourself a supabase db, you'll need to add a few tables and other sql goodies to it with the following command

```bash
npx supabase-comments-x run-migrations <supabase-connection-string>
```

You can find your connection string on the supabase dashboard: https://app.supabase.io/project/PUT-YOUR-PROJECT-ID-HERE/settings/database

It should look something like this: `postgresql://postgres:some-made-up-password@db.ddziybrgjepxqpsflsiv.supabase.co:5432/postgres`

### Usage With Auth

Then in your app code you can add comments with the following

```jsx utils/supabase/client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
```

```jsx
import { useState } from 'react'
import {
  AuthModal,
  Comments,
  CommentsProvider,
} from 'supabase-comments-x'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function CommentSection({ slug }: { slug: string }) {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <CommentsProvider
      supabaseClient={supabase}
      onAuthRequested={() => setModalVisible(true)}
    >
      <AuthModal
        visible={modalVisible}
        onAuthenticate={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        providers={['google', 'facebook']}
      />
      <Comments topic={slug} />
    </CommentsProvider>
  )
}
```

Note that [supabase supports social auth with dozens of providers out-of-the-box](https://supabase.com/docs/guides/auth#authentication) so you can sign in with Google, Facebook, Twitter, Github and many more.

supabase-comments-x exports two auth components, `Auth` and `AuthModal`. The `Auth` component is a small adaptation of [@supabase/ui's Auth component](https://ui.supabase.io/components/auth) and supports all of the same props. `AuthModal` also supports all of the same props as the `Auth` component along with [a few additional props](https://github.com/mustaqimarifin/supabase-comments-x/edit/main/README.md#api).

Lastly, if you want to write your own authentication ui, then know that the supbase client provides a method `supabase.auth.signIn` which can authenticate the supabase client without forcing any ui on you.

```tsx
import { createClient } from '@/utils/supabase/client'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Social Auth
const { user, error } = await supabase.auth.signInWithOAuth({
  provider: 'facebook',
})

// Email/Password Auth
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password',
})
```

### Usage Without Auth/Next.JS

If you already have an app set up with supabase authentication or utilizing any server-side features (Next.JS)
then you can skip the `AuthModal` and direct the user to your
existing sign-in system.

```jsx
import { useState } from 'react'
import { Comments, CommentsProvider } from 'supabase-comments-x'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function App() {
  return (
    <CommentsProvider
      supabaseClient={supabase}
      onAuthRequested={() => {
        window.location.href = '/sign-in'
      }}
    >
      <Comments topic="tutorial-one" />
    </CommentsProvider>
  )
}
```

## Advanced Features

supabase-comments-x includes a handful of customization options to meet your app's needs

### Bring Your Own Reactions

You can add your own reactions by adding rows to the `reactions` table.

<img width="838" alt="Screen Shot 2022-02-01 at 4 31 55 PM" src="https://user-images.githubusercontent.com/5760059/152088763-8de5ac3f-ebc6-4337-8ad7-073ce63b288b.png">

It's easy to add rows via the supabase dashboard or if you prefer you can write some sql to insert new rows.

```sql
INSERT into
    reactions (type, label, url)
values (
        'heart',
        'Bulma',
        'https://i.postimg.cc/8zHSsSRD/bulma.webp'
    );

INSERT into
    reactions (type, label, url)
values (
        'like',
        'Like',
        'https://i.postimg.cc/PqVnzQVR/nofucks.webp'
    );

INSERT into
    reactions (type, label, url)
values (
        'suss-cat',
        'Suss Cat',
        'https://i.postimg.cc/sXBdnGtD/suss.webp'
    );
```

### Custom Reaction Rendering

If you want to customize the way comment reactions are rendered then you're in luck!
You can pass your own `CommentReactions` component to control exactly how reactions are rendered beneath each comment.

```tsx
import { useState } from 'react'
import { Button } from '@supabase/ui'
import {
  CommentReactionsProps,
  Comments,
  CommentsProvider,
} from 'supabase-comments-x'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function CustomCommentReactions({
  activeReactions,
  toggleReaction,
}) {
  return (
    <Button className="!py-0.5" onClick={() => toggleReaction('like')}>
      {activeReactions.has('like') ? 'unlike' : 'like'}
    </Button>
  )
}

function App() {
  return (
    <CommentsProvider
      supabaseClient={supabase}
      components={{
        CommentReactions: CustomCommentReactions,
      }}
    >
      <Comments topic="custom-reactions" />
    </CommentsProvider>
  )
}
```

The above code will render the following ui

<img width="548" alt="Screen Shot 2022-02-01 at 8 34 33 PM" src="https://user-images.githubusercontent.com/5760059/152089497-515113e0-5281-4a2e-8c58-5f8c2e40f812.png">

### Handling Mentions

This library includes support for mentions, however mentions are fairly useless without a way to notify the users who are mentioned. You can listen to mentions via postgres triggers and perform some action in response such as insert into a notifications table or send an http request to a custom endpoint.

```sql
CREATE OR REPLACE FUNCTION notify_mentioned_users()
  RETURNS trigger AS
$$
DECLARE
  mentioned_user_id uuid;
BEGIN
  FOREACH mentioned_user_id IN ARRAY NEW.mentioned_user_ids LOOP
	  INSERT INTO your_notifications_table (actor, action, receiver) VALUES(NEW.user_id, 'mention', mentioned_user_id);
  END LOOP;
RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER comment_insert_trigger
  AFTER INSERT
  ON comments
  FOR EACH ROW
  EXECUTE PROCEDURE notify_mentioned_users();
```

If you don't care about mentions, then you can disable them via the `CommentsProvider`

```tsx
<CommentsProvider supabaseClient={supabase} enableMentions={false}>
  <Comments topic="mentions-disabled" />
</CommentsProvider>
```

## API

Here's the prop options for primary components you'll be working with

```tsx
interface CommentsProviderProps {
  queryClient?: QueryClient
  supabaseClient: SupabaseClient
  onAuthRequested?: () => void
  onUserClick?: (user: DisplayUser) => void
  mode?: 'light' | 'dark'
  accentColor?: string
  onError?: (error: ApiError, query: Query) => void
  components?: {
    CommentReactions?: ComponentType<{
      activeReactions: Set<string>
      reactionsMetadata: api.CommentReactionMetadata[]
      toggleReaction: (reactionType: string) => void
    }>
  }
  enableMentions?: boolean
}

interface CommentsProps {
  topic: string
}

interface AuthModalProps extends AuthProps {
  visible: boolean
  onClose?: () => void
  onAuthenticate?: (session: Session) => void
  title?: string
  description?: string
}

// This comes from @supabase/ui (https://ui.supabase.io/components/auth)
// supabase-comments-x provides an adapted version of supabase ui's
// Auth component with support for display names/avatars
interface AuthProps {
  supabaseClient: SupabaseClient
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  socialLayout?: 'horizontal' | 'vertical'
  socialColors?: boolean
  socialButtonSize?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
  providers?: Provider[]
  verticalSocialLayout?: any
  view?: ViewType
  redirectTo?: RedirectTo
  onlyThirdPartyProviders?: boolean
  magicLink?: boolean
}
```
