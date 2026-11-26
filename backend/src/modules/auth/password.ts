import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

// Hash de senha com scrypt (nativo do Node, sem dependência externa).
// Formato armazenado: scrypt$<N>$<r>$<p>$<salt base64>$<hash base64>
const N = 16_384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const SALT_BYTES = 16;
const MAX_MEMORY = 64 * 1024 * 1024;

function derive(password: string, salt: Buffer, n: number, r: number, p: number, length: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, length, { N: n, r, p, maxmem: MAX_MEMORY }, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await derive(password, salt, N, R, P, KEY_LENGTH);
  return ['scrypt', N, R, P, salt.toString('base64'), key.toString('base64')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, nRaw, rRaw, pRaw, saltB64, hashB64] = parts;
  const n = Number(nRaw);
  const r = Number(rRaw);
  const p = Number(pRaw);
  if (![n, r, p].every((v) => Number.isInteger(v) && v > 0)) return false;

  const expected = Buffer.from(hashB64, 'base64');
  const actual = await derive(password, Buffer.from(saltB64, 'base64'), n, r, p, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// Hash fixo usado quando o e-mail não existe, para que a resposta leve o mesmo tempo.
let dummyHash: Promise<string> | null = null;
export function getDummyHash() {
  if (!dummyHash) dummyHash = hashPassword(randomBytes(16).toString('hex'));
  return dummyHash;
}
