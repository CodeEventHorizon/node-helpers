import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';
import fs from 'fs';

// Key is either 'access' or 'refresh'
// Use other method in production to retrieve keys

export const signJwt = (
  payload: Object,
  key: 'access' | 'refresh',
  options: SignOptions = {}
) => {
  const privateKeyPath: string =
    process.cwd() + `/config/${key}_private_key.pem`;
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(
  token: string,
  key: 'access' | 'refresh'
): T | null => {
  try {
    const publicKeyPath: string =
      process.cwd() + `/config/${key}_public_key.pem`;
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    return jwt.verify(token, publicKey) as T;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
};
