import { omit, get } from 'lodash';
import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, QueryOptions } from 'mongoose';
import config from 'config';
import userModel, { User } from '@/models/user.model';
import { excludedFields } from '@/controllers/auth.controller';
import { signJwt } from '@/utils/jwt';
import redisClient from '@/utils/connectRedis';

// CreateUser service
export const createUser = async (input: Partial<User>) => {
  const user = await userModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

// Find User by id
export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};

// Find All users
export const findAllUsers = async () => {
  return await userModel.find();
};

// Find one user by any fields
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  /* When using string syntax, prefixing a path with "-" 
  will flag that path as excluded. When a path does 
  not have the "-" prefix, it is included. Lastly, 
  if a path is prefixed with "+", it forces inclusion 
  of the path, which is useful for paths excluded at the schema level. */
  return await userModel.findOne(query, {}, options).select('+password');
};

// Sign Token
export const signToken = async (user: DocumentType<User>) => {
  // Sign the access token
  const access_token = signJwt({ sub: user._id }, 'access', {
    expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
  });

  // Sign the refresh token
  const refresh_token = signJwt({ sub: user._id }, 'refresh', {
    expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
  });

  // Create a session
  redisClient.set(user._id.toString(), JSON.stringify(user), {
    EX: 60 * 60,
  });

  // Return access token
  return { access_token, refresh_token };
};
