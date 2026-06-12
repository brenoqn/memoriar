import type { PublicDeceasedDetail, PublicDeceasedSearchItem } from '@memoriar/shared';

const nowIso = new Date().toISOString();

const ITEMS: PublicDeceasedSearchItem[] = [
  {
    burial_case_id: '1a3b5c0d-2a54-4b62-9ae7-1b61b4f5b9aa',
    public_reference: 'MEM-0001',
    deceased_name: 'Maria Aparecida de Souza',
    birth_date: '1948-04-09',
    death_date: '2020-10-21',
    cemetery_id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: '3e7c2f22-53c7-4c91-8cda-12b8a3c9a1d8',
    location_code: 'Q1-JZ-12',
    location_label: 'Jazigo 12',
    location_text:
      'Entre pelo portão principal, siga em direção à capela e vire à direita. O Jazigo 12 fica na Quadra 1, próximo ao corredor lateral.',
    sector_id: 'd3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12',
    sector_code: 'S1',
    sector_name: 'Setor 1',
    quadra_id: '2b34743c-3a72-4ef9-a9bb-8aafac8ab5d1',
    quadra_code: 'Q1',
    quadra_name: 'Quadra 1',
    map_node_id: '3b8dbd69-e31a-4d29-9256-4c5c0d9e9b51',
    map_x: 40,
    map_y: 80,
    map_w: 240,
    map_h: 160,
    status: 'published',
    approx_location_text: null,
    updated_at: nowIso
  },
  {
    burial_case_id: '9d2d4a65-6e1e-4c0c-88d6-67c0e4d09021',
    public_reference: 'MEM-0003',
    deceased_name: 'Ana Lúcia Ferreira',
    birth_date: '1956-02-18',
    death_date: '2019-03-10',
    cemetery_id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: 'f1b6e2f4-0d44-4b5b-9b7e-75f6bb77fd2a',
    location_code: 'Q1-GV-04',
    location_label: 'Gaveta 4',
    location_text:
      'Siga pela alameda principal até a Capela. A Quadra 1 fica à direita; a Gaveta 4 está no conjunto de gavetas próximo ao muro.',
    sector_id: 'd3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12',
    sector_code: 'S1',
    sector_name: 'Setor 1',
    quadra_id: '2b34743c-3a72-4ef9-a9bb-8aafac8ab5d1',
    quadra_code: 'Q1',
    quadra_name: 'Quadra 1',
    map_node_id: '3b8dbd69-e31a-4d29-9256-4c5c0d9e9b51',
    map_x: 40,
    map_y: 80,
    map_w: 240,
    map_h: 160,
    status: 'published',
    approx_location_text: null,
    updated_at: nowIso
  },
  {
    burial_case_id: 'd7d0c770-1f6b-4bda-87f8-0efaa3a2f7f9',
    public_reference: 'MEM-0004',
    deceased_name: 'Paulo Henrique Nascimento',
    birth_date: '1971-11-02',
    death_date: '2021-08-30',
    cemetery_id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: '1fd1a1e2-6a7f-49d8-9fd4-1d73efab2cc4',
    location_code: 'Q2-JZ-03',
    location_label: 'Jazigo 3',
    location_text:
      'Após o portão principal, siga reto até o final da alameda. A Quadra 2 fica logo após a Capela; o Jazigo 3 está na fileira central.',
    sector_id: 'd3c59c6f-0a5f-4c9b-8d1c-4f3d3b3d3b12',
    sector_code: 'S1',
    sector_name: 'Setor 1',
    quadra_id: '6fa7a3b1-42a6-4b19-a83b-0df0d6ce8c36',
    quadra_code: 'Q2',
    quadra_name: 'Quadra 2',
    map_node_id: 'e6f0c1a2-7d11-4e1a-84d0-83d598fb1f4b',
    map_x: 40,
    map_y: 260,
    map_w: 240,
    map_h: 160,
    status: 'published',
    approx_location_text: null,
    updated_at: nowIso
  },
  {
    burial_case_id: '5f3b8f5e-9e09-46b4-8bb9-6dc2a2e043a1',
    public_reference: 'MEM-0002',
    deceased_name: 'José Carlos Almeida',
    birth_date: '1939-01-13',
    death_date: '2012-06-02',
    cemetery_id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: null,
    location_code: null,
    location_label: null,
    location_text: null,
    sector_id: null,
    sector_code: null,
    sector_name: null,
    quadra_id: null,
    quadra_code: null,
    quadra_name: null,
    map_node_id: null,
    map_x: null,
    map_y: null,
    map_w: null,
    map_h: null,
    status: 'not_found_precisely',
    approx_location_text: 'Indícios: Setor 2, próximo à capela. Localização exata pendente de revisão.',
    updated_at: nowIso
  },
  {
    burial_case_id: '84f0b6e3-4a2f-4d78-9a28-9b5c4d3f42d1',
    public_reference: 'MEM-0005',
    deceased_name: 'João Batista Oliveira',
    birth_date: '1940-05-23',
    death_date: '2016-12-04',
    cemetery_id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    cemetery_name: 'Cemitério Municipal Central',
    current_location_id: '6e60e57e-6a8b-4d39-a0c2-14db9c214a1a',
    location_code: 'Q5-NC-18',
    location_label: 'Nicho 18',
    location_text:
      'Siga pela alameda lateral até a área dos nichos. A Quadra 5 fica do lado oposto à Capela; o Nicho 18 está na segunda coluna.',
    sector_id: '4d8b20d0-6a15-4f2f-9ff4-2a0e2dc1a1a5',
    sector_code: 'S2',
    sector_name: 'Setor 2',
    quadra_id: 'f63b9cc3-073b-4f5f-bd5c-3f4e0f59c2f0',
    quadra_code: 'Q5',
    quadra_name: 'Quadra 5',
    map_node_id: 'c2a2d10e-5dbd-4d5c-9a2b-055c7b60b6c8',
    map_x: 300,
    map_y: 260,
    map_w: 240,
    map_h: 160,
    status: 'published',
    approx_location_text: null,
    updated_at: nowIso
  }
];

export function mockPublicSearch(q: string, cemeteryId?: string): PublicDeceasedSearchItem[] {
  const t = q.toLowerCase();
  return ITEMS.filter((i) => {
    const matchesText =
      i.deceased_name.toLowerCase().includes(t) ||
      (i.public_reference || '').toLowerCase().includes(t) ||
      (i.location_code || '').toLowerCase().includes(t);
    const matchesCemetery = cemeteryId ? i.cemetery_id === cemeteryId : true;
    return matchesText && matchesCemetery;
  });
}

export function mockPublicDetail(burialCaseId: string): PublicDeceasedDetail {
  const item = ITEMS.find((i) => i.burial_case_id === burialCaseId) || ITEMS[0];
  return {
    ...item,
    last_movement_type: item.current_location_id ? 'interment' : null,
    last_occurred_on: item.death_date,
    last_recorded_at: nowIso
  };
}
