import 'dotenv/config';
import { z } from 'zod';

// Configuração mínima de banco, separada de env.ts para que a CLI (migrate, seed, create-admin)
// rode só com DATABASE_URL, sem exigir JWT_SECRET ou outras variáveis da API.
export const databaseEnvSchema = z.object({
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL é obrigatório' })
    .min(1, 'DATABASE_URL é obrigatório')
    .refine((v) => v.startsWith('postgres://') || v.startsWith('postgresql://'), {
      message: 'DATABASE_URL deve começar com postgres:// ou postgresql://'
    }),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().max(50).default(5)
});

export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;

export function readDatabaseEnv(source: NodeJS.ProcessEnv = process.env): DatabaseEnv {
  const parsed = databaseEnvSchema.safeParse(source);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Configuração inválida do banco:\n${problems}`);
  }
  return parsed.data;
}
