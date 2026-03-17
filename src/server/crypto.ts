// src/server/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error("ENCRYPTION_KEY not configured");
  }
  return Buffer.from(keyHex, "hex");
}

export function encrypt(plaintext: string): { ciphertext: string; iv: string } {
  const key = getKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return {
    ciphertext: encrypted.toString("hex"),
    iv: iv.toString("hex"),
  };
}

export function decrypt(ciphertext: string, iv: string): string {
  const key = getKey();
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(ciphertext, "hex"),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function generateHint(key: string): string {
  return `...${key.slice(-4)}`;
}
