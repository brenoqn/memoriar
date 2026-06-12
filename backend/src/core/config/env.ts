import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  FRONTEND_ORIGIN: z.string().default('http://localhost:4200'),
  USE_MOCKS: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional()
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

