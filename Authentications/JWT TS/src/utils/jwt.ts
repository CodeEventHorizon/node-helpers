import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';
import fs from 'fs';

const privateKeyPath: string = process.cwd() + '/config/private_key.pem';
const publicKeyPath: string = process.cwd() + '/config/public_key.pem';

export const signJwt = (payload: Object, options: SignOptions = {}) => {
  console.log();
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    return jwt.verify(token, publicKey) as T;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
};
