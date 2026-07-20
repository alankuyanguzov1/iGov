-- Миграция 0003: полное самоудаление аккаунта пользователем
-- Функция выполняется с правами владельца, удаляет запись из auth.users,
-- каскад удаляет profiles и user_benefits.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_my_account() from public;
revoke execute on function public.delete_my_account() from anon;
grant execute on function public.delete_my_account() to authenticated;
