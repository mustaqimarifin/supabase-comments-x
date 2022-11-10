CREATE table "public"."comment_reactions" (
    "id" uuid not null default uuid_generate_v7(),
    "created_at" timestamp with time zone default now(),
    "comment_id" uuid not null,
    "user_id" uuid not null,
    "reaction_type" character varying not null
);

CREATE table "public"."comments" (
    "id" uuid not null default uuid_generate_v7(),
    "created_at" timestamp with time zone default now(),
    "topic" text not null,
    "comment" text not null,
    "user_id" uuid not null,
    "parent_id" uuid,
    "mentioned_user_ids" uuid [] not null default '{}' :: uuid []
);

CREATE table "public"."reactions" (
    "type" character varying not null,
    "created_at" timestamp with time zone default now(),
    "label" text not null,
    "url" text not null,
    "metadata" jsonb
);

CREATE UNIQUE INDEX comment_reactions_pkey ON public.comment_reactions USING btree (id);

CREATE UNIQUE INDEX comment_reactions_user_id_comment_id_reaction_type_key ON public.comment_reactions USING btree (user_id, comment_id, reaction_type);

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX reactions_pkey ON public.reactions USING btree (type);

ALTER table
    "public"."comment_reactions"
add
    constraint "comment_reactions_pkey" PRIMARY KEY using index "comment_reactions_pkey";

ALTER table
    "public"."comments"
add
    constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

ALTER table
    "public"."reactions"
add
    constraint "reactions_pkey" PRIMARY KEY using index "reactions_pkey";

ALTER table
    "public"."comment_reactions"
add
    constraint "comment_reactions_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE;

ALTER table
    "public"."comment_reactions"
add
    constraint "comment_reactions_reaction_type_fkey" FOREIGN KEY (reaction_type) REFERENCES reactions(type);

ALTER table
    "public"."comment_reactions"
add
    constraint "comment_reactions_user_id_comment_id_reaction_type_key" UNIQUE using index "comment_reactions_user_id_comment_id_reaction_type_key";

ALTER table
    "public"."comment_reactions"
add
    constraint "comment_reactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER table
    "public"."comments"
add
    constraint "comments_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;

ALTER table
    "public"."comments"
add
    constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE
or replace view "public"."comment_reactions_metadata" as
SELECT
    comment_reactions.comment_id,
    comment_reactions.reaction_type,
    count(*) AS reaction_count,
    bool_or((comment_reactions.user_id = auth.uid())) AS active_for_user
FROM
    comment_reactions
GROUP BY
    comment_reactions.comment_id,
    comment_reactions.reaction_type
ORDER BY
    comment_reactions.reaction_type;

CREATE
or replace view "public"."comments_with_metadata" as
SELECT
    comments.id,
    comments.created_at,
    comments.topic,
    comments.comment,
    comments.user_id,
    comments.parent_id,
    comments.mentioned_user_ids,
    (
        SELECT
            count(*) AS count
        FROM
            comments c
        WHERE
            (c.parent_id = comments.id)
    ) AS replies_count
FROM
    comments;

-- added twitter handle for those using Twitter Authentication.
CREATE
or REPLACE view "public"."display_users" as
SELECT
    users.id,
    COALESCE(
        (users.raw_user_meta_data ->> 'name' :: text),
        (users.raw_user_meta_data ->> 'full_name' :: text)
    ) AS name,
    COALESCE(users.raw_user_meta_data ->> 'user_name' :: text) AS handle,
    COALESCE(
        (
            users.raw_user_meta_data ->> 'avatar_url' :: text
        ),
        (users.raw_user_meta_data ->> 'avatar' :: text)
    ) AS avatar
FROM
    auth.users;

-- seed some basic reactions
INSERT into
    reactions(type, label, url)
values
    (
        'heart',
        'Bulma',
        'https://i.postimg.cc/8zHSsSRD/bulma.webp'
    );

INSERT into
    reactions(type, label, url)
values
    (
        'like',
        'Like',
        'https://i.postimg.cc/PqVnzQVR/nofucks.webp'
    );

INSERT into
    reactions(type, label, url)
values
    (
        'suss-cat',
        'Suss Cat',
        'https://i.postimg.cc/sXBdnGtD/suss.webp'
    );

ALTER table
    "public"."comment_reactions" enable row level security;

ALTER table
    "public"."comments" enable row level security;

ALTER table
    "public"."reactions" enable row level security;

CREATE policy "Enable access to all users" on "public"."comment_reactions" as permissive for
SELECT
    to public using (true);

CREATE policy "Enable delete for users based on user_id" on "public"."comment_reactions" as permissive for delete to public using ((auth.uid() = user_id));

CREATE policy "Enable INSERT for authenticated users only" on "public"."comment_reactions" as permissive for
INSERT
    to public with check (
        (auth.role() = 'authenticated' :: text)
        AND (user_id = auth.uid())
    );

CREATE policy "Enable UPDATE for users based on user_id" on "public"."comment_reactions" as permissive for
UPDATE
    to public using ((auth.uid() = user_id)) with check (auth.uid() = user_id);

CREATE policy "Enable access to all users" on "public"."comments" as permissive for
SELECT
    to public using (true);

CREATE policy "Enable delete for users based on user_id" on "public"."comments" as permissive for delete to public using ((auth.uid() = user_id));

CREATE policy "Enable INSERT for authenticated users only" on "public"."comments" as permissive for
INSERT
    to public with check (
        (auth.role() = 'authenticated' :: text)
        AND (user_id = auth.uid())
    );

CREATE policy "Enable UPDATE for users based on id" on "public"."comments" as permissive for
UPDATE
    to public using ((auth.uid() = user_id)) with check (auth.uid() = user_id);

CREATE policy "Enable access to all users" on "public"."reactions" as permissive for
SELECT
    to public using (true);