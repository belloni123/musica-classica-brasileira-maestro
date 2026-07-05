insert into public.role_definitions (role, label, description)
values
  ('user', 'Usuário', 'Conta autenticada sem acesso completo ao catálogo.'),
  ('subscriber_individual', 'Assinante individual', 'Acesso individual completo ao catálogo publicado.'),
  ('subscriber_professional', 'Assinante profissional', 'Acesso completo e recursos profissionais futuros.'),
  ('institution_user', 'Usuário institucional', 'Membro de uma organização assinante.'),
  ('institution_admin', 'Administrador institucional', 'Gestor de membros de uma organização assinante.'),
  ('editor', 'Editor musicológico', 'Pode cadastrar e editar dados editoriais.'),
  ('reviewer', 'Revisor', 'Pode revisar dados e acessar itens em revisão.'),
  ('admin', 'Administrador geral', 'Pode gerenciar dados, usuários e configurações.')
on conflict (role) do update
set label = excluded.label,
    description = excluded.description;

insert into public.instrument_families (name, slug, display_order)
values
  ('Madeiras', 'madeiras', 10),
  ('Metais', 'metais', 20),
  ('Cordas', 'cordas', 30),
  ('Percussão', 'percussao', 40),
  ('Teclados', 'teclados', 50),
  ('Harpa', 'harpa', 60),
  ('Vozes', 'vozes', 70),
  ('Coro', 'coro', 80),
  ('Eletrônica', 'eletronica', 90),
  ('Instrumentos brasileiros', 'instrumentos-brasileiros', 100),
  ('Outros', 'outros', 110)
on conflict (slug) do update
set name = excluded.name,
    display_order = excluded.display_order;

insert into public.instruments (name, plural_name, abbreviation, family, family_id, is_brazilian_instrument, display_order)
select seed.name, seed.plural_name, seed.abbreviation, seed.family, families.id, seed.is_brazilian_instrument, seed.display_order
from (
  values
    ('Flauta', 'Flautas', 'fl', 'Madeiras', false, 10),
    ('Oboé', 'Oboés', 'ob', 'Madeiras', false, 20),
    ('Clarinete', 'Clarinetes', 'cl', 'Madeiras', false, 30),
    ('Fagote', 'Fagotes', 'fg', 'Madeiras', false, 40),
    ('Trompa', 'Trompas', 'tpa', 'Metais', false, 50),
    ('Trompete', 'Trompetes', 'tpt', 'Metais', false, 60),
    ('Trombone', 'Trombones', 'tbn', 'Metais', false, 70),
    ('Tuba', 'Tubas', 'tb', 'Metais', false, 80),
    ('Violino', 'Violinos', 'vn', 'Cordas', false, 90),
    ('Viola', 'Violas', 'va', 'Cordas', false, 100),
    ('Violoncelo', 'Violoncelos', 'vc', 'Cordas', false, 110),
    ('Contrabaixo', 'Contrabaixos', 'cb', 'Cordas', false, 120),
    ('Tímpanos', 'Tímpanos', 'timp', 'Percussão', false, 130),
    ('Percussão', 'Percussões', 'perc', 'Percussão', false, 140),
    ('Piano', 'Pianos', 'pn', 'Teclados', false, 150),
    ('Harpa', 'Harpas', 'hp', 'Harpa', false, 160),
    ('Soprano', 'Sopranos', 'sop', 'Vozes', false, 170),
    ('Contralto', 'Contraltos', 'ct', 'Vozes', false, 180),
    ('Tenor', 'Tenores', 'ten', 'Vozes', false, 190),
    ('Baixo', 'Baixos', 'bx', 'Vozes', false, 200),
    ('Coro SATB', 'Coros SATB', 'satb', 'Coro', false, 210),
    ('Eletrônica', 'Eletrônicas', 'elec', 'Eletrônica', false, 220),
    ('Violão', 'Violões', 'vl', 'Instrumentos brasileiros', true, 230),
    ('Viola caipira', 'Violas caipiras', 'vcaip', 'Instrumentos brasileiros', true, 240),
    ('Cavaquinho', 'Cavaquinhos', 'cvq', 'Instrumentos brasileiros', true, 250),
    ('Bandolim', 'Bandolins', 'bdm', 'Instrumentos brasileiros', true, 260),
    ('Acordeon', 'Acordeons', 'acd', 'Instrumentos brasileiros', true, 270),
    ('Berimbau', 'Berimbaus', 'ber', 'Instrumentos brasileiros', true, 280),
    ('Pandeiro', 'Pandeiros', 'pnd', 'Instrumentos brasileiros', true, 290),
    ('Atabaque', 'Atabaques', 'atb', 'Instrumentos brasileiros', true, 300),
    ('Agogô', 'Agogôs', 'agg', 'Instrumentos brasileiros', true, 310),
    ('Cuíca', 'Cuícas', 'cui', 'Instrumentos brasileiros', true, 320),
    ('Reco-reco', 'Reco-recos', 'rec', 'Instrumentos brasileiros', true, 330),
    ('Ganzá', 'Ganzás', 'gnz', 'Instrumentos brasileiros', true, 340),
    ('Alfaia', 'Alfaias', 'alf', 'Instrumentos brasileiros', true, 350),
    ('Zabumba', 'Zabumbas', 'zab', 'Instrumentos brasileiros', true, 360),
    ('Rabeca', 'Rabecas', 'rab', 'Instrumentos brasileiros', true, 370)
) as seed(name, plural_name, abbreviation, family, is_brazilian_instrument, display_order)
join public.instrument_families families on families.name = seed.family
on conflict (name) do update
set plural_name = excluded.plural_name,
    abbreviation = excluded.abbreviation,
    family = excluded.family,
    family_id = excluded.family_id,
    is_brazilian_instrument = excluded.is_brazilian_instrument,
    display_order = excluded.display_order;

insert into public.taxonomies (name, type, slug, description)
values
  ('Orquestra sinfônica', 'formation', 'orquestra-sinfonica', 'Obras para formação sinfônica.'),
  ('Orquestra de cordas', 'formation', 'orquestra-de-cordas', 'Obras para cordas sem sopros.'),
  ('Orquestra jovem', 'pedagogical_profile', 'orquestra-jovem', 'Repertório adequado a orquestras jovens.'),
  ('Mulheres compositoras', 'curatorial_identity', 'mulheres-compositoras', 'Marcador curatorial para compositoras.'),
  ('Compositores negros', 'curatorial_identity', 'compositores-negros', 'Marcador curatorial validado editorialmente.'),
  ('Instrumentos brasileiros', 'brazilian_instrument', 'instrumentos-brasileiros', 'Obras com instrumentos brasileiros ou populares.')
on conflict (slug) do update
set name = excluded.name,
    type = excluded.type,
    description = excluded.description;
