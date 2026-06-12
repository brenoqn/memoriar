import type { MapNode } from '@memoriar/shared';

const NODES: MapNode[] = [
  {
    id: '3b8dbd69-e31a-4d29-9256-4c5c0d9e9b51',
    cemetery_id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    node_type: 'quadra',
    x: 40,
    y: 80,
    w: 240,
    h: 160,
    label: 'Quadra 1',
    status: 'published'
  },
  {
    id: 'e6f0c1a2-7d11-4e1a-84d0-83d598fb1f4b',
    cemetery_id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    node_type: 'quadra',
    x: 40,
    y: 260,
    w: 240,
    h: 160,
    label: 'Quadra 2',
    status: 'published'
  },
  {
    id: 'c2a2d10e-5dbd-4d5c-9a2b-055c7b60b6c8',
    cemetery_id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    node_type: 'quadra',
    x: 300,
    y: 260,
    w: 240,
    h: 160,
    label: 'Quadra 5',
    status: 'published'
  },
  {
    id: '7b9a0a58-9d1a-4f2d-8d4c-1fef1d7e3b32',
    cemetery_id: 'a3f0a5b7-03a2-4d80-8c2b-2c5e5d85b1f3',
    node_type: 'referencia',
    x: 320,
    y: 80,
    w: 180,
    h: 80,
    label: 'Capela',
    status: 'published'
  }
];

export function mockMapNodes(cemeteryId: string): MapNode[] {
  return NODES.filter((n) => n.cemetery_id === cemeteryId);
}
