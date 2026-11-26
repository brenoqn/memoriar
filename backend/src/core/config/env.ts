import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  FRONTEND_ORIGIN: z.string().default('http://localhost:4200'),
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL é obrigatório' })
    .min(1, 'DATABASE_URL é obrigatório')
    .refine((v) => v.startsWith('postgres://') || v.startsWith('postgresql://'), {
      message: 'DATABASE_URL deve começar com postgres:// ou postgresql://'
    }),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().max(50).default(5),
  JWT_SECRET: z
    .string({ required_error: 'JWT_SECRET é obrigatório' })
    .min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  JWT_EXPIRES_IN_MINUTES: z.coerce.number().int().positive().max(24 * 60).default(480)
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Configuração inválida do backend:\n${problems}`);
  }
  return parsed.data;
}

export const env: Env = parseEnv();
