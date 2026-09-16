-- Run only against the isolated local database; every fixture is rolled back.
begin;
do $$ begin
  if current_setting('port') <> '55437' then raise exception 'Use the isolated test database on port 55437'; end if;
end $$;
create function pg_temp.assert_true(value boolean, label text) returns void language plpgsql as $$
begin if value is distinct from true then raise exception 'FAIL: %',label; end if; raise notice 'PASS: %',label; end $$;
create function pg_temp.denied(statement text) returns void language plpgsql as $$
begin
  begin execute statement; exception when insufficient_privilege then raise notice 'PASS: denied %',statement; return; end;
  raise exception 'FAIL: unauthorized statement succeeded: %',statement;
end $$;

insert into auth.users(id,email) values
('00000000-0000-0000-0000-000000000001','admin@example.invalid'),
('00000000-0000-0000-0000-000000000002','editor@example.invalid'),
('00000000-0000-0000-0000-000000000003','reviewer@example.invalid'),
('00000000-0000-0000-0000-000000000004','subscriber@example.invalid'),
('00000000-0000-0000-0000-000000000005','user@example.invalid');
update public.profiles set role=case right(id::text,1) when '1' then 'admin' when '2' then 'editor' when '3' then 'reviewer' when '4' then 'subscriber_individual' else 'user' end::public.app_role;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',true);
set local role authenticated;
insert into public.composers(id,canonical_name,display_name,slug,publication_status,notes,biography_source)
values('10000000-0000-0000-0000-000000000001','João Villa-Lobos','João Villa-Lobos','test-composer','published','EDITOR-ONLY','EDITOR-SOURCE');
insert into public.works(id,composer_id,canonical_title,display_title,slug,publication_status,subscriber_notes,performance_notes,editorial_notes,composition_year_start,duration_minutes,opus)
values('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Canção','Canção','test-work','published','SUBSCRIBER','PERFORMANCE','EDITOR-ONLY',1950,12.5,'Op. 12'),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Rascunho','Rascunho','test-draft','draft','DRAFT-SECRET',null,null,null,null,null);
select pg_temp.assert_true((public.get_editorial_record('work','20000000-0000-0000-0000-000000000001')->>'editorial_notes')='EDITOR-ONLY','editor reads full row via gated RPC');
update public.works set display_title='Canção revisada',updated_by='00000000-0000-0000-0000-000000000001' where id='20000000-0000-0000-0000-000000000001';
select pg_temp.denied('insert into public.revision_history(entity_type,entity_id,user_id) values (''work'',''20000000-0000-0000-0000-000000000001'',''00000000-0000-0000-0000-000000000001'')');
select pg_temp.denied('insert into public.audit_logs(actor_user_id,action,entity_type,entity_id) values (auth.uid(),''work.update'',''work'',''20000000-0000-0000-0000-000000000001'')');
select pg_temp.assert_true((select count(*) from public.profiles)=1,'editor sees own full profile only');
reset role;
select pg_temp.assert_true((select count(*) from public.audit_logs where entity_id='20000000-0000-0000-0000-000000000001')=2,'one audit event per insert/update');
select pg_temp.assert_true((select updated_by from public.works where id='20000000-0000-0000-0000-000000000001')='00000000-0000-0000-0000-000000000002','row actor cannot be spoofed');
select pg_temp.assert_true(not exists(select 1 from public.revision_history where user_id <> '00000000-0000-0000-0000-000000000002'),'revision actor derives from session');

select set_config('request.jwt.claim.sub','',true);
set local role anon;
select pg_temp.assert_true((select count(id) from public.works)=1,'anonymous only sees published rows');
select pg_temp.assert_true((select count(w.id) from public.works w join public.composers c on c.id=w.composer_id where c.search_document like '%joao%villa%lobos%' and w.search_document like '%op%12%')=1,'public search joins and accent/alias normalization survive');
select pg_temp.denied('select subscriber_notes from public.works');
select pg_temp.denied('select editorial_notes from public.works');
select pg_temp.denied('select * from public.works');
select pg_temp.denied('select to_jsonb(w) from public.works w');
select pg_temp.denied('select id from public.works where editorial_notes is not null');
select pg_temp.denied('select notes from public.composers');
select pg_temp.denied('select public.get_work_details(''20000000-0000-0000-0000-000000000001'')');
reset role;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',true);
set local role authenticated;
select pg_temp.denied('select public.get_work_details(''20000000-0000-0000-0000-000000000001'')');
select pg_temp.denied('select public.get_editorial_record(''work'',''20000000-0000-0000-0000-000000000001'')');
select pg_temp.denied('select subscriber_notes from public.works');
select pg_temp.assert_true((select count(*) from public.profiles)=1,'regular user only reads own profile');
insert into public.favorites(user_id,work_id) values(auth.uid(),'20000000-0000-0000-0000-000000000001');
insert into public.repertoire_lists(id,user_id,name) values('30000000-0000-0000-0000-000000000001',auth.uid(),'Private repertoire');
insert into public.repertoire_list_items(list_id,work_id) values('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001');
insert into public.saved_searches(user_id,name,parameters_json) values(auth.uid(),'My search','{"titulo":"Canção"}');
select pg_temp.assert_true((select count(*) from public.favorites)=1,'own favorite insert/read works');
reset role;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000004',true);
set local role authenticated;
select pg_temp.assert_true((public.get_work_details('20000000-0000-0000-0000-000000000001')->>'subscriber_notes')='SUBSCRIBER','subscriber receives permitted notes');
select pg_temp.assert_true(not (public.get_work_details('20000000-0000-0000-0000-000000000001') ? 'editorial_notes'),'subscriber never receives editorial fields');
select pg_temp.assert_true(public.get_work_details('20000000-0000-0000-0000-000000000002') is null,'subscriber cannot read draft');
select pg_temp.assert_true((select count(*) from public.repertoire_list_items)=0,'cross-user lists remain private');
select pg_temp.denied('insert into public.repertoire_list_items(list_id,work_id) values(''30000000-0000-0000-0000-000000000001'',''20000000-0000-0000-0000-000000000001'')');
reset role;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',true);
set local role authenticated;
select pg_temp.assert_true((select count(*) from public.profiles)=1,'reviewer sees own profile only');
select pg_temp.assert_true(public.get_editorial_record('composer','10000000-0000-0000-0000-000000000001')->>'notes'='EDITOR-ONLY','reviewer can read editorial record');
select pg_temp.denied('insert into public.works(composer_id,canonical_title,display_title,slug) values(''10000000-0000-0000-0000-000000000001'',''forbidden'',''forbidden'',''forbidden'')');
reset role;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
set local role authenticated;
select pg_temp.assert_true((select count(*) from public.profiles)=5,'admin retains user management read');
insert into public.audit_logs(actor_user_id,action,entity_type,entity_id) values(auth.uid(),'user.created','profile','00000000-0000-0000-0000-000000000005');
select pg_temp.denied('delete from public.audit_logs');
select pg_temp.denied('update public.audit_logs set action=''fake''');
reset role;

-- A failing log write must abort the catalog write, rather than leave a saved but unlogged edit.
alter table public.audit_logs add constraint test_log_failure check(action <> 'work.update') not valid;
set local role authenticated;
do $$ begin
  begin
    update public.works set display_title='Must roll back' where id='20000000-0000-0000-0000-000000000001';
    raise exception 'FAIL: expected logging failure';
  exception when check_violation then null;
  end;
end $$;
select pg_temp.assert_true((select display_title from public.works where id='20000000-0000-0000-0000-000000000001')='Canção revisada','logging failure rolls back catalog edit');
reset role;
alter table public.audit_logs drop constraint test_log_failure;
select set_config('request.jwt.claim.sub','',true);
delete from auth.users where id='00000000-0000-0000-0000-000000000002';
select pg_temp.assert_true((select created_by is null from public.composers where id='10000000-0000-0000-0000-000000000001'),'Auth deletion clears composer creator without blocking FK cleanup');
select pg_temp.assert_true((select created_by is null and updated_by is null from public.works where id='20000000-0000-0000-0000-000000000001'),'Auth deletion clears work actor references');
rollback;
