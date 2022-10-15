import * as argon from 'argon2';

export const encryptPassword = (rawPassword: string) => argon.hash(rawPassword);

export const verifyPassword = (userHash: string, rawPassword: string) =>
  argon.verify(userHash, rawPassword);
