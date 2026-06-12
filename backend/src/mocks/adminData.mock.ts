import type {
  AdminBurialCaseListItem,
  AdminBurialLocationListItem,
  AdminDataQualityResponse,
  AdminOverview,
  AdminQuadraListItem,
  AdminRemainsMovementListItem,
  AdminSectorListItem,
  BurialLocationType,
  Cemetery,
  MovementType,
  RecordStatus
} from '@memoriar/shared';

const nowIso = new Date().toISOString();

export const MOCK_ADMIN_IDS = {
  cemeteryId: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',

  sectorS1Id: 'd3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12',
  sectorS2Id: '4d8b20d0-6a15-4f2f-9ff4-2a0e2dc1a1a5',

  quadraQ1Id: '2b34743c-3a72-4ef9-a9bb-8aafac8ab5d1',
  quadraQ2Id: '6fa7a3b1-42a6-4b19-a83b-0df0d6ce8c36',
  quadraQ5Id: 'f63b9cc3-073b-4f5f-bd5c-3f4e0f59c2f0',

  mapNodeQ1Id: '3b8dbd69-e31a-4d29-9256-4c5c0d9e9b51',
  mapNodeQ2Id: 'e6f0c1a2-7d11-4e1a-84d0-83d598fb1f4b',
  mapNodeQ5Id: 'c2a2d10e-5dbd-4d5c-9a2b-055c7b60b6c8',

  locMariaId: '3e7c2f22-53c7-4c91-8cda-12b8a3c9a1d8',
  locAnaId: 'f1b6e2f4-0d44-4b5b-9b7e-75f6bb77fd2a',
  locPauloId: '1fd1a1e2-6a7f-49d8-9fd4-1d73efab2cc4',
  locJoaoId: '6e60e57e-6a8b-4d39-a0c2-14db9c214a1a',

  caseMariaId: '1a3b5c0d-2a54-4b62-9ae7-1b61b4f5b9aa',
  caseJoseId: '5f3b8f5e-9e09-46b4-8bb9-6dc2a2e043a1',
  caseAnaId: '9d2d4a65-6e1e-4c0c-88d6-67c0e4d09021',
  casePauloId: 'd7d0c770-1f6b-4bda-87f8-0efaa3a2f7f9',
  caseJoaoId: '84f0b6e3-4a2f-4d78-9a28-9b5c4d3f42d1',
  caseInReviewId: '0a4d39a6-f9c6-4b42-8b3c-c6ac7b52b3ce'
} as const;

export const MOCK_ADMIN_CEMETERIES: Cemetery[] = [
  {
    id: MOCK_ADMIN_IDS.cemeteryId,
    name: 'Cemitério Municipal Central',
    address: 'Av. Principal, 1000',
    status: 'published',
    logical_map_note: 'Mapa lógico ilustrativo de referência interna. Não representa geolocalização.',
    created_at: nowIso,
    updated_at: nowIso
  }
];

export const MOCK_ADMIN_SECTORS: AdminSectorListItem[] = [
  {
    id: MOCK_ADMIN_IDS.sectorS1Id,
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    code: 'S1',
    name: 'Setor 1',
    status: 'published',
    sort_order: 1,
    created_at: nowIso,
    updated_at: nowIso,
    cemetery_name: 'Cemitério Municipal Central'
  },
  {
    id: MOCK_ADMIN_IDS.sectorS2Id,
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    code: 'S2',
    name: 'Setor 2',
    status: 'published',
    sort_order: 2,
    created_at: nowIso,
    updated_at: nowIso,
    cemetery_name: 'Cemitério Municipal Central'
  }
];

export const MOCK_ADMIN_QUADRAS: AdminQuadraListItem[] = [
  {
    id: MOCK_ADMIN_IDS.quadraQ1Id,
    sector_id: MOCK_ADMIN_IDS.sectorS1Id,
    code: 'Q1',
    name: 'Quadra 1',
    status: 'published',
    sort_order: 1,
    created_at: nowIso,
    updated_at: nowIso,
    sector_code: 'S1',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    cemetery_name: 'Cemitério Municipal Central'
  },
  {
    id: MOCK_ADMIN_IDS.quadraQ2Id,
    sector_id: MOCK_ADMIN_IDS.sectorS1Id,
    code: 'Q2',
    name: 'Quadra 2',
    status: 'published',
    sort_order: 2,
    created_at: nowIso,
    updated_at: nowIso,
    sector_code: 'S1',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    cemetery_name: 'Cemitério Municipal Central'
  },
  {
    id: MOCK_ADMIN_IDS.quadraQ5Id,
    sector_id: MOCK_ADMIN_IDS.sectorS2Id,
    code: 'Q5',
    name: 'Quadra 5',
    status: 'published',
    sort_order: 1,
    created_at: nowIso,
    updated_at: nowIso,
    sector_code: 'S2',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    cemetery_name: 'Cemitério Municipal Central'
  }
];

export const MOCK_ADMIN_BURIAL_LOCATION_TYPES: BurialLocationType[] = [
  {
    id: 'a62d2f9c-6d20-48f1-a896-67b8c1f15ca7',
    code: 'JZ',
    label: 'Jazigo',
    kind: 'vault',
    default_capacity: 4,
    allows_multiple: true,
    created_at: nowIso,
    updated_at: nowIso
  },
  {
    id: 'd4d07d6d-443d-44c4-86b7-5f1d26a3a387',
    code: 'GV',
    label: 'Gaveta',
    kind: 'drawer',
    default_capacity: 1,
    allows_multiple: false,
    created_at: nowIso,
    updated_at: nowIso
  },
  {
    id: 'c0b8d5f7-5af6-4b7e-a6f6-0701e0cf1d80',
    code: 'NC',
    label: 'Nicho',
    kind: 'niche',
    default_capacity: 1,
    allows_multiple: false,
    created_at: nowIso,
    updated_at: nowIso
  }
];

function typeByCode(code: 'JZ' | 'GV' | 'NC') {
  return MOCK_ADMIN_BURIAL_LOCATION_TYPES.find((t) => t.code === code)!;
}

export const MOCK_ADMIN_BURIAL_LOCATIONS: AdminBurialLocationListItem[] = [
  {
    id: MOCK_ADMIN_IDS.locMariaId,
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    sector_id: MOCK_ADMIN_IDS.sectorS1Id,
    quadra_id: MOCK_ADMIN_IDS.quadraQ1Id,
    alley_id: null,
    type_id: typeByCode('JZ').id,
    parent_location_id: null,
    map_node_id: MOCK_ADMIN_IDS.mapNodeQ1Id,
    code: 'Q1-JZ-12',
    label: 'Jazigo 12',
    location_text:
      'Entre pelo portão principal, siga em direção à capela e vire à direita. O Jazigo 12 fica na Quadra 1, próximo ao corredor lateral.',
    status: 'published',
    created_at: nowIso,
    updated_at: nowIso,
    cemetery_name: 'Cemitério Municipal Central',
    sector_code: 'S1',
    sector_name: 'Setor 1',
    quadra_code: 'Q1',
    quadra_name: 'Quadra 1',
    type_code: 'JZ',
    type_label: 'Jazigo',
    kind: typeByCode('JZ').kind,
    default_capacity: typeByCode('JZ').default_capacity,
    allows_multiple: typeByCode('JZ').allows_multiple
  },
  {
    id: MOCK_ADMIN_IDS.locAnaId,
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    sector_id: MOCK_ADMIN_IDS.sectorS1Id,
    quadra_id: MOCK_ADMIN_IDS.quadraQ1Id,
    alley_id: null,
    type_id: typeByCode('GV').id,
    parent_location_id: null,
    map_node_id: MOCK_ADMIN_IDS.mapNodeQ1Id,
    code: 'Q1-GV-04',
    label: 'Gaveta 4',
    location_text:
      'Siga pela alameda principal até a Capela. A Quadra 1 fica à direita; a Gaveta 4 está no conjunto de gavetas próximo ao muro.',
    status: 'published',
    created_at: nowIso,
    updated_at: nowIso,
    cemetery_name: 'Cemitério Municipal Central',
    sector_code: 'S1',
    sector_name: 'Setor 1',
    quadra_code: 'Q1',
    quadra_name: 'Quadra 1',
    type_code: 'GV',
    type_label: 'Gaveta',
    kind: typeByCode('GV').kind,
    default_capacity: typeByCode('GV').default_capacity,
    allows_multiple: typeByCode('GV').allows_multiple
  },
  {
    id: MOCK_ADMIN_IDS.locPauloId,
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    sector_id: MOCK_ADMIN_IDS.sectorS1Id,
    quadra_id: MOCK_ADMIN_IDS.quadraQ2Id,
    alley_id: null,
    type_id: typeByCode('JZ').id,
    parent_location_id: null,
    map_node_id: MOCK_ADMIN_IDS.mapNodeQ2Id,
    code: 'Q2-JZ-03',
    label: 'Jazigo 3',
    location_text:
      'Após o portão principal, siga reto até o final da alameda. A Quadra 2 fica logo após a Capela; o Jazigo 3 está na fileira central.',
    status: 'published',
    created_at: nowIso,
    updated_at: nowIso,
    cemetery_name: 'Cemitério Municipal Central',
    sector_code: 'S1',
    sector_name: 'Setor 1',
    quadra_code: 'Q2',
    quadra_name: 'Quadra 2',
    type_code: 'JZ',
    type_label: 'Jazigo',
    kind: typeByCode('JZ').kind,
    default_capacity: typeByCode('JZ').default_capacity,
    allows_multiple: typeByCode('JZ').allows_multiple
  },
  {
    id: MOCK_ADMIN_IDS.locJoaoId,
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    sector_id: MOCK_ADMIN_IDS.sectorS2Id,
    quadra_id: MOCK_ADMIN_IDS.quadraQ5Id,
    alley_id: null,
    type_id: typeByCode('NC').id,
    parent_location_id: null,
    map_node_id: MOCK_ADMIN_IDS.mapNodeQ5Id,
    code: 'Q5-NC-18',
    label: 'Nicho 18',
    location_text:
      'Siga pela alameda lateral até a área dos nichos. A Quadra 5 fica do lado oposto à Capela; o Nicho 18 está na segunda coluna.',
    status: 'published',
    created_at: nowIso,
    updated_at: nowIso,
    cemetery_name: 'Cemitério Municipal Central',
    sector_code: 'S2',
    sector_name: 'Setor 2',
    quadra_code: 'Q5',
    quadra_name: 'Quadra 5',
    type_code: 'NC',
    type_label: 'Nicho',
    kind: typeByCode('NC').kind,
    default_capacity: typeByCode('NC').default_capacity,
    allows_multiple: typeByCode('NC').allows_multiple
  },
  {
    id: '0f0f71c8-8341-4c4f-b9f6-4e5b0b2e3d3d',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    sector_id: MOCK_ADMIN_IDS.sectorS2Id,
    quadra_id: null,
    alley_id: null,
    type_id: typeByCode('JZ').id,
    parent_location_id: null,
    map_node_id: null,
    code: 'S2-JZ-SEM-MAPA',
    label: 'Jazigo (sem nó de mapa)',
    location_text: 'Registro legado: localização textual existente, mapa lógico pendente de cadastro.',
    status: 'in_review',
    created_at: nowIso,
    updated_at: nowIso,
    cemetery_name: 'Cemitério Municipal Central',
    sector_code: 'S2',
    sector_name: 'Setor 2',
    quadra_code: null,
    quadra_name: null,
    type_code: 'JZ',
    type_label: 'Jazigo',
    kind: typeByCode('JZ').kind,
    default_capacity: typeByCode('JZ').default_capacity,
    allows_multiple: typeByCode('JZ').allows_multiple
  }
];

export const MOCK_ADMIN_BURIAL_CASES: AdminBurialCaseListItem[] = [
  {
    burial_case_id: MOCK_ADMIN_IDS.caseMariaId,
    deceased_name: 'Maria Aparecida de Souza',
    public_reference: 'MEM-0001',
    status: 'published',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: MOCK_ADMIN_IDS.locMariaId,
    location_code: 'Q1-JZ-12',
    location_label: 'Jazigo 12',
    sector_code: 'S1',
    quadra_code: 'Q1',
    updated_at: nowIso
  },
  {
    burial_case_id: MOCK_ADMIN_IDS.caseAnaId,
    deceased_name: 'Ana Lúcia Ferreira',
    public_reference: 'MEM-0003',
    status: 'published',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: MOCK_ADMIN_IDS.locAnaId,
    location_code: 'Q1-GV-04',
    location_label: 'Gaveta 4',
    sector_code: 'S1',
    quadra_code: 'Q1',
    updated_at: nowIso
  },
  {
    burial_case_id: MOCK_ADMIN_IDS.casePauloId,
    deceased_name: 'Paulo Henrique Nascimento',
    public_reference: 'MEM-0004',
    status: 'published',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: MOCK_ADMIN_IDS.locPauloId,
    location_code: 'Q2-JZ-03',
    location_label: 'Jazigo 3',
    sector_code: 'S1',
    quadra_code: 'Q2',
    updated_at: nowIso
  },
  {
    burial_case_id: MOCK_ADMIN_IDS.caseJoaoId,
    deceased_name: 'João Batista Oliveira',
    public_reference: 'MEM-0005',
    status: 'published',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: MOCK_ADMIN_IDS.locJoaoId,
    location_code: 'Q5-NC-18',
    location_label: 'Nicho 18',
    sector_code: 'S2',
    quadra_code: 'Q5',
    updated_at: nowIso
  },
  {
    burial_case_id: MOCK_ADMIN_IDS.caseJoseId,
    deceased_name: 'José Carlos Almeida',
    public_reference: 'MEM-0002',
    status: 'not_found_precisely',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: null,
    location_code: null,
    location_label: null,
    sector_code: null,
    quadra_code: null,
    updated_at: nowIso
  },
  {
    burial_case_id: MOCK_ADMIN_IDS.caseInReviewId,
    deceased_name: 'Helena Martins Ribeiro',
    public_reference: null,
    status: 'in_review',
    cemetery_id: MOCK_ADMIN_IDS.cemeteryId,
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: null,
    location_code: null,
    location_label: null,
    sector_code: 'S2',
    quadra_code: null,
    updated_at: nowIso
  }
];

function movement(
  data: Omit<AdminRemainsMovementListItem, 'id'> & { id: string; movement_type: MovementType }
) {
  return data;
}

export const MOCK_ADMIN_REMAINS_MOVEMENTS: AdminRemainsMovementListItem[] = [
  movement({
    id: 'f2f60f55-8015-4db1-9fdf-bd68f0f6d3b1',
    movement_type: 'interment',
    occurred_on: '2020-10-22',
    burial_case_id: MOCK_ADMIN_IDS.caseMariaId,
    deceased_name: 'Maria Aparecida de Souza',
    from_location_code: null,
    to_location_code: 'Q1-JZ-12',
    is_confirmed: true,
    notes: 'Sepultamento registrado e conferido.'
  }),
  movement({
    id: 'baee7052-7ea6-4c0b-9b6b-53c7352f2d2b',
    movement_type: 'interment',
    occurred_on: '2019-03-11',
    burial_case_id: MOCK_ADMIN_IDS.caseAnaId,
    deceased_name: 'Ana Lúcia Ferreira',
    from_location_code: null,
    to_location_code: 'Q1-GV-04',
    is_confirmed: true,
    notes: 'Registro de sepultamento.'
  }),
  movement({
    id: 'bb8d9f0e-4278-4a11-b144-6dce4c2b49c9',
    movement_type: 'interment',
    occurred_on: '2021-08-31',
    burial_case_id: MOCK_ADMIN_IDS.casePauloId,
    deceased_name: 'Paulo Henrique Nascimento',
    from_location_code: null,
    to_location_code: 'Q2-JZ-03',
    is_confirmed: true,
    notes: 'Sepultamento.'
  }),
  movement({
    id: '0bcd4d56-9f44-4cc2-9d11-1dfdc34fbd34',
    movement_type: 'transfer',
    occurred_on: '2017-01-20',
    burial_case_id: MOCK_ADMIN_IDS.caseJoaoId,
    deceased_name: 'João Batista Oliveira',
    from_location_code: 'S2-JZ-SEM-MAPA',
    to_location_code: 'Q5-NC-18',
    is_confirmed: false,
    notes: 'Transferência informada em documento antigo (pendente de validação).'
  })
];

export function mockAdminOverview(): AdminOverview {
  const cemeteries_count = MOCK_ADMIN_CEMETERIES.length;
  const burial_locations_count = MOCK_ADMIN_BURIAL_LOCATIONS.length;

  const cases = MOCK_ADMIN_BURIAL_CASES;
  const countBy = (s: RecordStatus) => cases.filter((c) => c.status === s).length;
  return {
    cemeteries_count,
    burial_locations_count,
    burial_cases_published_count: countBy('published'),
    burial_cases_in_review_count: countBy('in_review'),
    burial_cases_not_found_precisely_count: countBy('not_found_precisely')
  };
}

export function mockAdminDataQuality(): AdminDataQualityResponse {
  const issues = [
    {
      id: '8ce6de5b-f23a-469b-92be-6b85e9a0b3e1',
      type: 'case_without_precise_location',
      severity: 'warning',
      title: 'Caso sem localização precisa',
      description: 'O caso possui indícios, mas não há quadra/local confirmados.',
      entity_kind: 'burial_case',
      entity_id: MOCK_ADMIN_IDS.caseJoseId
    },
    {
      id: '3a44ac1b-3a4f-4cda-9f57-ef6b96b8fdf0',
      type: 'case_in_review',
      severity: 'info',
      title: 'Caso em revisão',
      description: 'Registro aguardando validação antes de publicação.',
      entity_kind: 'burial_case',
      entity_id: MOCK_ADMIN_IDS.caseInReviewId
    },
    {
      id: 'edcdb1b1-38a9-4c86-b2d2-3aabf3dbb241',
      type: 'location_without_map_node',
      severity: 'critical',
      title: 'Local físico sem nó do mapa lógico',
      description: 'O local existe no cadastro, mas ainda não foi vinculado a um nó do mapa lógico.',
      entity_kind: 'burial_location',
      entity_id: '0f0f71c8-8341-4c4f-b9f6-4e5b0b2e3d3d'
    },
    {
      id: '5d4a7e4b-1d2f-4c41-8cc8-e5b05e58e6c9',
      type: 'legacy_record_pending_validation',
      severity: 'warning',
      title: 'Movimentação pendente de validação',
      description: 'Existe movimentação registrada sem confirmação.',
      entity_kind: 'burial_case',
      entity_id: MOCK_ADMIN_IDS.caseJoaoId
    }
  ] as const;

  const summary = issues.reduce(
    (acc, i) => {
      acc.issues_total += 1;
      acc[i.severity] += 1;
      return acc;
    },
    { issues_total: 0, critical: 0, warning: 0, info: 0 }
  );

  return { issues: [...issues], summary };
}

