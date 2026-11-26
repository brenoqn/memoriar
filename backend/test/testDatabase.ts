// Banco usado pelos testes. Precisa ser um banco descartável: o preparo global apaga o schema public.
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://memoriar_user:memoriar_local_dev@localhost:5432/memoriar_test';

export const TEST_JWT_SECRET = 'segredo-apenas-para-testes-automatizados-0123456789';

export const TEST_USERS = {
  admin: { email: 'admin.teste@memoriar.local', password: 'senha-admin-teste-123', role: 'admin' },
  editor: { email: 'editor.teste@memoriar.local', password: 'senha-editor-teste-123', role: 'editor' },
  viewer: { email: 'viewer.teste@memoriar.local', password: 'senha-viewer-teste-123', role: 'viewer' },
  inactive: { email: 'inativo.teste@memoriar.local', password: 'senha-inativo-teste-123', role: 'admin' }
} as const;

export function assertDisposableDatabase(url: string) {
  const dbName = new URL(url).pathname.replace(/^\//, '');
  if (!dbName.endsWith('_test')) {
    throw new Error(
      `Recusado: os testes apagam o schema do banco, e "${dbName}" não termina com _test. ` +
        'Defina TEST_DATABASE_URL apontando para um banco de teste descartável.'
    );
  }
}
