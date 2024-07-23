alter table comment_reactions enable row level security;

alter table comments enable row level security;

alter table reactions enable row level security;

create policy "Enable access to all users"
on comment_reactions
as permissive
for select
to public
using (true);


create policy "Enable delete for users based on user_id"
on comment_reactions
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on comment_reactions
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text) AND (user_id = auth.uid()));


create policy "Enable update for users based on user_id"
on comment_reactions
as permissive
for update
to public
using ((auth.uid() = user_id))
with check (auth.uid() = user_id);


create policy "Enable access to all users"
on comments
as permissive
for select
to public
using (true);


create policy "Enable delete for users based on user_id"
on comments
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on comments
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text) AND (user_id = auth.uid()));


create policy "Enable update for users based on id"
on comments
as permissive
for update
to public
using ((auth.uid() = user_id))
with check (auth.uid() = user_id);


create policy "Enable access to all users"
on reactions
as permissive
for select
to public
using (true);
