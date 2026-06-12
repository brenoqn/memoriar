begin;

insert into app_roles (id, key, name)
values
  ('00000000-0000-0000-0000-000000000011', 'admin', 'Administrador'),
  ('00000000-0000-0000-0000-000000000012', 'editor', 'Editor'),
  ('00000000-0000-0000-0000-000000000013', 'viewer', 'Leitor')
on conflict (id) do nothing;

insert into cemeteries (id, name, address, status, logical_map_note)
values (
  'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
  'Cemitério Municipal Central',
  'Av. Principal, 1000',
  'published',
  'Mapa lógico ilustrativo de referência interna. Não representa geolocalização.'
)
on conflict (id) do nothing;

insert into sectors (id, cemetery_id, code, name, status, sort_order)
values
  ('d3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12', 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3', 'S1', 'Setor 1', 'published', 1),
  ('4d8b20d0-6a15-4f2f-9ff4-2a0e2dc1a1a5', 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3', 'S2', 'Setor 2', 'published', 2)
on conflict (id) do nothing;

insert into quadras (id, sector_id, code, name, status, sort_order)
values
  ('2b34743c-3a72-4ef9-a9bb-8aafac8ab5d1', 'd3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12', 'Q1', 'Quadra 1', 'published', 1),
  ('6fa7a3b1-42a6-4b19-a83b-0df0d6ce8c36', 'd3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12', 'Q2', 'Quadra 2', 'published', 2),
  ('f63b9cc3-073b-4f5f-bd5c-3f4e0f59c2f0', '4d8b20d0-6a15-4f2f-9ff4-2a0e2dc1a1a5', 'Q5', 'Quadra 5', 'published', 1)
on conflict (id) do nothing;

insert into burial_location_types (id, code, label, kind, default_capacity, allows_multiple)
values
  ('a62d2f9c-6d20-48f1-a896-67b8c1f15ca7', 'JZ', 'Jazigo', 'vault', 4, true),
  ('d4d07d6d-443d-44c4-86b7-5f1d26a3a387', 'GV', 'Gaveta', 'drawer', 1, false),
  ('e4d07d6d-443d-44c4-86b7-5f1d26a3a388', 'OS', 'Ossuario', 'ossuary', 12, true),
  ('c0b8d5f7-5af6-4b7e-a6f6-0701e0cf1d80', 'NC', 'Nicho', 'niche', 1, false)
on conflict (id) do nothing;

insert into map_nodes (id, cemetery_id, node_type, x, y, w, h, label, status)
values
  ('3b8dbd69-e31a-4d29-9256-4c5c0d9e9b51', 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3', 'quadra', 40, 80, 240, 160, 'Quadra 1', 'published'),
  ('e6f0c1a2-7d11-4e1a-84d0-83d598fb1f4b', 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3', 'quadra', 40, 260, 240, 160, 'Quadra 2', 'published'),
  ('c2a2d10e-5dbd-4d5c-9a2b-055c7b60b6c8', 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3', 'quadra', 300, 260, 240, 160, 'Quadra 5', 'published'),
  ('7b9a0a58-9d1a-4f2d-8d4c-1fef1d7e3b32', 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3', 'referencia', 320, 80, 180, 80, 'Capela', 'published')
on conflict (id) do nothing;

insert into burial_locations (
  id,
  cemetery_id,
  sector_id,
  quadra_id,
  alley_id,
  type_id,
  parent_location_id,
  map_node_id,
  code,
  label,
  location_text,
  status
)
values
  (
    '3e7c2f22-53c7-4c91-8cda-12b8a3c9a1d8',
    'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    'd3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12',
    '2b34743c-3a72-4ef9-a9bb-8aafac8ab5d1',
    null,
    'a62d2f9c-6d20-48f1-a896-67b8c1f15ca7',
    null,
    '3b8dbd69-e31a-4d29-9256-4c5c0d9e9b51',
    'Q1-JZ-12',
    'Jazigo 12',
    'Entre pelo portão principal, siga em direção à capela e vire à direita. O Jazigo 12 fica na Quadra 1, próximo ao corredor lateral.',
    'published'
  ),
  (
    'f1b6e2f4-0d44-4b5b-9b7e-75f6bb77fd2a',
    'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    'd3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12',
    '2b34743c-3a72-4ef9-a9bb-8aafac8ab5d1',
    null,
    'a62d2f9c-6d20-48f1-a896-67b8c1f15ca7',
    null,
    '3b8dbd69-e31a-4d29-9256-4c5c0d9e9b51',
    'Q1-JZ-18',
    'Jazigo 18',
    'Entre pelo portão principal, siga em direção à capela e mantenha-se à direita. O Jazigo 18 fica ao fundo da Quadra 1.',
    'published'
  ),
  (
    '1fd1a1e2-6a7f-49d8-9fd4-1d73efab2cc4',
    'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    'd3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12',
    '6fa7a3b1-42a6-4b19-a83b-0df0d6ce8c36',
    null,
    'd4d07d6d-443d-44c4-86b7-5f1d26a3a387',
    null,
    'e6f0c1a2-7d11-4e1a-84d0-83d598fb1f4b',
    'Q2-GV-04',
    'Gaveta 4',
    'Após a capela, siga para a Quadra 2. A Gaveta 4 está no bloco lateral esquerdo.',
    'published'
  ),
  (
    '6e60e57e-6a8b-4d39-a0c2-14db9c214a1a',
    'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    '4d8b20d0-6a15-4f2f-9ff4-2a0e2dc1a1a5',
    'f63b9cc3-073b-4f5f-bd5c-3f4e0f59c2f0',
    null,
    'e4d07d6d-443d-44c4-86b7-5f1d26a3a388',
    null,
    'c2a2d10e-5dbd-4d5c-9a2b-055c7b60b6c8',
    'Q5-OS-02',
    'Ossuario 2',
    'Siga pela alameda lateral até a Quadra 5. O Ossuario 2 fica próximo ao muro de fundos.',
    'published'
  )
on conflict (id) do nothing;

insert into deceased_persons (id, full_name, birth_date, death_date, status)
values
  ('11111111-aaaa-4b62-9ae7-1b61b4f5b9aa', 'Maria Aparecida de Souza', '1948-04-09', '2020-10-21', 'published'),
  ('22222222-bbbb-46b4-8bb9-6dc2a2e043a1', 'João Batista Ferreira', '1940-05-23', '2016-12-04', 'published'),
  ('33333333-cccc-4c0c-88d6-67c0e4d09021', 'Ana Clara Martins', '1956-02-18', '2019-03-10', 'published'),
  ('44444444-dddd-4bda-87f8-0efaa3a2f7f9', 'Pedro Henrique Almeida', '1971-11-02', '2021-08-30', 'published'),
  ('55555555-eeee-4b42-8b3c-c6ac7b52b3ce', 'José Carlos Almeida', '1939-01-13', '2012-06-02', 'published')
on conflict (id) do nothing;

insert into burial_cases (
  id,
  cemetery_id,
  deceased_person_id,
  public_reference,
  status,
  approx_location_text,
  internal_notes
)
values
  (
    '1a3b5c0d-2a54-4b62-9ae7-1b61b4f5b9aa',
    'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    '11111111-aaaa-4b62-9ae7-1b61b4f5b9aa',
    'MEM-0001',
    'published',
    null,
    'Caso público de demonstração para Maria.'
  ),
  (
    '84f0b6e3-4a2f-4d78-9a28-9b5c4d3f42d1',
    'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    '22222222-bbbb-46b4-8bb9-6dc2a2e043a1',
    'MEM-0005',
    'published',
    null,
    'Caso público de demonstração para João.'
  ),
  (
    '9d2d4a65-6e1e-4c0c-88d6-67c0e4d09021',
    'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    '33333333-cccc-4c0c-88d6-67c0e4d09021',
    'MEM-0003',
    'published',
    null,
    'Caso público de demonstração para Ana.'
  ),
  (
    '0a4d39a6-f9c6-4b42-8b3c-c6ac7b52b3ce',
    'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    '44444444-dddd-4bda-87f8-0efaa3a2f7f9',
    'MEM-0004',
    'in_review',
    'Cadastro em revisão pela equipe administrativa.',
    'Caso ainda em conferência documental.'
  ),
  (
    '5f3b8f5e-9e09-46b4-8bb9-6dc2a2e043a1',
    'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    '55555555-eeee-4b42-8b3c-c6ac7b52b3ce',
    'MEM-0002',
    'not_found_precisely',
    'Indícios: Setor 2, próximo à capela. Localização exata pendente de revisão.',
    'Sem localização confirmada para exposição pública.'
  )
on conflict (id) do nothing;

insert into remains_movements (
  id,
  burial_case_id,
  movement_type,
  occurred_on,
  from_location_id,
  to_location_id,
  is_confirmed,
  notes
)
values
  (
    'f2f60f55-8015-4db1-9fdf-bd68f0f6d3b1',
    '1a3b5c0d-2a54-4b62-9ae7-1b61b4f5b9aa',
    'interment',
    '2020-10-22',
    null,
    '3e7c2f22-53c7-4c91-8cda-12b8a3c9a1d8',
    true,
    'Sepultamento inicial de Maria Aparecida de Souza.'
  ),
  (
    'baee7052-7ea6-4c0b-9b6b-53c7352f2d2b',
    '84f0b6e3-4a2f-4d78-9a28-9b5c4d3f42d1',
    'interment',
    '2016-12-05',
    null,
    '6e60e57e-6a8b-4d39-a0c2-14db9c214a1a',
    true,
    'Destinação para o ossuario da Quadra 5.'
  ),
  (
    'bb8d9f0e-4278-4a11-b144-6dce4c2b49c9',
    '9d2d4a65-6e1e-4c0c-88d6-67c0e4d09021',
    'interment',
    '2019-03-11',
    null,
    'f1b6e2f4-0d44-4b5b-9b7e-75f6bb77fd2a',
    true,
    'Sepultamento inicial de Ana Clara Martins.'
  ),
  (
    '0bcd4d56-9f44-4cc2-9d11-1dfdc34fbd34',
    '9d2d4a65-6e1e-4c0c-88d6-67c0e4d09021',
    'transfer',
    '2021-05-18',
    'f1b6e2f4-0d44-4b5b-9b7e-75f6bb77fd2a',
    '1fd1a1e2-6a7f-49d8-9fd4-1d73efab2cc4',
    true,
    'Transferência confirmada para a Gaveta 4 da Quadra 2.'
  ),
  (
    '8ce6de5b-f23a-469b-92be-6b85e9a0b3e1',
    '0a4d39a6-f9c6-4b42-8b3c-c6ac7b52b3ce',
    'interment',
    '2021-09-01',
    null,
    '1fd1a1e2-6a7f-49d8-9fd4-1d73efab2cc4',
    false,
    'Movimentação ainda pendente de confirmação.'
  )
on conflict (id) do nothing;

commit;
