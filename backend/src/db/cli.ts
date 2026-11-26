import { createInterface } from 'node:readline';

import { z } from 'zod';

import { hashPassword } from '../modules/auth/password.js';
import { closePool, getPool, withTransaction } from './pool.js';
import { runDemoSeed, runMigrations } from './migrations.js';

const USAGE = `Uso: node dist/db/cli.js <comando>

Comandos:
  migrate        Aplica as migrations pendentes de db/migrations.
  seed           Aplica os DADOS DEMONSTRATIVOS de db/seeds/demo_seed.sql (idempotente).
  create-admin   Cria um usuário administrativo.
                 Variáveis: ADMIN_EMAIL (obrigatória), ADMIN_ROLE (admin|editor|viewer, padrão admin),
                 ADMIN_NAME (opcional). A senha vem de ADMIN_PASSWORD ou, se ausente, da entrada padrão
                 (uma linha). Use --update para redefinir senha/papel de um usuário existente.`;

async function readPasswordFromStdin(): Promise<string> {
  const rl = createInterface({ input: process.stdin, terminal: false });
  for await (const line of rl) {
    rl.close();
    return line.replace(/\r$/, '');
  }
  return '';
}

async function createAdmin(update: boolean) {
  const email = (process.env.ADMIN_EMAIL || '').trim();
  const roleKey = (process.env.ADMIN_ROLE || 'admin').trim();
  const displayName = (process.env.ADMIN_NAME || '').trim() || null;
  // Mesma validação do login, para não criar um usuário que não conseguiria entrar.
  if (!z.string().email().max(254).safeParse(email).success) throw new Error('Informe ADMIN_EMAIL válido.');
  if (!['admin', 'editor', 'viewer'].includes(roleKey)) throw new Error('ADMIN_ROLE deve ser admin, editor ou viewer.');

  const password = process.env.ADMIN_PASSWORD ?? (await readPasswordFromStdin());
  if (password.length < 12 || password.length > 128) {
    throw new Error('A senha deve ter entre 12 e 128 caracteres.');
  }
  const passwordHash = await hashPassword(password);

  const outcome = await withTransaction(async (client) => {
    const role = await client.query<{ id: string }>('select id from app_roles where key = $1', [roleKey]);
    if (!role.rows[0]) throw new Error(`Papel ${roleKey} não encontrado. Rode "migrate" antes.`);

    const existing = await client.query<{ id: string }>('select id from app_users where lower(email) = lower($1)', [
      email
    ]);
    if (existing.rows[0]) {
      if (!update) throw new Error('Já existe um usuário com esse e-mail. Use --update para redefinir.');
      await client.query(
        `update app_users
            set password_hash = $2, role_id = $3, is_active = true, display_name = coalesce($4, display_name)
          where id = $1`,
        [existing.rows[0].id, passwordHash, role.rows[0].id, displayName]
      );
      return 'atualizado';
    }
    await client.query(
      'insert into app_users (email, password_hash, display_name, role_id) values ($1, $2, $3, $4)',
      [email, passwordHash, displayName, role.rows[0].id]
    );
    return 'criado';
  });

  process.stdout.write(`Usuário ${email} (${roleKey}) ${outcome}.\n`);
}

async function main() {
  const [command, ...flags] = process.argv.slice(2);
  switch (command) {
    case 'migrate': {
      const result = await runMigrations(getPool());
      process.stdout.write(
        result.applied.length
          ? `Migrations aplicadas: ${result.applied.join(', ')}\n`
          : 'Nenhuma migration pendente.\n'
      );
      break;
    }
    case 'seed':
      await runDemoSeed(getPool());
      process.stdout.write('Seed demonstrativo aplicado.\n');
      break;
    case 'create-admin':
      await createAdmin(flags.includes('--update'));
      break;
    default:
      process.stdout.write(`${USAGE}\n`);
      process.exitCode = command ? 1 : 0;
  }
}

main()
  .catch((err: Error) => {
    process.stderr.write(`Erro: ${err.message}\n`);
    process.exitCode = 1;
  })
  .finally(() => closePool());
